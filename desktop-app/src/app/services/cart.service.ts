import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new Map<string, { name: string, quantity: number, price: number }>();
  private cartItemsSubject = new BehaviorSubject<Array<{ name: string, quantity: number, price: number }>>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartState();
    }
  }

  // Adds a product to the cart
  addToCart(productId: string, name: string, quantity: number, price: number): void {
    const existingItem = this.cartItems.get(productId);

    if (existingItem) {
      // If the product is already in the cart, update its quantity
      existingItem.quantity += quantity;
    } else {
      // Otherwise, add the product to the cart
      this.cartItems.set(productId, { name, quantity, price });
    }

    // Update the cart state and save it
    this.updateCart();
  }

  // Returns the total count of items in the cart
  getCartItemCount(): number {
    return Array.from(this.cartItems.values())
      .reduce((totalCount, item) => totalCount + item.quantity, 0);
  }

  // Returns an array of cart items
  getCartItems(): Array<{ name: string, quantity: number, price: number }> {
    return Array.from(this.cartItems.values());
  }

  // Updates the cart observable and saves the state if in the browser
  private updateCart(): void {
    this.cartItemsSubject.next(this.getCartItems());
    if (isPlatformBrowser(this.platformId)) {
      this.saveCartState();
    }
  }

  // Saves the current cart state to sessionStorage
  private saveCartState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cartState = JSON.stringify(Array.from(this.cartItems.entries()));
      sessionStorage.setItem('cart', cartState);
    }
  }

  // Loads the cart state from sessionStorage if available
  private loadCartState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cartState = sessionStorage.getItem('cart');
      if (cartState) {
        this.cartItems = new Map(JSON.parse(cartState));
        this.updateCart(); // Ensures the observable is updated with the loaded state
      }
    }
  }
}
