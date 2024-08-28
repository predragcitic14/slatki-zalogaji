import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {
  selectedFile: File | null = null;
  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      ingredients: ['', Validators.required],
      type: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.selectedFile = null;
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('ingredients', this.productForm.get('ingredients')?.value);
      formData.append('type', this.productForm.get('type')?.value);

      this.productService.uploadProduct(formData)
        .subscribe({
          next: (response) => {
            console.log('Upload successful', response);
            this.productForm.reset();
            this.selectedFile = null;
            this.notificationService.showMessage('success', 'Upload successfull');
          },
          error: (error) => {
            console.error('Upload error', error);
            this.notificationService.showMessage('error', 'Upload failed');
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
