import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestfulResponse } from '../common/core/RestfulResponse';
import { REST_API_URL } from '../common/system-parameter';
import { OrderAddRequest } from '../models/order-add-request';
import { OrderUpdateRequest } from '../models/order-update-request';
import { OrdersResponse } from '../models/orders-response';

const url = REST_API_URL + '/orders';
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  selectAllOrders(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<RestfulResponse<OrdersResponse[]>>(url, { headers });
  }

  selectUserOrders(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<RestfulResponse<OrdersResponse[]>>(url + '/user', {
      headers,
    });
  }

  addOrders(token: string, req: OrderAddRequest) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<RestfulResponse<any>>(url, req, { headers });
  }

  cancelOrder(token: string, req: OrderUpdateRequest) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<RestfulResponse<any>>(url, req, { headers });
  }
}
