import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  uploadProduct(formData: FormData): Observable<any> {

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }


  countProducts(type: string): Observable<any> {

    return this.http.get(`${this.apiUrl}/count`, {params: { type }})
  }

  getProducts(pageNum: number, type: string): Observable<any> {

    return this.http.get(this.apiUrl, { params: { pageNum, type }});
  }
}
