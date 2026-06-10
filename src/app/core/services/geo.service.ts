import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Country } from '../models/country.model';
import { City } from '../models/city.model';


@Injectable({ providedIn: 'root' })
export class GeoService {
  private http = inject(HttpClient); //
  private baseUrl = 'http://geodb-free-service.wirefreethought.com/v1/geo';

  getCountries(
    limit: number,
    offset: number,
    namePrefix?: string,
  ): Observable<ApiResponse<Country>> {
    let params = new HttpParams().set('limit', limit).set('offset', offset);

    if (namePrefix) {
      params = params.set('namePrefix', namePrefix);
    }

    return this.http.get<ApiResponse<Country>>(`${this.baseUrl}/countries`, { params });
  }

  getCities(
    limit: number,
    offset: number,
    countryIds?: string,
    namePrefix?: string,
  ): Observable<ApiResponse<City>> {
    let params = new HttpParams().set('limit', limit).set('offset', offset);

    if (countryIds) {
      params = params.set('countryIds', countryIds);
    }
    if (namePrefix) {
      params = params.set('namePrefix', namePrefix);
    }

    return this.http.get<ApiResponse<City>>(`${this.baseUrl}/cities`, { params });
  };
}
