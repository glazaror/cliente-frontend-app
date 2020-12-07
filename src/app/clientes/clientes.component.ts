import { Component, OnInit } from '@angular/core';
import { Customer } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { URL_BACKEND } from '../config/config';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Customer[];
  paginador: any;
  clienteSeleccionado: Customer;
  urlBackend: string = URL_BACKEND;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.clienteService.getClientes(page)
        .pipe(
          tap(response => {
            console.log('ClientesComponent: tap 3');
            (response.content as Customer[]).forEach(cliente => console.log(cliente.name));
          })
        ).subscribe(response => {
          this.clientes = response.content as Customer[];
          this.paginador = response;
        });


    });

  }

  verEstadisticas() {
    this.clienteService.getKPIdeClientes()
      .subscribe(clienteKPI => {
        swal('Estadisticas', `Promedio Edad: ${clienteKPI.averageAge} - Desviaci&oacute;n est&aacute;ndar: ${clienteKPI.standardDeviationAge}`, 'success');
      })
  }

  abrirModal(cliente: Customer) {
    this.clienteSeleccionado = cliente;
  }

}
