import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Promotion } from '../../models/promotion.model';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent implements OnInit, OnDestroy {
  @Input() promotions: Promotion[] = [];

  currentIndex = 0;
  autoSwitchInterval: any;

  ngOnInit(): void {
    this.startAutoSwitch();
  }

  ngOnDestroy(): void {
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % (this.promotions.length - 2);
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.promotions.length - 3;
    }
  }

  startAutoSwitch(): void {
    this.autoSwitchInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}



