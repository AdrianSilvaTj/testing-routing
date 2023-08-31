import { ProductsService } from './../../services/product.service';
import { Product } from './../../models/product.model';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent{

  color = 'yellow';
  text = 'Un texto';
  products: Product[] = [];

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit(){
    this.productsService.getAll()
    .subscribe(products => this.products = products)
  }

}
