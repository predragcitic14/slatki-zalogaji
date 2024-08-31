
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ProductService } from '../../services/product.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './user-notifications.component.html',
  styleUrl: './user-notifications.component.scss'
})
export class UserNotificationsComponent implements OnInit {

  notifications: any[] = [];
  notificationsCount: number = 0;
  notificationsPerPage: number = 5;
  totalPages: number = 1;
  pageNum: number = 1;
  user: User | null = null;
  isLoggedIn: boolean = false;
  loading: boolean = true;

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
          this.loadNotifications();
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

  loadNotifications(): void {
    if (!this.user || !this.user._id) {
      console.error('User is not logged in or userId is undefined');
      this.loading = false;
      return;
    }

    const countSub = this.notificationService.countNotifications(this.user._id).subscribe({
      next: (res) => {
        this.notificationsCount = res.count;
        this.totalPages = Math.ceil(this.notificationsCount / this.notificationsPerPage);
      },
      error: (err) => {
        console.error('Error fetching notifications count', err);
        this.loading = false;
      }
    });

    const notifSub = this.notificationService.getNotifications(this.pageNum, '').subscribe({
      next: (res) => {
        this.notifications = res.orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications', err);
        this.loading = false;
      }
    });

    this.subscriptions.push(countSub, notifSub);
  }

  changePage(pageNum: number): void {
    if (pageNum > 0 && pageNum <= this.totalPages) {
      this.pageNum = pageNum;
      this.loadNotifications();
    }
  }

  prevPage(): void {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.loadNotifications();
    }
  }

  nextPage(): void {
    if (this.pageNum < this.totalPages) {
      this.pageNum++;
      this.loadNotifications();
    }
  }

  goToPage(page: number): void {
    this.pageNum = page;
    this.loadNotifications();
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
        return 'obradjena';
      case 'rejected':
        return 'odbijena';
      case 'approved':
        return 'prihvacena';
      case 'finished':
        return 'obradjena'
      default:
        return 'nepoznata';
    }
  }
}
