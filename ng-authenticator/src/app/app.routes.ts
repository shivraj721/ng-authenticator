import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { VerifycodeComponent } from './verifycode/verifycode.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: AuthComponent},
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'verifycode', component: VerifycodeComponent },
    { path: 'setpassword', component: SetpasswordComponent },
    { path: '**', redirectTo: 'home' }
];
