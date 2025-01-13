import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { VerifycodeComponent } from './verifycode/verifycode.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'login', component: AuthComponent },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'verifycode', component: VerifycodeComponent },
    { path: 'setpassword', component: SetpasswordComponent },
];
