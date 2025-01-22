import { Component,Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule ,isPlatformBrowser} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CognitoService } from '../cognito/cognito.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { map, take } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [
    trigger('imageSlide', [
      state('login', style({
        right: '0',
        opacity: 1
      })),
      state('signup', style({
        right: '50%',
        opacity: 1
      })),
      transition('login <=> signup', [
        animate('0.5s ease-out')
      ])
    ])
  ]
})
export class AuthComponent {
  isLogin = true;
  currentImage = 'assets/images/login.jpg';
  signupImage = 'assets/images/signup.jpg';
  loading = false;
  errorMessage = '';
  loginForm: FormGroup;
  signupForm: FormGroup;
  phonePattern = "^\\+?[1-9]\\d{1,14}$"; 

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private cognitoService: CognitoService,
    private fb: FormBuilder
  ) {
    // this.signInWithGoogle();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  ngOnInit() {
    from(this.cognitoService.isAuthenticated()).pipe(
      take(1),
      map(isAuthenticated => {
        const isLoginPage = this.router.url === '/login';
  
        if (isAuthenticated && isLoginPage) {
          this.router.navigate(['/home']);
          return false;
        } else if (!isAuthenticated && !isLoginPage) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    ).subscribe();
    this.signInWithGoogle();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      try {
          const { email, password } = this.loginForm.value;
          await this.cognitoService.signIn(email, password);
      } catch (error: any) {
          this.errorMessage = error.message || 'An error occurred during login';
      } finally {
          this.loading = false;
      }
    }
  }
  async signInWithGoogle() {
    if(isPlatformBrowser(this.platformId)){
      this.loading = true;
      this.errorMessage = '';
    
      try{
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          const google = (window as any).google;
          if (google) {
            google.accounts.id.initialize({
              client_id: environment.cognito.googleClientId,
              auto_select: false,
              callback: this.handleGoogleCredentialResponse.bind(this)
            });
            
            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'g_id_onload';
            document.body.appendChild(buttonContainer);

            google.accounts.id.renderButton(
              document.getElementById('googleSignInButton'),
              { type: 'standard', theme: 'outline', size: 'large', text: 'signin_with', shape: 'circle' }
            );
          
            google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed()) {
                console.log('Prompt not displayed:', notification.getNotDisplayedReason());
              
                if (notification.getNotDisplayedReason() === 'browser_not_supported') {
                
                  this.fallbackToRedirect();
                }
              }
            });
          }
        };
        
        document.body.appendChild(script);
        console.log('gis has been successfully loaded..!!!!!!');
      }catch (error) {
        this.loading = false;
        console.error('Error during Google Sign-In initialization:', error);
        this.errorMessage = 'An error occurred during Google Sign-In.';
      } finally {
        this.loading = false;
      }
    }else{
      this.loading = false;
      console.log('Google Sign-In is disabled on the server side');
    }
  }
  private async handleGoogleCredentialResponse(response: any) {
    try {
      if (response.credential) {
        
        const payload = this.decodeJwt(response.credential);
        console.log('Decoded credential:', payload);
        
        
        this.cognitoService.authenticationSubject.next(true);
        this.router.navigate(['/home']);
        return payload;
      }
    } catch (error) {
      console.error('Error handling Google credential:', error);
      throw error;
    }
  }
  private fallbackToRedirect() {

    console.log('Falling back to redirect flow');
   
  }
  
  private decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      throw error;
    }
  }
  async onSignup() {
    if (this.signupForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      try {
        const { email,  phoneNumber,password, userName } = this.signupForm.value;
        await this.cognitoService.signUp(phoneNumber,email, password, userName);
   
        this.router.navigate(['/verifycode'], { 
          queryParams: { email: userName,isSignup:true }
        });
      } catch (error: any) {
        this.errorMessage = error.message || 'An error occurred during signup';
      } finally {
        this.loading = false;
      }
    }
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    setTimeout(() => {
      this.currentImage = this.isLogin ? 'assets/images/login.jpg' : 'assets/images/signup.jpg';
    }, 250);
  }
  formatPhoneNumber(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (!value.startsWith('+')) {
      value = '+' + value;
    }
    input.value = value;
  }
  navigateToForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }
}