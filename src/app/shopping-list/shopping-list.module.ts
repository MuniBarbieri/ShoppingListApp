import { SharedModule } from './../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ShoppingListRouterModule } from './shopping-list.routing.module';
import { ShoppingListComponent } from './shopping-list.component';
import { NgModule } from "@angular/core";
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    ShoppingListRouterModule,
    FormsModule,
    SharedModule],
})
export class ShoppingListModule { }
