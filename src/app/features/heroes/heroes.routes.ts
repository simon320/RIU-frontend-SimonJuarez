import { Routes } from '@angular/router';

export const heroRoutes: Routes = [
  {
    path: 'heroes',
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/hero-list/hero-list.component').then(m => m.HeroListComponent),
      },
      {
        path: 'form',
        loadComponent: () =>
          import('./pages/hero-form/hero-form.component').then(m => m.HeroFormComponent),
      },
      {
        path: 'form/:id',
        loadComponent: () =>
          import('./pages/hero-form/hero-form.component').then(m => m.HeroFormComponent),
      }
    ]
  }
];