import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
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

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
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
            (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
          })
        ).subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });


    });

  }

  verEstadisticas() {
    this.clienteService.getKPIdeClientes()
      .subscribe(clienteKPI => {
        swal('Estadisticas', `Promedio Edad: ${clienteKPI.promedioEdades} - Desviaci&oacute;n est&aacute;ndar: ${clienteKPI.desviacionEstandarEdades}`, 'success');
      })
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }

}
