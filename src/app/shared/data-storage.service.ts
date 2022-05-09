import { Recipe } from './../recipes/recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from "../store/app.reducer"
import * as RecipesActions from "../recipes/store/recipes.actions"


@Injectable({
  providedIn:"root"
})
export class DataStorageService  {


  constructor(private http: HttpClient, private recipesService: RecipeService,private store: Store<fromApp.AppState>) {

  }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes()

    this.http.put('https://ng-shoppinglist-3ffc7-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
    })
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-shoppinglist-3ffc7-default-rtdb.firebaseio.com/recipes.json').pipe(
            map(recipes => {
     return recipes.map(recipe => {
        return {...recipe,ingredients: recipe.ingredients ? recipe.ingredients :  []}
      })
      }),
      tap(recipes => {
          this.store.dispatch(new RecipesActions.SetRecipes(recipes))
      })
        )
  }
}

