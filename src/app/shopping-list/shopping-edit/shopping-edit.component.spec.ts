import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';

import { ShoppingEditComponent } from './shopping-edit.component';
import * as sinon from 'sinon';
import { shoppingListReducer, State } from '../store/shopping-list.reducers';
import { Ingredient } from '../../shared/ingredient.model';
import { reducers } from '../../store/app.reducers';
import * as fromSLActions from '../store/shopping-list.actions';

const myIngredient = new Ingredient('walnut', '20');
const initialIngredients = [
  new Ingredient('Apples', '5'),
  new Ingredient('Tomatoes', '10'),
];

describe('Shopping Edit Component', () => {
  let fixture: ComponentFixture<ShoppingEditComponent>;
  let component: any;
  let compiled: any;
  let store: Store<State>;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShoppingEditComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
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
    fixture = TestBed.createComponent(ShoppingEditComponent);
    component = fixture.debugElement.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    dispatchSpy.resetHistory();
    store.dispatch(new fromSLActions.AddIngredients(initialIngredients));
    fixture.detectChanges();
  });

  it('correctly renders', () => {
    expect(component).toBeTruthy();
  });

  it('contains two inputs and three buttons', async(done) => {
    expect(compiled.querySelectorAll('input').length).toBe(2);
    expect(compiled.querySelectorAll('button').length).toBe(3);
    done();
  });

  describe('- delete button', () => {
    it('is disabled by default', async(done) => {
      expect(compiled.querySelector('.btn-danger').disabled).toBeTruthy();
      done();
    });

    it('and enabled in edit mode', async(done) => {
      component.editMode = true;
      fixture.detectChanges();
      expect(compiled.querySelector('.btn-danger').disabled).toBeFalsy();
      done();
    });
  });

  it('ingredientForm in component correctly binds values to template', async(done) => {
    await fixture.whenStable();
    const nameInput = compiled.querySelector('#name');
    component.ingredientForm.setValue({name: myIngredient.name, amount: myIngredient.amount});
    fixture.detectChanges();
    expect(nameInput.value).toBe(myIngredient.name);
    expect(compiled.querySelector('#amount').value).toBe(myIngredient.amount);

    nameInput.value = 'trololo';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.ingredientForm.value.name).toBe('trololo');
    done();
  });

  it('correctly clears form on onClear', async(done) => {
    await fixture.whenStable();

    component.ingredientForm.setValue({name: myIngredient.name, amount: myIngredient.amount});
    component.editMode = true;
    fixture.detectChanges();
    component.onClear();
    fixture.detectChanges();
    expect(component.ingredientForm.value.name).toBe(null);
    expect(component.ingredientForm.value.amount).toBe(null);
    expect(component.editMode).toBeFalsy();
    done();
  });

  it('correctly sets value on ingredient from store', async(done) => {
    await fixture.whenStable();

    expect(compiled.querySelector('#name').value).toBe('');
    expect(compiled.querySelector('#amount').value).toBe('');
    store.dispatch(new fromSLActions.StartEdit(0));
    fixture.detectChanges();
    expect(component.editMode).toBeTruthy();
    expect(component.ingredientForm.value.name).toBe(initialIngredients[0].name);
    expect(component.ingredientForm.value.amount).toBe(initialIngredients[0].amount);
    done();
  });

  it('onDelete is correctly fired and dispatches action', async(done) => {

    store.dispatch(new fromSLActions.StartEdit(0));
    fixture.detectChanges();
    expect(component.ingredientForm.value.name).toBe(initialIngredients[0].name);

    compiled.querySelector('.btn-danger').click();
    expect(component.ingredientForm.value.name).toBe(null);
    expect(component.ingredientForm.value.amount).toBe(null);
    expect(dispatchSpy.getCall(2).args[0].type).toBe('DELETE_INGREDIENT');
    done();
  });

  it('correctly overwrites edit mode', async(done) => {

    store.dispatch(new fromSLActions.StartEdit(0));
    fixture.detectChanges();
    expect(component.editMode).toBeTruthy();

    store.dispatch(new fromSLActions.StopEdit());
    fixture.detectChanges();
    expect(component.editMode).toBeFalsy();
    done();
  });

  describe('onSubmit', () => {

    it('correctly dispatches updateIngredient', async(done) => {
      component.editMode = true;
      component.ingredientForm.value = {name: 'myName', amount: 'myAmount'};
      component.onSubmit();

      const ingredient = dispatchSpy.getCall(1).args[0].payload.ingredient;
      expect(dispatchSpy.getCall(1).args[0].type).toBe('UPDATE_INGREDIENT');
      expect(ingredient.name).toBe('myName');
      expect(ingredient.amount).toBe('myAmount');
      done();
    });

    it('correctly dispatches addIngredient', async(done) => {
      component.ingredientForm.value = {name: 'myName', amount: 'myAmount'};
      component.onSubmit();
      const ingredient = dispatchSpy.getCall(1).args[0].payload;
      expect(dispatchSpy.getCall(1).args[0].type).toBe('ADD_INGREDIENT');
      expect(ingredient.name).toBe('myName');
      expect(ingredient.amount).toBe('myAmount');
      done();
    });

    it('correctly is fired from the template', async(done) => {
      component.ingredientForm.setValue({name: 'myName', amount: 'myAmount'});
      fixture.detectChanges();
      compiled.querySelector('.btn-success').click();
      expect(dispatchSpy.getCall(1).args[0].type).toBe('ADD_INGREDIENT');
      done();
    });
  });
});
