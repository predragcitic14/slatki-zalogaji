import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFormValid(): boolean {
    return this.forgotPasswordForm.valid;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const email = this.forgotPasswordForm.get('email')?.value;

      console.log(email);
      this.userService.sendResetEmail(email).subscribe(response => {
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
        }
      });
    }
  }
}
