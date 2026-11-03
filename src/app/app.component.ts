import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Racine : l'enveloppe et les aperçus isolés (/apercu, chargés en iframe) sont deux routes distinctes. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
