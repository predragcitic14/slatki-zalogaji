import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

    mailAddress = 'slatki.zalogaji@gmail.com';
    instagramProfile = '@slatki.zalogaji';
    tiktokProfile = 'slatki.zalogaji'
}
