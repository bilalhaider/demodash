import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '../api/image';
import { map, Observable } from 'rxjs';

@Injectable()
export class PhotoService {

    constructor(private http: HttpClient) { }

    getImages(): Observable<Image[]> {
        return this.http.get<any>('assets/demo/data/photos.json')
            .pipe(
                map(res => res.date as Image[])
            );
    }
}
