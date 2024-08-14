import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

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
  @Input() promotions: { image: string; title: string; description: string }[] = [];

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
    if (this.currentIndex < this.promotions.length - 3) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  startAutoSwitch(): void {
    this.autoSwitchInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }
}



