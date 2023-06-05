import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { REST_API_URL } from '../common/system-parameter';
import { UsersLoginRequest } from '../models/users-login-request';
import { UsersRegisterRequest } from '../models/users-register-request';
import { RestfulResponse } from '../common/core/RestfulResponse';
import { UsersInfoResponse } from '../models/users-info-response';
import { UsersUpdateRequest } from '../models/users-update-request';

const url = REST_API_URL + '/users';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  login(user: UsersLoginRequest) {
    return this.http.post<RestfulResponse<any>>(url + '/login', user);
  }

  register(user: UsersRegisterRequest) {
    return this.http.post<RestfulResponse<any>>(url, user);
  }

  userInfo(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer${token}`);
    return this.http.get<RestfulResponse<UsersInfoResponse>>(url, { headers });
  }

  eidtInfo(token: string, user : UsersUpdateRequest) {
    const headers = new HttpHeaders().set('Authorization', `Bearer${token}`);
    return this.http.put<RestfulResponse<any>>(url, user, { headers });
  }
}
