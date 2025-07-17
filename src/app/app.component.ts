import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';

import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet ],
  template: `
    @if(loadingService.loading()) {
      <div class="loading-overlay">
        <span class="spinner">Cargando...</span>
      </div>
    }

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public loadingService = inject(LoadingService);
}
