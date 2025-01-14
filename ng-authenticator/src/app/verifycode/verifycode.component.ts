import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CognitoService } from '../cognito/cognito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verifycode',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './verifycode.component.html',
  styleUrls: ['./verifycode.component.css']

})
export class VerifycodeComponent implements OnInit {
  userName: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  verifyCodeForm: FormGroup; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    
    private cognitoService: CognitoService,
    private fb: FormBuilder 
  ) {
  
    this.verifyCodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]] 
    });
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.userName = params['userName'] || '';
      if (!this.userName) {
        this.errorMessage = 'username is missing. Please go back to signup and try again.';
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.verifyCodeForm.invalid) {
      this.errorMessage = 'Please enter a valid verification code.';
      return;
    }

    const code = this.verifyCodeForm.get('code')?.value; 

 
    this.loading = true;
    this.errorMessage = '';
    try {
 
      await this.cognitoService.confirmSignUp(this.userName, code);
   
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred during verification.';
    } finally {
      this.loading = false;
    }
  }

  resendCode(): void {
   
  }
}
