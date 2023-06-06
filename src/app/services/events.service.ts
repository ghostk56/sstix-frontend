import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { REST_API_URL } from '../common/system-parameter';
import { RestfulResponse } from '../common/core/RestfulResponse';
import { EventAddRequest } from '../models/event-add-request';
import { EventsResponse } from '../models/events-response';

const url = REST_API_URL + '/events';
@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(private http: HttpClient) {}

  selectAllEvents(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<RestfulResponse<EventsResponse[]>>(url, { headers });
  }

  addEvent(token: string, event: EventAddRequest) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<RestfulResponse<any>>(url, event, { headers });
  }
}
