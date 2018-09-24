import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'router-outlet',
  template: '<p class="router">Mock Router Outlet</p>'
})
class MockRouterOutletComponent {}

@Component({
  selector: 'app-header',
  template: '<p class="header">Mock Header Component</p>'
})
class MockHeaderComponent {}

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockRouterOutletComponent,
        MockHeaderComponent
      ],
      imports: [
      ],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render Header Component', async() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-header')).not.toBe(null);
  });

  it('should render Router Outlet', async() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('router-outlet')).not.toBe(null);
  });
});
