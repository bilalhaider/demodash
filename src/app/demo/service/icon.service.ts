import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class IconService {

    constructor(private http: HttpClient) { }

    icons!: any[];

    selectedIcon: any;

    apiUrl = 'assets/demo/data/icons.json';

    getIcons(): Observable<any[]> {
        return this.http.get(this.apiUrl).pipe(map((response: any) => {
            this.icons = response.icons;
            return this.icons;
        }));
    }
}
