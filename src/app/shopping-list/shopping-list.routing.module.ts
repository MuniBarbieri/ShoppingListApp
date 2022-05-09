import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core"
import { ShoppingListComponent } from "./shopping-list.component"



const shoppingListRoots = [
  { path: '', component: ShoppingListComponent }
]

@NgModule({
  imports: [RouterModule.forChild(shoppingListRoots)],
  exports:[RouterModule]
})

export class ShoppingListRouterModule{}
