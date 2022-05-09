import { User } from './../user.modl';
import { Router } from '@angular/router';
import { AuthResponseData, AuthService } from './../auth.service';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from "@ngrx/effects";
import { map, of, switchMap,catchError, tap, throwError } from "rxjs";
import * as AuthActions from "./auth.actions"
import { Injectable } from '@angular/core';


const handleAuthentication = (expiresIn:number, email:string,userId:string,token:string) => {
  const expirationDate = new Date(Date.now() + +expiresIn * 1000)
      const user = new User(
      email,
      userId,
      token,
      expirationDate
    )
      localStorage.setItem('userData', JSON.stringify(user))
             return new AuthActions.AuthenticateSuccess({
                  email,
                  userId,
                  token,
                  expirationDate,
                  redirect:true
             })


}

const handleError=  (errorRes) => {
   let errorMessage = 'An unknow error ocurred'


               if (!errorRes.error || !errorRes.error.error) {
                 return of(new AuthActions.AuthenticateFail(errorMessage))
               }


        switch (errorRes.error.error.message) {
                  case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already'
                break
                  case 'EMAIL_NOT_FOUND':
                errorMessage = 'The email does not exist.'
                break
                  case 'INVALID_PASSWORD':
                errorMessage = 'The password is not correct.'
                break
                }
     return of(new AuthActions.AuthenticateFail(errorMessage))
}

@Injectable()
export class AuthEffects {

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {

  }

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB3MXuMwSE1OnkJKVcRgZymjmnnqwLWJPg', {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
      }).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000)
        }),
        map(resData => {

        return handleAuthentication(+resData.expiresIn,resData.email,resData.localId,resData.idToken)

          }),
          catchError(errorRes => {
        return  handleError(errorRes)
        }),
         );
  })
  )

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return  this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB3MXuMwSE1OnkJKVcRgZymjmnnqwLWJPg',{
      email: authData.payload.email,
      password: authData.payload.password,
      returnSecureToken:true
        }
      )
        .pipe(
          tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000)
        }),
          map(resData => {
              return handleAuthentication(+resData.expiresIn,resData.email,resData.localId,resData.idToken)

          }),
          catchError(errorRes => {
              return  handleError(errorRes)
        }),
         )
    })
    )

  @Effect({
    dispatch:false
  })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
    if (authSuccessAction.payload.redirect) {
          this.router.navigate(['./'])
    }
  }))



  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
       const userData: { email: string; id: string; _token: string; _tokenExpirationDate: string} = JSON.parse(localStorage.getItem('userData'))
    if (!userData) return {type:'Dummy'}
    const {
      email,
      id,
      _token,
      _tokenExpirationDate
    } = userData

    const loadedUser = new User(email, id, _token, new Date(_tokenExpirationDate))

    if (loadedUser.token) {

      const {
        email,
        id,
        token,
      } = loadedUser
      const expirationDuration = new Date(_tokenExpirationDate).getTime() - new Date().getTime()

      this.authService.setLogoutTimer(expirationDuration)

      return new AuthActions.AuthenticateSuccess({
        email,
        userId:id,
        token,
        expirationDate: new Date(userData._tokenExpirationDate),
        redirect:false
      })

    }

      return {type:'Dummy'}
    })
    )

  @Effect({
    dispatch:false
  })
  authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
        this.authService.clearLogoutTimer()
    localStorage.removeItem('userData')
    this.router.navigate(['./auth']);
  }))
}


