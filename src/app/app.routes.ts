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
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'splash2',
    loadComponent: () => import('./splash2/splash2.page').then(m => m.Splash2Page)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  /* {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  } ,*/
  {
    path: 'juegos/id/:id',
    loadComponent: () => import('./pages/juegos/juegos.page').then(m => m.JuegosPage)
  },
  {
    path: 'alta-cliente',
    loadComponent: () => import('./pages/alta-cliente/alta-cliente.page').then(m => m.AltaClientePage)
  },
  {
    path: 'alta-empleado',
    loadComponent: () => import('./pages/alta-empleado/alta-empleado.page').then(m => m.AltaEmpleadoPage)
  },
  {
    path: 'alta-supervisor',
    loadComponent: () => import('./pages/alta-supervisor/alta-supervisor.page').then(m => m.AltaSupervisorPage)
  },
  {
    path: 'lista-usuarios',
    loadComponent: () => import('./pages/lista-usuarios/lista-usuarios.page').then(m => m.ListaUsuariosPage)
  },
  {
    path: 'menu-productos',
    loadComponent: () => import('./pages/menu-productos/menu-productos.page').then(m => m.MenuProductosPage)
  },
  {
    path: 'lista-pedidos',
    loadComponent: () => import('./pages/pedidos/lista-pedidos/lista-pedidos.page').then(m => m.ListaPedidosPage)
  },
  {
    path: 'pedido/id/:id',
    loadComponent: () => import('./pages/pedidos/id/id.page').then(m => m.IdPage)
  },
  {
    path: 'consultas',
    loadComponent: () => import('./pages/consultas/consultas.page').then(m => m.ConsultasPage)
  },
  {
    path: 'gestion-metre',
    loadComponent: () => import('./pages/gestion-metre/gestion-metre.page').then(m => m.GestionMetrePage)
  },
  {
    path: 'encuesta-cliente',
    loadComponent: () => import('./pages/encuesta-cliente/encuesta-cliente.page').then(m => m.EncuestaClientePage)
  },
  {
    path: 'graficos',
    loadComponent: () => import('./pages/graficos/graficos.page').then( m => m.GraficosPage)
  }






];
