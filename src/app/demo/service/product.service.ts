import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { map, Observable } from 'rxjs';

@Injectable()
export class ProductService {

    constructor(private http: HttpClient) { }

    // getProductsSmall() {
    //     return this.http.get<any>('assets/demo/data/products-small.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProducts() {
    //     return this.http.get<any>('assets/demo/data/products.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProductsMixed() {
    //     return this.http.get<any>('assets/demo/data/products-mixed.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProductsWithOrdersSmall() {
    //     return this.http.get<any>('assets/demo/data/products-orders-small.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    getProductsSmall(): Observable<Product[]> {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .pipe(
                map(res => res.data as Product[])
            );
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<any>('assets/demo/data/products.json')
            .pipe(
                map(res => res.data as Product[])
            );
    }

    getProductsMixed(): Observable<Product[]> {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .pipe(
                map(res => res.data as Product[])
            );
    }

    getProductsWithOrdersSmall(): Observable<Product[]> {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .pipe(
                map(res => res.data as Product[])
            );
    }
}
