import { AuthService } from './../auth/auth.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from "../store/app.reducer"
import * as AuthActions from "../auth/store/auth.actions"
import * as RecipesActions from "../recipes/store/recipes.actions"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})

export class HeaderComponent implements OnInit, OnDestroy  {

  isAuthenticated = false
  userSub: Subscription

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>) {

  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(map(authState => {
      return authState.user
    })).subscribe((user) => {
        this.isAuthenticated = !!user
      })
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe()
  }

  onSaveData() {
    this.dataStorageService.storeRecipes()
    this.store.dispatch(new RecipesActions.StoreRecipes())
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes())
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout())
  }

}

