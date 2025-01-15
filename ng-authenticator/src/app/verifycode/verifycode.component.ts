import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CognitoService } from '../cognito/cognito.service';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verifycode',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './verifycode.component.html',
  styleUrls: ['./verifycode.component.css']

})
export class VerifycodeComponent implements OnInit {
  email: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  verifyCodeForm: FormGroup; // Declare the FormGroup for the form
  isSignup: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    
    private cognitoService: CognitoService,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    // Initialize the form with validation
    this.verifyCodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]] // Example validation
    });
  }

  ngOnInit(): void {
    // Retrieve the email from the query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.isSignup = params['isSignup'];
      console.log('email: ',this.email);
      if (!this.email) {
        this.errorMessage = 'Email is missing. Please go back to signup and try again.';
      }
    });
  }

  async onSubmit(): Promise<void> {
    
    if (this.verifyCodeForm.invalid) {
      this.errorMessage = 'Please enter a valid verification code.';
      return;
    }

    const code = this.verifyCodeForm.get('code')?.value;
    console.log('codeee ',code);
    if (!this.email) {
      this.errorMessage = 'Email is missing. Please go back to signup and try again.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    try {
      // Call the confirmSignUp function from CognitoService
      if(this.isSignup){
        console.log('calleddddddddddddddddddddd');
        await this.cognitoService.confirmSignUp(this.email, code);
        // Navigate to the home or login page after successful verification
        this.router.navigate(['/login']);
      }else{
        // Navigate to the home or login page after successful verification
        this.router.navigate(['/setpassword'],{ 
          queryParams: { email: this.email, code:code}
        }
        );
      }
      
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred during verification.';
    } finally {
      this.loading = false;
    }
  }

  resendCode(): void {
    // this.cognitoService.
  }
}