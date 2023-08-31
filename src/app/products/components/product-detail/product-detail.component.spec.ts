import { ActivatedRouteStub, asyncData, getText, mockObservable } from './../../../../testing';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProductDetailComponent } from './product-detail.component';
import { ProductsService } from 'src/app/services/product.service';
import { Location } from '@angular/common';
import { generateOneProduct } from 'src/app/models/product.mock';


describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let route: ActivatedRouteStub;
  let productsService: jasmine.SpyObj<ProductsService>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const routeStub = new ActivatedRouteStub();
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getOne']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [ ProductDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: Location, useValue: locationSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute) as unknown as ActivatedRouteStub;
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    route.setQueryParamMap({});
  });

  it('should create', () => {
    // Debe hacerse mocking de estos servicios antes del detectChanges ya que alli se corre el ngOnit
    const productId = '1';
    route.setParamMap({id: productId});
    //ccreamos un product pero le cambiamos el id
    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };
    productsService.getOne.and.returnValue(mockObservable(productMock));
    fixture.detectChanges(); // ngOnit
    expect(component).toBeTruthy();
  });

  it('should show the product in the view', () => {
    const productId = '2';
    route.setParamMap({id: productId});

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };
    productsService.getOne.and.returnValue(mockObservable(productMock));
    fixture.detectChanges(); // ngOnit
    const titleText = getText(fixture, 'title');
    const priceText = getText(fixture, 'price');
    expect(titleText).toContain(productMock.title);
    expect(priceText).toContain(productMock.price);
    expect(productsService.getOne).toHaveBeenCalledWith(productId);
  });

  it('should change the status "loading" => "success"', fakeAsync(() => {
    // Arrange
    const productId = '2';
    route.setParamMap({id: productId});

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };
    productsService.getOne.and.returnValue(asyncData(productMock));
    // Act
    fixture.detectChanges(); // ngOnit
    // Assert
    expect(component.status).toEqual('loading');
    tick();  // exec pending tasks
    fixture.detectChanges();
    expect(component.status).toEqual('success');
  }));

  it('should typeCustomer be "customer"', () => {
    // Arrange
    const productId = '2';
    route.setParamMap({id: productId});
    route.setQueryParamMap({type: 'customer'});

    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };
    productsService.getOne.and.returnValue(mockObservable(productMock));
    // Act
    fixture.detectChanges(); // ngOnit
    // Assert
    expect(component.typeCustomer).toEqual('customer');

  });

  it('should call goToBack with unknown product id', () => {
    route.setParamMap({});

    location.back.and.callThrough();
    fixture.detectChanges(); // ngOnit

    expect(location.back).toHaveBeenCalled();
  });

});
