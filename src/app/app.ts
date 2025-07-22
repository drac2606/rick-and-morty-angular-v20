import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list';

// GUÍA PARA EL ESTUDIANTE:
// 1. Importa tu `CharacterListComponent`.
// 2. Añádelo al array de `imports` de este componente.

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CharacterListComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'rick-and-morty-angular-v20';
}