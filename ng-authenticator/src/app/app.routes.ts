import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { VerifycodeComponent } from './verifycode/verifycode.component';

export const routes: Routes = [
    { path: 'login', component: AuthComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'verifycode', component: VerifycodeComponent },
    { path: 'setpassword', component: SetpasswordComponent },
];
