
import { Component } from '@angular/core';
import { PromotionService } from '../../services/promotion.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-promotion',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule
  ],
  templateUrl: './add-promotion.component.html',
  styleUrl: './add-promotion.component.scss'
})
export class AddPromotionComponent {
  selectedFile: File | null = null;
  promotionForm: FormGroup;

  constructor(
    private promotionService: PromotionService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.promotionForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.promotionForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      formData.append('name', this.promotionForm.get('name')?.value);
      formData.append('description', this.promotionForm.get('description')?.value);

      this.promotionService.uploadPromotion(formData)
        .subscribe({
          next: (response) => {
            this.notificationService.showMessage('success', 'Upload uspesan');
            this.selectedFile = null;
            this.promotionForm.reset();
          },
          error: (error) => {
            this.notificationService.showMessage('error', 'Upload neuspesan')
          },
          complete: () => {
            console.log('Upload complete');
          }
        });
    } else {
      console.error('Form is invalid or file not selected');
    }
  }
}
