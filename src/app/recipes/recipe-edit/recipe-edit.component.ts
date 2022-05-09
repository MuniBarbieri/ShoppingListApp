import { Recipe } from './../recipe.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from "../../store/app.reducer"
import { map, Subscription } from 'rxjs';
import * as RecipesActions from "../store/recipes.actions"


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number
  editMode = false;
  private storeSubscription : Subscription
  recipeForm : FormGroup

  constructor(private route: ActivatedRoute,  private router: Router, private store: Store<fromApp.AppState>) { }

    get controls() { // a getter!
  return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']
      this.editMode = params['id'] != null
      this.initForm()
    })
  }


  private initForm() {


    let recipeName = ''
    let recipeImagePath = ''
    let recipeDescription = ''
    let recipeIngredients = new FormArray([])

    if (this.editMode) {

      this.storeSubscription = this.store
        .select('recipes')
        .pipe(
          map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id
        })
          }))
        .subscribe(recipe => {
      recipeName = recipe.name
      recipeImagePath = recipe.imagePath
      recipeDescription = recipe.description

      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(new FormGroup({
            'name': new FormControl(ingredient.name,Validators.required),
            'amount': new FormControl(ingredient.amount,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }))
        }
      }
      })
    }

   this.recipeForm = new FormGroup({
     'name':  new FormControl(recipeName,Validators.required) ,
     'imagePath':  new FormControl(recipeImagePath,Validators.required),
     'description': new FormControl(recipeDescription,Validators.required),
     'ingredients': recipeIngredients
   })

  }

      onCancel() {
    this.router.navigate(['../'],{relativeTo: this.route})
  }


  onSubmit() {

    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients'])



    if (this.editMode) {
      this.store.dispatch(new RecipesActions.UpdateRecipe({index:this.id, newRecipe: this.recipeForm.value}))
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(newRecipe))
    }
      this.onCancel()
  }



  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
     })
   )
  }

  onDeleteIngredient(index: number) {


    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index)
  }

  ngOnDestroy(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe()
    }
  }

}

