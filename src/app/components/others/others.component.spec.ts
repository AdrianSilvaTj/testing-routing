import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersComponent } from './others.component';
import { ProductsService } from 'src/app/services/product.service';
import { ReversePipe } from 'src/app/shared/pipes/reverse.pipe';

describe('OthersComponent', () => {
  let component: OthersComponent;
  let fixture: ComponentFixture<OthersComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;




  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);

    await TestBed.configureTestingModule({
      declarations: [ OthersComponent, ReversePipe ],
      providers: [{ provide: ProductsService, useValue: productsServiceSpy },]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersComponent);
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
});
