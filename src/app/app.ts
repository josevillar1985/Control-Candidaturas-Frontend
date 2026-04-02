import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navcomponent } from './components/navcomponent/navcomponent';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navcomponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('control-candidaturas');
}
