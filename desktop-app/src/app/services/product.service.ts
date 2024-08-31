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

    return this.http.post(`${this.apiURL}/products/upload`, formData);
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

  // FOR USER AND WORKER NOTIFICATIONS

  getNotifications(pageNum: number, workerId: string): Observable<any> {

    return this.http.get<any>(`${this.apiURL}/orders`, { params: { pageNum, workerId }});
  }

  countNotifications(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/orders/count`, { params: { userId }});
  }

  countWorkerNotifications(workerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/orders/count`, { params: { workerId }});
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/orders/${orderId}`);
  }

  createOrder(newOrder: any): Observable<any> {
    return this.http.post(`${this.apiURL}/orders/upload`, newOrder);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const body = { orderId, status };
    return this.http.patch(`${this.apiURL}/orders/update`, body)
  }

  countPendingOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/orders/count`, {params: { status: "pending"}});
  }
}
