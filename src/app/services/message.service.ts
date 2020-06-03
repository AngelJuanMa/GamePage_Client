import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Message } from '../models/message';
import { User } from '../models/user';

@Injectable()
export class MessageService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  sendMessage(token, message: Message): Observable<any> {
    let params = JSON.stringify(message);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.post(this.url + 'message', params, { headers: headers });
  }
  emittedMessages(token): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'my-messages', { headers: headers });
  }
  receivedMessages(token): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'messages', { headers: headers });
  }

  userMessages(token, friend): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'userMessages/' + friend, {
      headers: headers,
    });
  }

  getMessageGeneral(token, pride): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'getMessageGeneral/' + pride, {
      headers: headers,
    });
  }

  setViewedMessages(token, emitter: User): Observable<any> {
    let params = JSON.stringify(emitter);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.put(this.url + 'set-viewed-messages', params, {
      headers: headers,
    });
  }
}
