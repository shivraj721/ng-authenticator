import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  imports: [],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  constructor(private router: Router) {}

  onSubmit(email: string) {
    if (email.trim()) {
      console.log('Email:', email);
      this.router.navigate(['/verifycode']);
    } else {
      alert('Please enter a valid email address');
    }
  }
}
