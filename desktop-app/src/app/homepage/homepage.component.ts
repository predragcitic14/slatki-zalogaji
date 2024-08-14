import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { SliderComponent } from "../slider/slider.component";

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
export class HomepageComponent {

  isBrowser: boolean;

  promotions = [
    { image: 'path/to/image1.jpg', title: 'Promocija 1', description: 'Opis za promociju 1' },
    { image: 'path/to/image2.jpg', title: 'Promocija 2', description: 'Opis za promociju 2' },
    { image: 'path/to/image3.jpg', title: 'Promocija 3', description: 'Opis za promociju 3' },
    { image: 'path/to/image4.jpg', title: 'Promocija 4', description: 'Opis za promociju 4' },
    { image: 'path/to/image4.jpg', title: 'Promocija 5', description: 'Opis za promociju 5' },
    { image: 'path/to/image4.jpg', title: 'Promocija 6', description: 'Opis za promociju 6' },
  ];


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
