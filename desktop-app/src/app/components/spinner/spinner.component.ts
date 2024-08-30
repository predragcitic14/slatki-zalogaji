import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="spinner-overlay">
      <div class="spinner"></div>
    </div>
  `,
  styles: [
    `
    .spinner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
      z-index: 1000; /* High z-index to ensure it overlays other content */
    }

    .spinner {
      border: 6px solid rgba(177, 157, 78, 0.3); /* Light gold border */
      border-top: 6px solid #B19D4E; /* Solid gold border */
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    `
  ]
})
export class SpinnerComponent {}
