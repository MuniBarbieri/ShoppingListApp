import { Injectable } from '@angular/core';
import { Recipe } from './../recipe.model';
import { HttpClient } from '@angular/common/http';
import { map, switchMap,withLatestFrom } from 'rxjs';
import { Actions, Effect, ofType } from "@ngrx/effects";
import * as RecipesActions from "./recipes.actions"
import * as fromApp from "../../store/app.reducer"
import { Store } from '@ngrx/store';


@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap((fetchData) => {
       return this.http.get<Recipe[]>('https://ng-shoppinglist-3ffc7-default-rtdb.firebaseio.com/recipes.json')
    }),
    map(recipes => {
     return recipes.map(recipe => {
        return {...recipe,ingredients: recipe.ingredients ? recipe.ingredients :  []}
      })
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes)
    })
    )

  @Effect({
    dispatch:false
  })
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(
    this.store.select('recipes')
    ),
    switchMap( ([actionData, recipeState])=> {
      return this.http.put('https://ng-shoppinglist-3ffc7-default-rtdb.firebaseio.com/recipes.json',
        recipeState.recipes
      )

    })
    )

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}
}
