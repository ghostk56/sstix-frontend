import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { REST_API_URL } from '../common/system-parameter';
import { UsersLoginRequest } from '../models/users.-login-request';
import { UsersRegisterRequest } from '../models/users.-register-request';
import { RestfulResponse } from '../common/core/RestfulResponse';

const url = REST_API_URL + '/users';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  Login(user: UsersLoginRequest) {
    return this.http.post<RestfulResponse<any>>(url + "/login", user);
  }

  Register(user: UsersRegisterRequest) {
    return this.http.post<RestfulResponse<any>>(url, user);
  }

  UserInfo(token : string) {
      const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<RestfulResponse<any>>(url, { headers });
  }
}
