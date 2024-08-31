import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user!: User;
  userProfileForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
    ) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser() as User;

    this.userProfileForm = this.fb.group({
      email: [{value: this.user.email, disabled: true}, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [this.user.name, Validators.required],
      lastName: [this.user.lastname, Validators.required],
      phone: [this.user.phone, Validators.required],
      address: [this.user.address, Validators.required]
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.userProfileForm.reset({
        email: this.user.email,
        firstName: this.user.name,
        lastName: this.user.lastname,
        phone: this.user.phone,
        address: this.user.address,
        password: '',
        confirmPassword: ''
      });
    } else {
      this.userProfileForm.reset({
        email: this.user.email,
        firstName: this.user.name,
        lastName: this.user.lastname,
        phone: this.user.phone,
        address: this.user.address,
        password: '',
        confirmPassword: ''
      });
    }
  }

  onSubmit(): void {
    if (this.isEditing && this.isFormValid()) {
      const updatedUserData : User = {
        _id: this.user._id,
        email: this.user.email,
        name: this.userProfileForm.value.firstName,
        lastname: this.userProfileForm.value.lastName,
        phone: this.userProfileForm.value.phone,
        address: this.userProfileForm.value.address,

      };

      if ( this.userProfileForm.value.password) {
        updatedUserData.password = this.userProfileForm.value.password
      }
      this.userService.updateUser(updatedUserData).subscribe({
        next: (response) => {
          this.notificationService.showMessage('success','Podaci uspesno izmenjeni');
          this.userService.setUser(response.user)
          this.user = response.user;
          this.userProfileForm.patchValue({
            firstName: this.user.name,
            lastName: this.user.lastname,
            phone: this.user.phone,
            address: this.user.address,
            password: '',
            confirmPassword: ''
          });
          this.toggleEdit();
          // this.router.navigate([this.router.url]);
        },
        error: (error) => {
          this.notificationService.showMessage('error', 'Greska pri menjanju podataka: ' + error.message);
          console.error('Update error:', error);
        }
      });

    }
  }

  onToggleEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
    }
  }

  isFormValid(): boolean {
    const { password, confirmPassword, firstName, lastName, phone, address } = this.userProfileForm.controls;

    const isPasswordValid = password.value === confirmPassword.value && password.value !== '';
    const isProfileChanged =
      firstName.value !== this.user.name ||
      lastName.value !== this.user.lastname ||
      phone.value !== this.user.phone ||
      address.value !== this.user.address;

    return (isProfileChanged && !password.value && !confirmPassword.value) || isPasswordValid;
  }

  getSubmitButtonTooltip(): string {
    const { password, confirmPassword, firstName, lastName, phone, address } = this.userProfileForm.controls;

    if (!this.isFormValid()) {
      if (password.value || confirmPassword.value) {
        if (password.value !== confirmPassword.value) {
          return 'Potvrdite lozinku ukoliko zelite da je promenite';
        }
      }
      if (!password.value && !confirmPassword.value) {
        const isProfileChanged =
          firstName.value !== this.user.name ||
          lastName.value !== this.user.lastname ||
          phone.value !== this.user.phone ||
          address.value !== this.user.address;

        if (!isProfileChanged) {
          return 'Nema registrovanih izmena.';
        }
      }
    }
    return '';
  }
}
