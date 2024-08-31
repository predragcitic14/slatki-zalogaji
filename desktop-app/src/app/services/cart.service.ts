import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new Map<string, { productId: string, name: string, quantity: number, price: number }>();
  private cartItemsSubject = new BehaviorSubject<Array<{ productId: string, name: string, quantity: number, price: number }>>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartState();
    }
  }

  addToCart(productId: string, name: string, quantity: number, price: number): void {
    const existingItem = this.cartItems.get(productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.set(productId, { productId, name, quantity, price });
    }

    this.updateCart();
  }

  incrementQuantity(productId: string): void {
    const item = this.cartItems.get(productId);
    if (item) {
      item.quantity++;
      this.updateCart();
    }
  }

  decrementQuantity(productId: string): void {
    const item = this.cartItems.get(productId);
    if (item) {
      item.quantity--;
      if (item.quantity === 0) {
        this.cartItems.delete(productId);
      }
      this.updateCart();
    }
  }

  removeItem(productId: string): void {
    this.cartItems.delete(productId);
    this.updateCart();
  }

  getCartItemCount(): number {
    return Array.from(this.cartItems.values())
      .reduce((totalCount, item) => totalCount + item.quantity, 0);
  }

  getCartItems(): Array<{ productId: string, name: string, quantity: number, price: number }> {
    return Array.from(this.cartItems.values());
  }

  private updateCart(): void {
    this.cartItemsSubject.next(this.getCartItems());
    if (isPlatformBrowser(this.platformId)) {
      this.saveCartState();
    }
  }

  private saveCartState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cartState = JSON.stringify(Array.from(this.cartItems.entries()));
      sessionStorage.setItem('cart', cartState);
    }
  }

  private loadCartState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cartState = sessionStorage.getItem('cart');
      if (cartState) {
        this.cartItems = new Map(JSON.parse(cartState));
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems.clear();
    this.updateCart();
  }
}
