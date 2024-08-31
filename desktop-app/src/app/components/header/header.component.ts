import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  cartItemCount: number = 0;
  user: any;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.isLoggedIn.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });
    }
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.length;
    });

    this.user = this.userService.getCurrentUser();

    this.userService.isLoggedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout(): void {
    this.userService.logout();
    this.cartService.clearCart();
  }

  goToNotifications(): void {
    if(this.userService.isAuthenticated()) {
      this.router.navigate(['/notifications'])
    } else {
      this.router.navigate(['/login']);
    }
  }

  onProfile(): void {
    if(this.userService.isAuthenticated()) {
      this.router.navigate(['/profile'])
    } else {
      this.router.navigate(['/login']);
    }
  }

  onHomePage(): void {
    this.router.navigate(['/home'])
  }

  onCakes(): void {
    this.router.navigate(['/cakes'])
  }

  onCookies(): void {
    this.router.navigate(['/cookies'])
  }

  onContact(): void {
    this.router.navigate(['/contact'])
  }

  onShoppingCart(): void {
    this.router.navigate(['/shopping-cart'])
  }

  onAddPromotions(): void {
    this.router.navigate(['/upload-promotion'])
  }

  onAddProducts(): void {
    this.router.navigate(['/add-product'])
  }
}
