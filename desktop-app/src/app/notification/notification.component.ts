import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [NgClass],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true
})
export class NotificationComponent implements OnInit {
  message: { type: 'success' | 'error', message: string } | null = null;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.currentMessage.subscribe(message => this.message = message);
  }
}
