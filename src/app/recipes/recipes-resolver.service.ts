import { of, switchMap } from 'rxjs';
import { Recipe } from './recipe.model';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { map, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from "../store/app.reducer"
import * as RecipesActions from "../recipes/store/recipes.actions"
import { Actions, ofType } from '@ngrx/effects';

@Injectable({
  providedIn:"root"
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {

    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes
    }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes())
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1))
        } else {
          return of(recipes)
      }
    })
    )

  }

}

