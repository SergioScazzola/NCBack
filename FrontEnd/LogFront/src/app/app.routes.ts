import { Routes } from '@angular/router';
import { NavegadorComponent } from './componentes/navegador/navegador';
import { ChoferesComponent }  from './componentes/choferes/choferes.component';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';
import { AuthenticatedLayoutComponent } from './layouts/authenticated-layout/authenticated-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './componentes/login/login.component';
import { ChangePasswordComponent } from './componentes/change-password/change-password.component';
import { CamionesComponent } from './componentes/camiones/camiones.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { ViajesComponent } from './componentes/viajes/viajes.component';
import { FacsTPComponent } from './componentes/facs-tp/facs-tp.component';
import { FacsClientesComponent } from './componentes/facs-clientes/facs-clientes.component';
import { CtacteComponent } from './componentes/choferes/ctactechof/ctactechof.component';
import { GastosComponent } from './componentes/gastos/gastos.component';
import { InfoFacstpComponent } from './componentes/facs-tp/info-facstp/info-facstp.component';
import { CtactecliComponent } from './componentes/clientes/ctactecli/ctactecli.component';

export const routes: Routes = [
  // Rutas para invitados (no autenticados)
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },

  // Rutas protegidas (autenticadas)
  {
    path: '',  
     canActivate: [AuthGuard], // <-- Asegúrate de que esto esté aquí
    children: [
      { path: 'ppal', component: NavegadorComponent },     
      { path: 'choferes', component: ChoferesComponent },  
      { path: 'choferes/:nrochofer/:nomchofer/:filtro/ctactec',component: CtacteComponent},     
      { path: 'camiones', component: CamionesComponent },          
      { path: 'clientes', component: ClientesComponent },     
      { path: 'clientes/:nrocliente/:nomcliente/:filtro/ctactec',component: CtactecliComponent},     
      { path: 'viajes', component: ViajesComponent },     
      { path: 'factpte', component: FacsTPComponent },   
      { path: 'factpte/infofacstp', component: InfoFacstpComponent },            
      { path: 'faccli', component : FacsClientesComponent},   
      { path: 'gastos', component: GastosComponent }, 
      { path: '', pathMatch: 'full', redirectTo: 'ppal' },
    ],
  },

  // Ruta de fallback
  { path: '**', redirectTo: 'ppal' },
]
