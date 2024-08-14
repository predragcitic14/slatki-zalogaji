import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSource = new BehaviorSubject<{ type: 'success' | 'error', message: string } | null>(null);
  currentMessage = this.messageSource.asObservable();

  showMessage(type: 'success' | 'error', message: string) {
    this.messageSource.next({ type, message });
    setTimeout(() => this.messageSource.next(null), 5000);
  }
}
