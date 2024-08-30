import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SliderComponent } from "../slider/slider.component";
import { PromotionService } from '../../services/promotion.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NgxSliderModule,
    SliderComponent
],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit{

  isBrowser: boolean;
  promotionsCount: number = 0;
  promotions = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private promotionService: PromotionService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.promotionService.countPromotions().subscribe({
      next: (res) => {
        this.promotionsCount = res.count;
      },
      error: (err) => {
        console.error('Error fetching promotions count', err);
      }
    });

    this.promotionService.getAllPromotions().subscribe({
      next: (res) => {
        this.promotions = res.promotions;
      },
      error: (err) => {
        console.error('Error fetching promotions', err);
      }
    });
  }
}
