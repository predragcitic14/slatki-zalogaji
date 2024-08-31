import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user!: User;
  private apiUrl = 'http://localhost:3000/users';
  private isBrowser: boolean;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this._isLoggedIn.next(!!this.getCurrentUser());
  }

  get isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn.asObservable();
  }

  setLoggedIn(isLoggedIn: boolean) {
    this._isLoggedIn.next(isLoggedIn);
  }

  setUser(user: User) {
    this.user = user;
    if (this.isBrowser) {
      // localStorage.setItem('user', JSON.stringify(user));
      this.cookieService.set('user', JSON.stringify(user), { secure: true, sameSite: 'Strict' });
      this._isLoggedIn.next(true);
    }
  }

  updateUser(user: User) : Observable<{message: string, user: User}> {
    const payload = {
      name: user.name,
      lastname: user.lastname,
      password: user.password,
      phone: user.phone,
      address: user.address
    };

    return this.http.patch<{ message: string; user: User }>(`${this.apiUrl}/update/${user._id}`, payload);
  }

  getCurrentUser(): User | null {
    if (this.isBrowser) {
      if (this.user) {
        return this.user;
      }
      const userString = this.cookieService.get('user');
      if (userString) {
        this.user = JSON.parse(userString);
        return this.user;
      }
    }
    return null;
  }

  clearUser() {
    this.user = null as unknown as User;
    this.cookieService.delete('user');
    this._isLoggedIn.next(false);
    if (this.isBrowser) {
      this.cookieService.delete('user');
      this._isLoggedIn.next(false);
    }
  }

  login(email: string, password: string): Observable<{user: User}> {
    const userInfo: { email: string, password: string } = { email, password };
    return this.http.post<{user: User}>(`${this.apiUrl}/login`, userInfo).pipe(
      tap(response => {
        if (this.isBrowser) {
          this.setUser(response.user);
        }
      })
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user)
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): void {
    this.clearUser();
    this.router.navigate(['/home']);
  }

  sendResetEmail(email: string) {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: any, newPassword: string) {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

}
