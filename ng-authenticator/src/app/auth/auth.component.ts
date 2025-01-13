// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { trigger, state, style, animate, transition } from '@angular/animations';

// @Component({
//   selector: 'app-auth',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './auth.component.html',
//   styleUrls: ['./auth.component.css'],
//   animations: [
//     trigger('imageSlide', [
//       state('login', style({
//         right: '0',
//         opacity: 1
//       })),
//       state('signup', style({
//         right: '50%',
//         opacity: 1
//       })),
//       transition('login <=> signup', [
//         animate('0.5s ease-out')
//       ])
//     ])
//   ]
// })
// export class AuthComponent {
//   constructor(private router: Router) {}
//   isLogin = true;
//   currentImage = 'assets/images/login.jpg';
//   signupImage = 'assets/images/signup.jpg';

//   toggleForm() {
//     this.isLogin = !this.isLogin;
//     setTimeout(() => {
//       this.currentImage = this.isLogin ? 'assets/images/login.jpg' : 'assets/images/signup.jpg';
//     }, 250);
//   }
//   navigateToForgotPassword() {
//     this.router.navigate(['/forgotpassword']);
//   }
// }


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
  phonePattern = "^\\+?[1-9]\\d{1,14}$"; // International phone number format

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
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
        const { phoneNumber, password } = this.loginForm.value;
        await this.cognitoService.signIn(phoneNumber, password);
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
        const { phoneNumber, password, fullName } = this.signupForm.value;
        await this.cognitoService.signUp(phoneNumber, password, fullName);
        // Navigate to verification page or show verification modal
        this.router.navigate(['/verifycode'], { 
          queryParams: { phone: phoneNumber }
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

  navigateToForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }

  formatPhoneNumber(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (!value.startsWith('+')) {
      value = '+' + value;
    }
    input.value = value;
  }
}