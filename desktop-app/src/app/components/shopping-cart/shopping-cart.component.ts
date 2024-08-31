import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit {
  cartItems: Array<{ productId: string, name: string, quantity: number, price: number }> = [];
  totalPrice: number = 0;
  currentUser: any;
  isLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.isLoggedIn.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });
    }
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });
  }

  incrementQuantity(productId: string): void {
    this.cartService.incrementQuantity(productId);
    this.calculateTotalPrice();
  }

  decrementQuantity(productId: string): void {
    this.cartService.decrementQuantity(productId);
    this.calculateTotalPrice();
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  onContinueShopping(): void {
    this.router.navigate(['/home'])
  }

  onConfirmOrder(): void {
    if(!this.isLoggedIn) {
      this.notificationService.showMessage('error', 'Niste ulogovani. Ulogujte se kako biste porucili')
    }
    this.currentUser = this.userService.getCurrentUser();

    const order = {
      userId: this.currentUser._id,
      items: this.cartItems,
      totalPrice: this.totalPrice
    }

    const apiUrl = 'http://localhost:3000/orders'

    this.http.post(apiUrl, order).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.notificationService.showMessage('success', 'Porudzbina je uspesno poslata.')
        this.router.navigate(['/notifications']);
      },
      error: (error) => {
        this.notificationService.showMessage('error', `Greska u postavljanju narudzbine`)
        console.error('Error placing order', error);
      }
    });
  }
}
