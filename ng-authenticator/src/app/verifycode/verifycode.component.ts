import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifycode',
  imports: [],
  templateUrl: './verifycode.component.html',
  styleUrl: './verifycode.component.css'
})
export class VerifycodeComponent {
  constructor(private router: Router) {}
  onSubmit(code: string) {
    if (code.trim()) {
      console.log('code:', code);
      this.router.navigate(['/setpassword']);
    } else {
      alert('Please enter a valid email address');
    }
  }
}
