import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as ShoppingListActions from './shopping-list.actions';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import { Ingredient } from '../../shared/ingredient.model';

@Injectable()
export class ShoppingListEffects {

  getUid() {
    let uid;
    this.store.pipe(take(1)).subscribe(store => uid = store.auth.uid);
    return uid;
  }

  @Effect()
  fetchSL = this.actions$
    .ofType(ShoppingListActions.FETCH_SL)
    .pipe(switchMap((action: ShoppingListActions.FetchSL) => {
      return this.httpClient.get<Ingredient[]>(`https://ng-recipe-book-a41a5.firebaseio.com/users/${this.getUid()}/shopping-list.json`);
    }),
      map((ingredients: Ingredient[]) => {
        return {
          type: ShoppingListActions.SET_INGREDEINTS,
          payload: ingredients ? ingredients : []
        };
      }));

  @Effect({dispatch: false})
  storeSL = this.actions$
    .ofType(
      ShoppingListActions.ADD_INGREDIENTS,
      ShoppingListActions.ADD_INGREDIENT,
      ShoppingListActions.UPDATE_INGREDIENT,
      ShoppingListActions.DELETE_INGREDIENT)
    .pipe(withLatestFrom(this.store.select('shoppingList')),
      switchMap(([action, state]) => {
        const req = new HttpRequest('PUT',
          `https://ng-recipe-book-a41a5.firebaseio.com/users/${this.getUid()}/shopping-list.json`,
          state.ingredients);
        return this.httpClient.request(req);
      }));

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<AppState>) {}
}
