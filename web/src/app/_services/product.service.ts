import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../_models/product';

@Injectable()
export class ProductService {
   
    constructor(private http: HttpClient) {
    }

    getProducts() {
        return this.http.get<Product[]>(`/api/v1/products`);
    }

    getProductById(id: number) {
        return this.http.get<Product>(`/api/v1/products/` + id);
    }

    saveProduct(product: Product) {
        return this.http.put<Product>(`/api/v1/products/` + product.id, product);
    }

    deleteProduct(product : Product) {
        return this.http.delete(`/api/v1/products/` + product.id);
    }
}