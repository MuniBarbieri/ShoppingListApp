import * as ShoppingListActions  from './../shopping-list/store/shopping-list.actions';
import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Ingredient } from './../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from "../store/app.reducer"

@Injectable()
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>()

  constructor(private store:Store<fromApp.AppState>) {

    }

  private recipes: Recipe[] = []


  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe)
    this.recipesChanged.next(this.recipes.slice())
  }

  updateRecipe(index:number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe
        this.recipesChanged.next(this.recipes.slice())

  }

  deleteRecipe(index:number) {
    this.recipes.splice(index, 1)
    this.recipesChanged.next(this.recipes.slice())
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes
        this.recipesChanged.next(this.recipes.slice())

  }

  addIngredientsToShoppingList(ingredients : Ingredient[]) {
      this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
  }



    getRecipes() {
    return this.recipes.slice()
  }

  getRecipe(index:number) {
    return this.recipes[index]
  }


}

