import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateFilterIntensityService {

  private apiUrl = 'https://api.carbonintensity.org.uk/intensity';

  constructor(private http: HttpClient) { }

  getCarbonIntensityData(from: string, to: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    const url = `${this.apiUrl}/${from}/${to}`;
    return this.http.get<any>(url, { headers });
  }
}