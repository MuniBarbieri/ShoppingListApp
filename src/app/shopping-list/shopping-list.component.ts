import { LoggingService } from './../logging.service';
import { Ingredient } from './../shared/ingredient.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingListService } from './shopping-list.service';
import { Subscription,map } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions"
import * as fromApp  from "../store/app.reducer"

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {


  ingredients: Ingredient[]
  subscription: Subscription




  constructor(
    private shoppingListService: ShoppingListService,
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    console.log("Ingredients",this.ingredients)

    this.subscription = this.store.select('shoppingList').pipe(
      map(shoppingListState => {
       return shoppingListState.ingredients
      })
    ).subscribe(ingredients => {
      this.ingredients = ingredients
    })

  }

  ngOnDestroy(): void {
  }

  onEditItem(index:number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }

}

