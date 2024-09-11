import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarbonIntensityRegionService {

  private apiUrl = 'https://api.carbonintensity.org.uk/regional';

  constructor(private http: HttpClient) { }

  getIntensityRegion(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}