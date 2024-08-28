import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.userProfileForm = this.fb.group({
      email: [this.user.email],
      firstName: [this.user.name],
      lastName: [this.user.lastname],
      phone: [this.user.phone],
      address: [this.user.address]
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    if (this.isEditing) {
      // Perform user update logic here
      console.log('User updated:', this.userProfileForm.value);
      this.toggleEdit(); // Switch back to displaying plain text
    }
  }
}
