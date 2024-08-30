import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private apiUrl = 'http://localhost:3000/promotions';

  constructor(private http: HttpClient) {}

  uploadPromotion(formData: FormData): Observable<any> {

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }


  countPromotions(): Observable<any> {

    return this.http.get(`${this.apiUrl}/count`)
  }

  getAllPromotions(): Observable<any> {

    return this.http.get(this.apiUrl);
  }
}
