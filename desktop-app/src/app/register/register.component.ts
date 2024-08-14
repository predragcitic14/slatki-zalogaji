import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { catchError, of } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      if (formValue.password !== formValue.confirmPassword) {
        this.notificationService.showMessage('error', 'Passwords do not match');
        return;
      }

      const newUser: User = {
        email: formValue.email,
        password: formValue.password,
        name: formValue.firstName,
        lastname: formValue.lastName,
        phone: formValue.phone,
        address: formValue.address
      };

      this.userService.register(newUser).pipe(
        catchError(error => {
          this.notificationService.showMessage('error', 'Registration error');
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.notificationService.showMessage('success', 'User registered successfully');
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
