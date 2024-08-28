// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor(private router: Router) {
    this.loggedIn = !!localStorage.getItem('user');
  }

  getCurrentUser(): User {
    return localStorage.getItem('user') as unknown as User;
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  login(user: any): void {
    // localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn = true;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.loggedIn = false;
    this.router.navigate(['/home']);
  }
}
