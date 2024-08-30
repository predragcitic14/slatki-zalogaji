import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-show-product',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.scss']
})
export class ShowProductComponent implements OnInit {

  product: any;
  loading: boolean = true;
  comments: any[] = [];
  commentsCount: number = 0;
  commentsPerPage: number = 3;
  totalPages: number = 1;
  pageNum: number = 1;
  newComment: string = '';
  quantity: number = 0;
  user: User | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser() as User;
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data.product;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching product by ID', err);
          this.loading = false;
        }
      });

      this.loadComments(productId);
    } else {
      console.error('Product ID not found in the route.');
    }

    console.log('USER',this.user);
  }

  loadComments(productId: string): void {
    this.productService.countComments(productId).subscribe({
      next: (res) => {
        this.commentsCount = res.count;
        this.totalPages = Math.ceil(this.commentsCount / this.commentsPerPage);
      },
      error: (err) => {
        console.error('Error fetching comments count', err);
      }
    });

    this.productService.getComments(productId, this.pageNum).subscribe({
      next: (res) => {
        this.comments = res.comments;
        console.log(JSON.stringify(this.comments));
        this.comments.forEach(comment => {
          this.productService.getUserById(comment.userId).subscribe({
            next: (user) => {
              comment.userName = user.name;
            },
            error: (err) => {
              console.error(`Error fetching user ${comment.userId}`, err);
            }
          });
        });

      },
      error: (err) => {
        console.error('Error fetching comments', err);
      }
    });
  }


  changePage(pageNum: number): void {
    if (pageNum > 0 && pageNum <= this.totalPages) {
      this.pageNum = pageNum;
      this.loadComments(this.product._id);
    }
  }

  prevPage(): void {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.loadComments(this.product._id);
    }
  }

  nextPage(): void {
    if (this.pageNum < this.totalPages) {
      this.pageNum++;
      this.loadComments(this.product._id);
    }
  }

  goToPage(page: number): void {
    this.pageNum = page;
    this.loadComments(this.product._id);
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

  submitComment(): void {
    if (this.newComment.trim()) {
      const newCommentObj = {
        content: this.newComment.trim(),
        userId: this.user?._id,
        productId: this.product._id,
        createdAt: new Date().toISOString()
      };

      this.comments = [{
        ...newCommentObj,
        userName: this.user?.name
      }, ...this.comments]

      this.productService.addComment(newCommentObj).subscribe({
        next: (response) => {
          const addedComment = this.comments.find(comment => comment.content === newCommentObj.content);
          if (addedComment) {
            addedComment._id = response.comment._id;
          }
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          this.comments = this.comments.filter(comment => comment.content !== newCommentObj.content);
        }
      });

      this.newComment = '';
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  addToCart(): void {
    console.log('Product added to cart:', this.product, 'Quantity:', this.quantity);
  }

}




