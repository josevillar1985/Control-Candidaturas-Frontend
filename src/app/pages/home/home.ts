import { Component } from '@angular/core';
import { Formcomponent } from '../../components/formcomponent/formcomponent';
import { Donutscomponent } from '../../components/donutscomponent/donutscomponent';

@Component({
  selector: 'app-home',
  imports: [Formcomponent, Donutscomponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
