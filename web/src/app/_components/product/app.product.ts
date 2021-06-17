import {  Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/_models/product';
import { ProductService } from 'src/app/_services/product.service';

@Component({
    templateUrl: 'app.product.html',
    providers: [ProductService]
})

export class ProductComponent implements OnInit {
   
    id: number;
    product: Product;

    isLoading = false;
    isEditable = false;
    isSaving = false;
    isDeleting = false;

    constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private router: Router) {
        this.activatedRoute.params.subscribe(params => {
            this.id = parseInt(params['productId'], 10);
          });
    }

    ngOnInit() {
        this.isLoading = true;
       this.productService.getProductById(this.id).subscribe(x => {
           this.product = x;
           this.isLoading = false;
       });
    }

    onEdit() {
        this.isEditable = true;
    }

    onSave() {
        this.isSaving = true;
        this.productService.saveProduct(this.product).subscribe((x) => {
            this.product = x;
            this.isSaving = false;
        });
    }

    onDelete() {
        this.isDeleting = true;
        this.productService.deleteProduct(this.product).subscribe((x) =>  { 
            this.isDeleting = false;
            this.product = x as any; 
        });
    }

}