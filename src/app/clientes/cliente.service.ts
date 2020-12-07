import { Injectable } from '@angular/core';
import { Customer } from './cliente';
import { CustomerKPI } from './clienteKPI';
import { CustomerProjection } from './clienteproyeccion';
import { HttpClient} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';

import { URL_BACKEND } from '../config/config';

@Injectable()
export class ClienteService {
  private urlEndPoint: string = URL_BACKEND + '/api/customer';
  private urlEndPointKpi: string = this.urlEndPoint + '/kpi';

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Customer[]).forEach(cliente => console.log(cliente.name));
      }),
      map((response: any) => {
        (response.content as Customer[]).map(cliente => {
          cliente.name = cliente.name.toUpperCase();
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Customer[]).forEach(cliente => console.log(cliente.name));
      }));
  }

  getKPIdeClientes(): Observable<CustomerKPI> {
    return this.http.get<CustomerKPI>(this.urlEndPointKpi);
  }

  create(cliente: Customer): Observable<Customer> {
    return this.http.post(this.urlEndPoint, cliente)
      .pipe(
        map((response: any) => response.cliente as Customer),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.message) {
            console.error(e.error.message);
          }
          return throwError(e);
        }));
  }

  getCliente(id): Observable<CustomerProjection> {
    return this.http.get<CustomerProjection>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/clientes']);
          console.error(e.error.message);
        }

        return throwError(e);
      }));
  }
}
