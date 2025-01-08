import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [
    trigger('slideAnimation', [
      state('login', style({
        transform: 'translateX(0)'
      })),
      state('signup', style({
        transform: 'translateX(0)'
      })),
      transition('login => signup', [
        animate('0.5s ease-out')
      ]),
      transition('signup => login', [
        animate('0.5s ease-out')
      ])
    ]),
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

  toggleForm() {
    this.isLogin = !this.isLogin;
    setTimeout(() => {
      this.currentImage = this.isLogin ? 'assets/images/login.jpg' : 'assets/images/signup.jpg';
    }, 250);
  }
}