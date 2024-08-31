import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

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
  user: any = null;
  pendingOrdersCount: number = 0;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private orderService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.user$.subscribe(user => {
        this.user = user;
        this.isLoggedIn = !!user;
        if (this.isLoggedIn && this.user.type === 'worker') {
          this.loadPendingOrdersCount();
        }
      });

      this.cartService.cartItems$.subscribe(items => {
        this.cartItemCount = items.length;
      });
    }
  }

  loadPendingOrdersCount(): void {
    if (this.userService.isAuthenticated() && this.userService.getCurrentUser()?.type === 'worker') {
      this.orderService.countPendingOrders().subscribe({
        next: (res) => {
          this.pendingOrdersCount = res.count;
        },
        error: (err) => {
          console.error('Error fetching pending orders count', err);
        }
      });
    }
  }

  logout(): void {
    this.userService.logout();
    this.cartService.clearCart();
    this.pendingOrdersCount = 0;
  }

  goToNotifications(): void {
    if(this.isLoggedIn) {
      if (this.user.type === "common") {
        this.router.navigate(['/notifications']);
      }
      if (this.user.type === "worker") {
        this.router.navigate(['/worker-notifications']);
      }

    } else {
      this.router.navigate(['/login']);
    }
  }

  onProfile(): void {
    if(this.isLoggedIn) {
      this.router.navigate(['/profile']);
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
