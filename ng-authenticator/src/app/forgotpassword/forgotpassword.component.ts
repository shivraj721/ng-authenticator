import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CognitoService } from '../cognito/cognito.service';

@Component({
  selector: 'app-forgotpassword',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cognitoService: CognitoService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', []],
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const email = this.forgotPasswordForm.value.email;
        await this.cognitoService.forgotPassword(email);
        this.successMessage = 'A password reset link has been sent to your email.';
        setTimeout(() => {
          this.router.navigate(['/verifycode'], {
            queryParams: { email: email },
          });
        }, 1500);
      } catch (error: any) {
        this.errorMessage = error.message || 'An error occurred while sending the reset link.';
      } finally {
        this.loading = false;
      }
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
