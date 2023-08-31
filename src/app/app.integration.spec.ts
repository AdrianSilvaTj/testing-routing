import { AuthService } from './services/auth.service';
import { generateManyProducts } from './models/product.mock';
import { queryAllByDirective, clickElement, query, asyncData, getText, mockObservable } from 'src/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { routes } from './app-routing.module';
import { AppModule } from './app.module';
import { ProductsService } from './services/product.service';
import { generateOneUser } from './models/user.mock';

/* Creamos componentes falsos */
// @Component({
//   selector: 'app-pico-preview',
// })
// class PicoPreviewComponent{}
// @Component({
//   selector: 'app-people',
// })
// class PeopleComponent{}
// @Component({
//   selector: 'app-others',
// })
// class OthersComponent{}

// const routes = [
//   {
//     path: 'pico-preview',
//     component: PicoPreviewComponent
//   },
//   {
//     path: 'people',
//     component: PeopleComponent
//   },
//   {
//     path: 'others',
//     component: OthersComponent
//   },
// ]

describe('AppComponent Integrations Test', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let productService: jasmine.SpyObj<ProductsService>;
  let authService: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    await TestBed.configureTestingModule({
      imports: [
        // le indicamos al router testing module que trabajara con esas rutas
        AppModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      // declarations: [
      //   AppComponent,
      //   PicoPreviewComponent,
      //   PeopleComponent,
      //   OthersComponent
      // ],
      // le indicamos que ignore elementos no encontrados
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // providers
    router = TestBed.inject(Router);
    // inicializar la navegación
    router.initialNavigation();
    // espera mientras se inicializa la navegación
    tick();
    fixture.detectChanges();
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have 7 routerLinks', () => {
    // Arrange
    // RouterLinkWithHref - con el podremos hacer click sobre los links
    const links = queryAllByDirective(fixture, RouterLinkWithHref);
    expect(links.length).toEqual(7);
  });

  it('should render other component when clicked with session', fakeAsync(() => {
    // Arrange
    const productsMocks = generateManyProducts(10);
    productService.getAll.and.returnValue(asyncData(productsMocks));

    const userMock = generateOneUser();
    authService.getUser.and.returnValue(mockObservable(userMock));
    // Act
    clickElement(fixture, 'others-link', true);
    tick();// espera navegación
    fixture.detectChanges(); // ngOnInit - OtherComponent
    tick();// ejecuta el asynData
    fixture.detectChanges();
    //Assert
    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).withContext('to be Truthy').toBeTruthy();
    const text = getText(fixture, 'products-length');
    expect(text).toContain(productsMocks.length);
  }));

  it('should render other component when clicked without session', fakeAsync(() => {
    // Arrange
    authService.getUser.and.returnValue(mockObservable(null));
    // Act
    clickElement(fixture, 'others-link', true);
    tick();// espera navegación
    fixture.detectChanges(); // ngOnInit - OtherComponent
    //Assert
    expect(router.url).toEqual('/');

  }));

  it('should render PicoPreviewComponent when clicked', fakeAsync(() => {
    clickElement(fixture, 'pico-link', true);

    tick(); // wait while nav...
    fixture.detectChanges(); // ngOnInit - PicoPreviewComponent

    expect(router.url).toEqual('/pico-preview');
    const element = query(fixture, 'app-pico-preview');
    expect(element).not.toBeNull();
  }));

});
