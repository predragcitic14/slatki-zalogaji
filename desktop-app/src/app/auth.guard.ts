import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const user = this.userService.getCurrentUser();

    console.log('Jesi li to null jebem ti mater', user);

    if (user && user.type === 'worker') {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
