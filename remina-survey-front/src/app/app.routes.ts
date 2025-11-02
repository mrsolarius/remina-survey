import { Routes } from '@angular/router';
import { DemographicsComponent } from './components/demographics/demographics.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { CompletionComponent } from './components/completion/completion.component';

export const routes: Routes = [
  { path: '', component: DemographicsComponent },
  { path: 'evaluate', component: EvaluationComponent },
  { path: 'done', component: CompletionComponent },
  {
    path: 'explications',
    loadComponent: () => import('./components/explications/explications.component').then(m => m.ExplicationsComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  { path: '**', redirectTo: '' },
];

