import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../cognito/cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) {}

  async onLogout() {
    try {
      await this.cognitoService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
