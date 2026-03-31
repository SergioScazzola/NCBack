import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenResetService } from '../app/servicios/token-reset-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {  
  protected readonly title = signal('Logística NC');
  constructor(private tokenResetService: TokenResetService) {
    tokenResetService.resetToken();
  }

 
}
