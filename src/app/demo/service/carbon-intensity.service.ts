import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarbonIntensityService {

  private apiUrl = 'https://api.carbonintensity.org.uk/generation';

  constructor(private http: HttpClient) { }

  getGenerationMix(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  getGenerationMixByDateRange(from: string, to: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    // Build the URL dynamically with from and to date parameters
    const url = `${this.apiUrl}/${from}/${to}`;

    return this.http.get<any>(url, { headers });
  }
}