import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ProductService } from '../../services/product.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-worker-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './worker-notifications.component.html',
  styleUrl: './worker-notifications.component.scss'
})
export class WorkerNotificationComponent implements OnInit, OnDestroy {

  orders: any[] = [];
  totalOrders: number = 0;
  ordersPerPage: number = 5;
  totalPages: number = 1;
  pageNum: number = 1;
  isLoggedIn: boolean = false;
  loading: boolean = true;
  user: User | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private notificationService: ProductService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userSub = this.userService.user$.subscribe(user => {
        this.user = user;
        this.isLoggedIn = !!user;
        if (this.user) {
          this.loadOrders();
        } else {
          this.loading = false;
        }
      });
      this.subscriptions.push(userSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadOrders(): void {
    if (!this.user || !this.user._id) {
      console.error('User is not logged in or userId is undefined');
      this.loading = false;
      return;
    }

    this.notificationService.countWorkerNotifications(this.user._id).subscribe({
      next: (res) => {
        this.totalOrders = res.count;
        this.totalPages = Math.ceil(this.totalOrders / this.ordersPerPage);
        console.log(this.totalOrders, this.totalPages);
      }
    })

    const ordersSub = this.notificationService.getNotifications(this.pageNum, this.user._id).subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        this.loading = false;
      }
    });
    this.subscriptions.push(ordersSub);
  }

  changeOrderStatus(orderId: string, status: 'approved' | 'rejected'): void {
    // First, retrieve the current order details
    const getOrderSub = this.notificationService.getOrderById(orderId).subscribe({
      next: (order) => {

        const newOrder = {
          ...order,
          _id: undefined,
          status,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const createOrderSub = this.notificationService.createOrder(newOrder).subscribe({
          next: (newOrderRes) => {
            const updateOrderSub = this.notificationService.updateOrderStatus(orderId, 'finished').subscribe({
              next: (updateRes) => {
                console.log(updateRes);
                this.loadOrders();
              },
              error: (err) => {
                console.error('Error updating current order status to finished', err);
              }
            });

            // Push the updateOrder subscription to subscriptions array
            this.subscriptions.push(updateOrderSub);
          },
          error: (err) => {
            console.error(`Error creating new order with status ${status}`, err);
          }
        });

        // Push the createOrder subscription to subscriptions array
        this.subscriptions.push(createOrderSub);
      },
      error: (err) => {
        console.error(`Error fetching order with ID ${orderId}`, err);
      }
    });

    // Push the getOrder subscription to subscriptions array
    this.subscriptions.push(getOrderSub);
  }


  changePage(pageNum: number): void {
    if (pageNum > 0 && pageNum <= this.totalPages) {
      this.pageNum = pageNum;
      this.loadOrders();
    }
  }

  prevPage(): void {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.pageNum < this.totalPages) {
      this.pageNum++;
      this.loadOrders();
    }
  }

  goToPage(page: number): void {
    this.pageNum = page;
    this.loadOrders();
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

  getNotificationStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Obrada';
      case 'rejected':
        return 'Odbijena';
      case 'approved':
        return 'Prihvaćena';
      default:
        return 'Nepoznato';
    }
  }
}
