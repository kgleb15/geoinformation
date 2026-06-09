import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full',
  },
  {
    path: 'countries',
    loadComponent: () =>
      import('./features/countries/countries').then((m) => m.Countries),
  },
  {
    path: 'cities',
    loadComponent: () =>
      import('./features/cities/cities').then((m) => m.Cities),
  },
];
