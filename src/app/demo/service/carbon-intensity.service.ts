import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factors, Generation, GenerationSingle, Intensity, RegionalFromTo } from './api-models';

@Injectable({
  providedIn: 'root'
})
export class CarbonIntensityService {

  constructor(private http: HttpClient) { }

  getGenerationMix(): Observable<GenerationSingle> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.get<GenerationSingle>('https://api.carbonintensity.org.uk/generation', { headers });
  }

  getGenerationMixByDateRange(from: string, to: string): Observable<Generation> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    // Build the URL dynamically with from and to date parameters
    const url = `https://api.carbonintensity.org.uk/generation/${from}/${to}`;

    return this.http.get<Generation>(url, { headers });
  }

  getIntensityFactors(): Observable<Factors> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.get<Factors>('https://api.carbonintensity.org.uk/intensity/factors', { headers });
  }

  getCarbonIntensityByDateRange(from: string, to: string): Observable<Intensity> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    const url = `https://api.carbonintensity.org.uk/intensity/${from}/${to}`;
    return this.http.get<Intensity>(url, { headers });
  }
  
  getIntensityRegional(): Observable<RegionalFromTo> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.get<RegionalFromTo>('https://api.carbonintensity.org.uk/regional', { headers });
  }
}