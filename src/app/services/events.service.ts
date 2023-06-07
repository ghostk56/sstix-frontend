import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestfulResponse } from '../common/core/RestfulResponse';
import { REST_API_URL } from '../common/system-parameter';
import { EventAddRequest } from '../models/event-add-request';
import { EventsResponse } from '../models/events-response';

const url = REST_API_URL + '/events';
@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(private http: HttpClient) {}

  selectAllEvents(name: string = '', status: number = 0) {
    const params = new HttpParams().set('name', name).set('status', status);
    return this.http.get<RestfulResponse<EventsResponse[]>>(url, {
      params,
    });
  }

  selectIdEvent(id: string) {
    return this.http.get<RestfulResponse<EventsResponse>>(url + '/' + id);
  }

  addEvent(token: string, event: EventAddRequest) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<RestfulResponse<any>>(url, event, { headers });
  }

  editEvent(token: string, event: EventAddRequest) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<RestfulResponse<any>>(url, event, { headers });
  }
}
