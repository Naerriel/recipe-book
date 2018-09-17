import { Component, OnInit } from '@angular/core';
import * as RecipeActions from './store/recipe.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

}
