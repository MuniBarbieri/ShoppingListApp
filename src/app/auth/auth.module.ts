import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [AuthComponent],
  imports:[
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([  {path:'', component: AuthComponent}
])]
})
export class AuthModule {
}
