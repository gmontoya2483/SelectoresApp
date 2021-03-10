import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {combineLatest, Observable, of} from 'rxjs';
import {Pais, PaisSmall} from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl = 'https://restcountries.eu/rest/v2';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    const url = `${ this.baseUrl }/region/${region}?fields=alpha3Code;name`;
    return this.http.get<PaisSmall[]>( url );
  }

  getPaisPorCodigo( codigo: string): Observable<Pais | null> {

    if (!codigo) {
      return of(null);
    }

    const url = `${ this.baseUrl }/alpha/${codigo}`;
    return this.http.get<Pais>(url);

  }

  getPaisPorCodigoSmall( codigo: string): Observable<PaisSmall> {
    const url = `${ this.baseUrl }/alpha/${codigo}?fields=alpha3Code;name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigo(borders: string[]): Observable<PaisSmall[]>{

    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( border => {
      const peticion = this.getPaisPorCodigoSmall(border);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );

  }

}
