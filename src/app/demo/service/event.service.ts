import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class EventService {

    constructor(private http: HttpClient) { }

    getEvents(): Observable<any[]> {
        return this.http.get<any>('assets/demo/data/scheduleevents.json')
            .pipe(
                map(res => res.data as any[])
            );
    }
}
