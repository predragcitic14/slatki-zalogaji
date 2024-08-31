import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User | null>(null);
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
    if (this.isBrowser) {
      const user = this.getUserFromCookies();
      if (user) {
        this.userSubject.next(user);
      }
    }
    this._isLoggedIn.next(!!this.getCurrentUser());
  }

  private getUserFromCookies(): User | null {
    if (this.isBrowser) {
      const userString = this.cookieService.get('user');
      if (userString) {
        return JSON.parse(userString);
      }
    }
    return null;
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.userSubject.asObservable().pipe(
      map(user => !!user)
    );
  }

  setLoggedIn(isLoggedIn: boolean) {
    this._isLoggedIn.next(isLoggedIn);
  }

  private saveUserToCookies(user: User): void {
    if (this.isBrowser) {
      this.cookieService.set('user', JSON.stringify(user), { secure: true, sameSite: 'Strict' });
    }
  }

  private clearUserFromCookies(): void {
    if (this.isBrowser) {
      this.cookieService.delete('user');
    }
  }

  setUser(user: User): void {
    this.userSubject.next(user);
    this.saveUserToCookies(user);
  }

  updateUser(user: User) : Observable<{message: string, user: User}> {
    const payload = {
      name: user.name,
      lastname: user.lastname,
      password: user.password,
      phone: user.phone,
      address: user.address
    };

    return this.http.patch<{ message: string; user: User }>(`${this.apiUrl}/update/${user._id}`, payload).pipe(
      tap(response => this.setUser(response.user))
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  clearUser(): void {
    this.userSubject.next(null);
    this.clearUserFromCookies();
  }

  login(email: string, password: string): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => this.setUser(response.user))
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
