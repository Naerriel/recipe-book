import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Component } from '@angular/core';

import { ShoppingListComponent } from './shopping-list.component';
import * as sinon from 'sinon';
import { Ingredient } from '../shared/ingredient.model';
import { shoppingListReducer, State } from './store/shopping-list.reducers';
import { reducers } from '../store/app.reducers';
import * as fromSLActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  template: '<p>Mock Shopping Edit Component</p>'
})
class MockShoppingEditComponent {}

@Component({
  selector: 'app-header',
  template: 'Mock Header Component'
})
class MockHeaderComponent {}
const initialIngredients = [
  new Ingredient('Apples', '5'),
  new Ingredient('Tomatoes', '10'),
];

describe('ShoppingListComponent', () => {
  let fixture: ComponentFixture<ShoppingListComponent>;
  let component: any;
  let compiled: any;
  let store: Store<State>;
  let dispatchSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShoppingListComponent,
        MockShoppingEditComponent
      ],
      imports: [
        StoreModule.forRoot({
          ...reducers,
          'shoppingList': shoppingListReducer
        })
      ]
    }).compileComponents();
    store = TestBed.get(Store);
    dispatchSpy = sinon.spy(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.debugElement.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    dispatchSpy.resetHistory();
    store.dispatch(new fromSLActions.AddIngredients(initialIngredients));
    fixture.detectChanges();
  });

  it('correctly renders', async(done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('onEditItem correctly dispatches START_EDIT action', async(done) => {
    expect(dispatchSpy.callCount).toBe(2);
    component.onEditItem(2);
    expect(dispatchSpy.callCount).toBe(3);
    done();
  });

  it('renders correct array of ingredients', async(done) => {
    expect(compiled.querySelectorAll('a').length).toBe(2);
    store.dispatch(new fromSLActions.AddIngredients(initialIngredients));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('a').length).toBe(4);
    done();
  });

  it('dispatches START_EDIT action upon clicking on ingredient', async(done) => {
    expect(dispatchSpy.getCall(1).args[0].type).toBe('FETCH_SL');
    compiled.querySelector('a').click();
    expect(dispatchSpy.getCall(2).args[0].type).toBe('START_EDIT');
    done();
  });

  it('deleting an ingredient correctly modifies whole list', async(done) => {
    expect(compiled.querySelectorAll('a').length).toBe(2);
    store.dispatch(new fromSLActions.StartEdit(0));
    store.dispatch(new fromSLActions.DeleteIngredient());
    fixture.detectChanges();
    expect(compiled.querySelectorAll('a').length).toBe(1);
    expect(compiled.querySelector('a').text).toBe(' Tomatoes (10) ');
    done();
  });
});
