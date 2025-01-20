import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CognitoService } from './cognito/cognito.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const cognitoService = inject(CognitoService);
  const router = inject(Router);

  return cognitoService.isAuthenticated().pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
