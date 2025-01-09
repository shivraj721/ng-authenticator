import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
    { path: 'login', component: AuthComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
