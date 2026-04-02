import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { History } from './pages/history/history';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'history', component: History}
];
