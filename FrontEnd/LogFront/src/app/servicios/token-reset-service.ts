import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenResetService {
  constructor() {}

  /**
   * Borra cualquier token antiguo del localStorage.
   * Debe llamarse al inicio de la app (por ejemplo en AppComponent).
   */
  resetToken(): void {
    const oldToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (oldToken) {
      console.log('Token viejo detectado y eliminado:', oldToken);
      localStorage.removeItem('token');
    }
    if (email) {
      localStorage.removeItem('email');
    }
  }
}
