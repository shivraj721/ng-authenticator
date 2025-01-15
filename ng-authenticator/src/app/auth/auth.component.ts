import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CognitoService } from '../cognito/cognito.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
    private router: Router,
    private cognitoService: CognitoService,
    private fb: FormBuilder
  ) {
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
        this.router.navigate(['/home']);
      } catch (error: any) {
        this.errorMessage = error.message || 'An error occurred during login';
      } finally {
        this.loading = false;
      }
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
          queryParams: { email: fullName,isSignup:true }
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