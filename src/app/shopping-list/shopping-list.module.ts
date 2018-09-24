import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { EffectsModule } from '@ngrx/effects';
import { ShoppingListEffects } from './store/shopping-list.effects';
import { RecipeEffects } from '../recipes/store/recipe.effects';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([ShoppingListEffects])
  ]
})
export class ShoppingListModule {}
