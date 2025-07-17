import { Routes } from '@angular/router';
import { heroRoutes } from './features/heroes/heroes.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'heroes/list',
    pathMatch: 'full',
  },
  ...heroRoutes,
  {
    path: '**',
    redirectTo: 'heroes/list'
  }
];