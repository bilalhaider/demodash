import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class CountryService {

    constructor(private http: HttpClient) { }

    getCountries(): Observable<any> {

        return this.http.get<any>('assets/demo/data/countries.json')
            .pipe(
                map(res => res.data as any[])
            )
    }
}
