import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import { switchMap, withLatestFrom, map, take } from 'rxjs/operators';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {Store} from '@ngrx/store';

import * as RecipeActions from '../store/recipe.actions';
import {Recipe} from '../recipe.model';
import * as fromRecipe from '../store/recipe.reducers';

@Injectable()
export class RecipeEffects {

  getUid() {
    let uid;
    this.store.pipe(take(1)).subscribe(store => uid = store.auth.uid);
    return uid;
  }

  @Effect()
  recipeFetch = this.actions$
    .ofType(RecipeActions.FETCH_RECIPES)
    .pipe(switchMap((action: RecipeActions.FetchRecipes) => {
      return this.httpClient.get<Recipe[]>(`https://ng-recipe-book-a41a5.firebaseio.com/users/${this.getUid()}/recipes.json`, {
        observe: 'body',
        responseType: 'json'
      });
    }), map(
      (recipes) => {
        for (const recipe of recipes) {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
        }
        return {
          type: RecipeActions.SET_RECIPES,
          payload: recipes
        };
      }
    ));

  @Effect({dispatch: false})
  recipeStore = this.actions$
    .ofType(RecipeActions.ADD_RECIPE, RecipeActions.UPDATE_RECIPE, RecipeActions.DELETE_RECIPE)
    .pipe(withLatestFrom(this.store.select('recipes')),
      switchMap(([action, state]) => {
        const req = new HttpRequest('PUT',
          `https://ng-recipe-book-a41a5.firebaseio.com/users/${this.getUid()}/recipes.json`, state.recipes, {reportProgress: true});
        return this.httpClient.request(req);
      }));

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<fromRecipe.FeatureState>) {
  }
}
