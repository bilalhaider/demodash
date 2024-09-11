import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarbonFactorIntensityService {

  private apiUrl = 'https://api.carbonintensity.org.uk/intensity/factors';

  constructor(private http: HttpClient) { }

  getIntensityFactors(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}