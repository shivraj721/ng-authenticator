import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, confirmSignUp, resetPassword, confirmResetPassword, getCurrentUser, fetchUserAttributes,signInWithRedirect} from 'aws-amplify/auth';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    // Amplify.configure({
    //   Auth: {
    //     Cognito: {
    //       userPoolId: environment.cognito.userPoolId,
    //       userPoolClientId: environment.cognito.clientId,
    //       signUpVerificationMethod: 'code'
    //     }
    //   }
    // });
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.cognito.userPoolId,
          userPoolClientId: environment.cognito.clientId,
          signUpVerificationMethod: 'code',
          loginWith: {
            oauth: {
              domain: environment.cognito.domain,
              scopes: ['email', 'profile', 'openid'],
              redirectSignIn: [environment.cognito.redirectSignIn],
              redirectSignOut: [environment.cognito.redirectSignOut],
              responseType: 'code',
              providers: ['Google']
            }
          }
        }
      }
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public async signUp(phoneNumber: string, email: string, password: string, name: string): Promise<any> {
    try {
      const result = await signUp({
        username: name,
        password,
        options: {
          userAttributes: {
            email,
            name
          }
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async confirmSignUp(userName: string, code: string): Promise<any> {

    console.log('confirm signup method called');
    try {
      return await confirmSignUp({
        username: userName,
        confirmationCode: code
      });
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async signIn(email: string, password: string): Promise<any> {
    try {
      console.log("inside sign in function of cognito file!!!!!");
      const result = await signIn({
        username: email,
        password
      });
      this.authenticationSubject.next(true);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async signOut(): Promise<any> {
    try {
      await signOut();
      this.authenticationSubject.next(false);
    } catch (error) {
      throw error;
    }
  }

  public async forgotPassword(email: string): Promise<any> {
    try {
      return await resetPassword({
        username: email
      });
    } catch (error) {
      throw error;
    }
  }

  public async forgotPasswordSubmit(email: string, code: string, newPassword: string): Promise<any> {
    try {
      return await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword
      });
    } catch (error) {
      throw error;
    }
  }

  public async getUser(): Promise<any> {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      return { ...currentUser, ...userAttributes };
    } catch (error) {
      throw error;
    }
  }
  public async signInWithGoogle(): Promise<any> {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      throw error;
    }
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authenticationSubject.asObservable();
  }
}