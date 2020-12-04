import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteKPI } from './clienteKPI';
import { HttpClient} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';

import { URL_BACKEND } from '../config/config';

@Injectable()
export class ClienteService {
  private urlEndPointCreate: string = URL_BACKEND + '/api/creacliente';
  private urlEndPointList: string = URL_BACKEND + '/api/listclientes';
  private urlEndPointKpi: string = URL_BACKEND + '/api/kpideclientes';

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPointList + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      }));
  }

  getKPIdeClientes(): Observable<ClienteKPI> {
    return this.http.get<ClienteKPI>(this.urlEndPointKpi);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPointCreate, cliente)
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        }));
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPointList}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }
}
