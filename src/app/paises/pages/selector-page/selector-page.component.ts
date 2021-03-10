import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaisesService} from '../../services/paises.service';
import {Pais, PaisSmall} from '../../interfaces/paises.interface';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', Validators.required]

  });

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando = false;

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Cuando Cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((region: string) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region: string) => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });


    // Cuando Modifico el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( (codigo: string ) => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo)),
        // tslint:disable-next-line:no-non-null-assertion
        switchMap( pais => this.paisesService.getPaisesPorCodigo(pais?.borders!))
      )
      .subscribe( (paises: PaisSmall[] | null) => {
        this.fronteras = paises || [];
        this.cargando = false;
      });


  }

  guardar(): void {
    console.log(this.miFormulario.value);
  }
}
