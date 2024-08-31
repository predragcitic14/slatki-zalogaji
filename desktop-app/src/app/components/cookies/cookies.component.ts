import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss'
})
export class CookiesComponent {

  isBrowser: boolean;
  productsCount: number = 0;
  producstPerPage: number = 3;
  products: Product[] = [];
  pageNum = 1;
  type = 'kolac';
  totalPages = 1;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private productService: ProductService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit():void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.countProducts(this.type).subscribe({
      next: (res) => {
        this.productsCount = res.count;
        this.totalPages = Math.ceil(this.productsCount / this.producstPerPage);
      },
      error: (err) => {
        console.error('Error fetching promotions count', err);
      }
    });

    this.productService.getProducts(this.pageNum, this.type).subscribe({
      next: (res) => {
        this.products = res.products;
      },
      error: (err) => {
        console.error('Error fetching promotions', err);
      }
    });
  }

  changePage(pageNum: number): void {
    if (pageNum > 0 && pageNum <= this.totalPages) {
      this.pageNum = pageNum;
      this.loadProducts()
    }
  }

  prevPage(): void {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.pageNum < this.totalPages) {
      this.pageNum++;
      this.loadProducts();
    }
  }

  goToPage(page: number): void {
    this.pageNum = page;
    this.loadProducts();
  }

   pagesToShow(): number[] {
    const pages: number[] = [];

    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else if (this.pageNum <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (this.pageNum >= this.totalPages - 2) {
      pages.push(this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
    } else {
      pages.push(this.pageNum - 1, this.pageNum, this.pageNum + 1);
    }

    return pages;
  }

  shouldShowFirst(): boolean {
    return this.totalPages > 5 && this.pageNum > 3;
  }

  shouldShowLast(): boolean {
    return this.totalPages > 5 && this.pageNum < this.totalPages - 2;
  }

  shouldShowLeftEllipsis(): boolean {
    return this.pageNum > 3 && this.totalPages > 5;
  }

  shouldShowRightEllipsis(): boolean {
    return this.pageNum < this.totalPages - 2 && this.totalPages > 5;
  }
}
