import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, confirmSignUp, resetPassword, confirmResetPassword, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.cognito.userPoolId,
          userPoolClientId: environment.cognito.clientId,
          signUpVerificationMethod: 'code'
        }
      }
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public async signUp(phoneNumber: string, password: string, name: string): Promise<any> {
    try {
      // Ensure phone number is in correct format (+1234567890)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const result = await signUp({
        username: formattedPhone,
        password,
        options: {
          userAttributes: {
            phone_number: formattedPhone,
            name
          }
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async confirmSignUp(phoneNumber: string, code: string): Promise<any> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      return await confirmSignUp({
        username: formattedPhone,
        confirmationCode: code
      });
    } catch (error) {
      throw error;
    }
  }

  public async signIn(phoneNumber: string, password: string): Promise<any> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const result = await signIn({
        username: formattedPhone,
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

  public async forgotPassword(phoneNumber: string): Promise<any> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      return await resetPassword({
        username: formattedPhone
      });
    } catch (error) {
      throw error;
    }
  }

  public async forgotPasswordSubmit(phoneNumber: string, code: string, newPassword: string): Promise<any> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      return await confirmResetPassword({
        username: formattedPhone,
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

  public isAuthenticated(): Observable<boolean> {
    return this.authenticationSubject.asObservable();
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    // Add + if not present
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }
}