import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  uploadProduct(formData: FormData): Observable<any> {

    return this.http.post(`/products/upload`, formData);
  }


  countProducts(type: string): Observable<any> {

    return this.http.get(`${this.apiURL}/products/count`, {params: { type }})
  }

  getProducts(pageNum: number, type: string): Observable<any> {

    return this.http.get(`${this.apiURL}/products`, { params: { pageNum, type }});
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiURL}/products/${id}`);
  }



  getComments(productId: string, pageNum: number): Observable<any> {
    return this.http.get(`${this.apiURL}/comments`, { params: { productId, pageNum } });
  }

  countComments(productId: string): Observable<any> {
    return this.http.get(`${this.apiURL}/comments/count`, { params: { productId } });
  }

  addComment(comment: any): Observable<any> {
    return this.http.post(`${this.apiURL}/comments/upload`, comment)
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiURL}/users/${id}`);
  }
}
