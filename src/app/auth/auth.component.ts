import { PlaceHolderDirective } from './../shared/placeholder/placeholder.directive';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AlertComponent } from '../shared/alert/alert.component';
import { Store } from '@ngrx/store';
import * as  fromApp from "../store/app.reducer"
import * as AuthActions from "../auth/store/auth.actions"

@Component({
  selector: 'app-auth',
  templateUrl:'./auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true
  isLoading = false
  error: string = null
  private closeSub: Subscription
  private storeSub: Subscription


  @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private store:Store<fromApp.AppState>){}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

    onHandleError() {
      this.store.dispatch(new AuthActions.ClearError())
    }

  ngOnInit() {
   this.storeSub =  this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading
      this.error = authState.authError
      if (this.error) {
        this.showErrorAlert(this.error)
      }
    })
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
     this.closeSub.unsubscribe()
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe()
    }
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear()
   const componentRef = hostViewContainerRef.createComponent(alertComponentFactory)

    componentRef.instance.message = message
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      hostViewContainerRef.clear()
    })
  }

  onSubmit(form: NgForm) {

    if (!form.valid) return
    const email = form.value.email
    const password = form.value.password


    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({email,password}))
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email,password}))
    }
  }

 }
