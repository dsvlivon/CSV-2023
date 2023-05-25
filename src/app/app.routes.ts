import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'splash2',
    loadComponent: () => import('./splash2/splash2.page').then( m => m.Splash2Page)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'altas',
    loadComponent: () => import('./pages/altas/altas.page').then( m => m.AltasPage)
  },
  {
    path: 'lector-qr',
    loadComponent: () => import('./pages/lector-qr/lector-qr.page').then( m => m.LectorQrPage)
  },
  {
    path: 'encuestas',
    loadComponent: () => import('./pages/encuestas/encuestas.page').then( m => m.EncuestasPage)
  },
  {
    path: 'gestion',
    loadComponent: () => import('./pages/gestion/gestion.page').then( m => m.GestionPage)
  },
  {
    path: 'delivery',
    loadComponent: () => import('./pages/delivery/delivery.page').then( m => m.DeliveryPage)
  },
  {
    path: 'juegos',
    loadComponent: () => import('./pages/juegos/juegos.page').then( m => m.JuegosPage)
  }
];
