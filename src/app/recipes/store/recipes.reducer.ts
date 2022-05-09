import { Recipe } from './../recipe.model';
import * as RecipesActions from "./recipes.actions"


export interface State {
  recipes: Recipe[];

}

const initialState: State = {
  recipes:[]
}

export function recipesReducer(state:State = initialState , action: RecipesActions.RecipesActions ) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      }
    case RecipesActions.UPDATE_RECIPE:
      const { index, newRecipe } = action.payload;
      const recipesUpdated = state.recipes.filter((recipe, i ) => {
        return i !== index
      })
      recipesUpdated.push(newRecipe)
      return {
        ...state,
        recipes: recipesUpdated
      }
    case RecipesActions.DELETE_RECIPE:
      console.log("Delete reducer")
      return {
        ...state,
        recipes: state.recipes.filter((recipe,index) => {
          return index !== action.payload
        })
      }
    default:
      return state
  }
}

