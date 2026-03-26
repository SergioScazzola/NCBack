import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { withInterceptors, provideHttpClient } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor'; // AJUSTA LA RUTA SEGÚN TU PROYECTO

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Registramos el interceptor funcional aquí:
    provideHttpClient(
      withInterceptors([authInterceptor]) 
    )
  ]
};
