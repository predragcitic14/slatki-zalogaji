import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm: FormGroup;
  token: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = decodeURIComponent(this.route.snapshot.paramMap.get('token') || '');
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('newPassword')?.value === formGroup.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  isFormValid(): boolean {
    return this.resetPasswordForm.valid;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      this.userService.resetPassword(this.token, newPassword).subscribe(updateResponse => {
        if (updateResponse.success) {
          this.notificationService.showMessage('success', "Uspesno promenjena lozinka");
          this.router.navigate(['/login']);
        } else {
          this.notificationService.showMessage('error', "Greska, pokusajte kasnije.");
        }
      });
    }
  }
}
