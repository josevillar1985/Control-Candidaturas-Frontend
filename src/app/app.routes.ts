import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { History } from './pages/history/history';
import { Dashboard } from './pages/dashboard/dashboard';
import { Statisticscomponent } from './components/statisticscomponent/statisticscomponent';
import { Overview } from './pages/overview/overview';

export const routes: Routes = [
  { path: '', component: Home },

  {
  path: 'dashboard',
  component: Dashboard,
  children: [
    { path: '', redirectTo: 'resumen', pathMatch: 'full' },
    { path: 'resumen', component: Overview },
    { path: 'history', component: History },
    { path: 'estadisticas', component: Statisticscomponent }
  ]
}
];
