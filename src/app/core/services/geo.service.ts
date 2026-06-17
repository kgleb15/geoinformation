import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response.model';
import { Country } from '../models/country.model';
import { City } from '../models/city.model';

@Injectable({ providedIn: 'root' })
export class GeoService {
  private http = inject(HttpClient);
  private baseUrl = '/v1/geo';

  getCountries(
    limit: number,
    offset: number,
    namePrefix?: string,
  ): Observable<ApiResponseModel<Country>> {
    let params: HttpParams = new HttpParams().set('limit', limit).set('offset', offset);

    if (namePrefix) {
      params = params.set('namePrefix', namePrefix);
    }

    return this.http.get<ApiResponseModel<Country>>(`${this.baseUrl}/countries`, { params });
  }

  getCities(
    limit: number,
    offset: number,
    countryIds?: string,
    namePrefix?: string,
  ): Observable<ApiResponseModel<City>> {
    let params: HttpParams = new HttpParams().set('limit', limit).set('offset', offset);

    if (countryIds) {
      params = params.set('countryIds', countryIds);
    }
    if (namePrefix) {
      params = params.set('namePrefix', namePrefix);
    }

    return this.http.get<ApiResponseModel<City>>(`${this.baseUrl}/cities`, { params });
  }
}
