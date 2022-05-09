import { Subject } from 'rxjs';
import { Ingredient } from './../shared/ingredient.model';

export class ShoppingListService {

  startedEditing = new Subject<number>()



  ingredientsChanged = new Subject<Ingredient[]>();


    private ingredients: Ingredient [] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 10)
    ]



  getIngredients() {
    return this.ingredients.slice()
  }


  getIngredient(index:number) {
    return this.ingredients[index]
  }


  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient
    this.ingredientsChanged.next(this.ingredients.slice())
  }



  addIngredient(newIngredient) {
    this.ingredients.push(newIngredient)
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  addIngredients(ingredients : Ingredient[]) {
    this.ingredients.push(...ingredients)
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  deleteIngredient(ingredientIndex) {
      this.ingredients.splice(ingredientIndex,1)
      this.ingredientsChanged.next((this.ingredients.slice()))
  }


}
