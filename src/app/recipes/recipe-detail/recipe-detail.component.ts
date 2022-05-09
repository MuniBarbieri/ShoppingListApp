import { switchMap } from 'rxjs';
import { RecipeService } from './../recipe.service';
import { Recipe } from './../recipe.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromApp from "../../store/app.reducer"
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import * as RecipesAction from "../store/recipes.actions"

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],

})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe
  id:number


  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router:Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.route.params.pipe(
      map(params => {
      return +params['id']
      }),
      switchMap(id => {
      this.id = id
      return this.store.select('recipes')
      }),
      map(recipesSate => {
        return recipesSate.recipes.find((recipe, index) => {
          return index === this.id
        })
      }))
      .subscribe(recipe => {
        this.recipe = recipe
      })
    console.log("THIS RECIPEE",this.recipe)
    }

    onAddToShoppingList() {
      this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
    }

  onEditRecipe() {

    this.router.navigate(['edit'], { relativeTo: this.route })

  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesAction.DeleteRecipe(this.id))
    this.router.navigate(['/recipes'])
  }

}

