import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/users/users').then(m => m.Users)
  },
  {
    path: 'users/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/users/user-form/user-form').then(m => m.UserForm)
  },
  {
    path: 'users/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/users/user-form/user-form').then(m => m.UserForm)
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/roles/roles').then(m => m.Roles)
  },
  {
    path: 'permissions',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/permissions/permissions').then(m => m.Permissions)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings').then(m => m.Settings)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized').then(m => m.Unauthorized)
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
  },
  { path: '**', redirectTo: '404' }
];
