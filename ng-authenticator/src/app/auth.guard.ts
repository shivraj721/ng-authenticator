import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CognitoService } from './cognito/cognito.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const cognitoService = inject(CognitoService);
  const router = inject(Router);

  return from(cognitoService.isAuthenticated()).pipe(
    map(isAuthenticated => {
      const isLoginPage = state.url === '/login';

      if (isAuthenticated) {
        if (isLoginPage) {
          router.navigate(['/home']);
          return false;
        }
        return true;
      } else {
        if (!isLoginPage) {
          router.navigate(['/login']);
          return false;
        }
        return true;
      }
    })
  );
};
