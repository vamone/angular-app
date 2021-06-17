import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductService } from 'src/app/_services/product.service';

@Component({
    templateUrl: 'app.home.html',
    providers: [ProductService]
})

export class HomeComponent implements OnInit {
    products: Product[];

    isLoading = false;

    constructor(private productService: ProductService) {
        this.products = [];
    }

    ngOnInit() {
        this.isLoading = true;
        this.productService.getProducts().subscribe(x => {
            this.products = x;
            this.isLoading = false;
        });
    }

}