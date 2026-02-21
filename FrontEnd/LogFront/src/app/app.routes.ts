import { Routes } from '@angular/router';
import { NavegadorComponent } from './componentes/navegador/navegador';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';
import { AuthenticatedLayoutComponent } from './layouts/authenticated-layout/authenticated-layout.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './componentes/login/login.component';
import { ChangePasswordComponent } from './componentes/change-password/change-password.component';

export const routes: Routes = [
  // Rutas para invitados (no autenticados)
  /*{
    path: '',
    component: GuestLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },*/

  // Rutas protegidas (autenticadas)
  {
    path: '',  
    children: [
      { path: 'ppal', component: NavegadorComponent },               
    ],
  },

  // Ruta de fallback
  { path: '**', redirectTo: 'login' },
]
