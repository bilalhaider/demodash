import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { map, Observable } from 'rxjs';

@Injectable()
export class CustomerService {

    constructor(private http: HttpClient) { }

    getCustomersSmall(): Observable<Customer[]> {
        return this.http.get<any>('assets/demo/data/customers-small.json')
            .pipe(
                map(res => res.data as Customer[])
            );
    }

    getCustomersMedium(): Observable<Customer[]> {
        return this.http.get<any>('assets/demo/data/customers-medium.json')
            .pipe(
                map(res => res.data as Customer[])
            );
    }

    getCustomersLarge(): Observable<Customer[]> {
        return this.http.get<any>('assets/demo/data/customers-large.json')
            .pipe(
                map(res => res.data as Customer[])
            );
    }
}
