import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HeroService } from '../../services/hero.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Hero } from '../../../../common/interfaces/hero.model';

@Component({
  selector: 'app-hero-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './hero-form.component.html',
})
export class HeroFormComponent implements OnInit {
  private heroService = inject(HeroService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public heroForm!: FormGroup;
  public isEditMode = signal(false);
  

  ngOnInit(): void {
    this.createForm();
    this.patchValueForm();
  }
  

  private createForm(): void {
    this.heroForm = this.fb.group({
      id: [Date.now()],
      name: ['', [Validators.required, Validators.minLength(3)]],
      power: ['']
    });
  }


  private patchValueForm(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      const hero = this.heroService.getById(id);

      if (hero) {
        this.heroForm.patchValue(hero);
        this.isEditMode.set(true);
      } 
      
      else {
        this.router.navigate(['/list']);
      }
    }
  }


  public submitForm(): void {
    const hero = this.heroForm.value as Hero;
    if (this.heroForm.valid) {

      if (this.isEditMode()) {
        this.heroService.update(hero);
        this.openSnack('Héroe actualizado con éxito');
      } 
      
      else {
        this.heroService.add(hero);
        this.openSnack('Héroe creado con éxito');
      }

      this.router.navigate(['/list']);
    }
  }


  public cancel(): void {
    this.router.navigate(['/list']);
  }


  private openSnack(message: string): void {
    this.snack.open(message, 'Cerrar', {
      duration: 2500,
    });
  }
}
