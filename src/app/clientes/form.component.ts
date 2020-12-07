import { Component, OnInit } from '@angular/core';
import { Customer } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Customer = new Customer();
  titulo: string = "Crear Cliente";
  tituloBoton: string = "Crear";
  modoLectura: boolean = false;

  errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      this.modoLectura = false;
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
          this.titulo = `Proyección y Análisis del cliente`;
          this.tituloBoton = 'Regresar';
          this.modoLectura = true;
        });
      }
    });
  }

  create(): void {
    if (this.tituloBoton == 'Regresar') {
      this.router.navigate(['/clientes']);
      return;
    }
    console.log(this.cliente);
    this.clienteService.create(this.cliente)
      .subscribe(
        customer => {
          this.router.navigate(['/clientes']);
          swal('Nuevo cliente', `El cliente ${this.cliente.name} ha sido creado con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

}
