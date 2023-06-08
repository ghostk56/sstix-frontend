import { EventsResponse } from './events-response';

export interface OrdersResponse {
  id: number;
  userId: number;
  quantity: number;
  eventPrice: number;
  orderDate: Date;
  status: number;
  event: EventsResponse;
}
