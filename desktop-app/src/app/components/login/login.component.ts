import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, of } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      // Simulate user data. Replace this with actual authentication logic.
      // const user = { email: formValue.email, token: 'fake-jwt-token' };

      const loginRes = this.userService.login(formValue.email, formValue.password).pipe(
        catchError(error => {
          this.notificationService.showMessage('error', 'Login error');
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.userService.setUser(response.user);
          this.router.navigate(['/home']);
          this.userService.setLoggedIn(true);
        }
      });

    }
  }

  isFormValid(): boolean {
    return this.loginForm.get('email')?.value || this.loginForm.get('password')?.value
      ? this.loginForm.valid
      : false;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
