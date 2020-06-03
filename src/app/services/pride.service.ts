import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { Pride } from '../models/pride';
import { PrideRequest } from '../models/prideRequest';

@Injectable()
export class PrideService {
  public url: string;
  public identity;
  public token;
  public stats;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  savePride(token, pride): Observable<any> {
    let params = JSON.stringify(pride);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.post(this.url + 'savePride', params, {
      headers: headers,
    });
  }

  getPride(token, id): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'getPride/' + id, { headers: headers });
  }

  getMyPride(token): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'getMyPride', { headers: headers });
  }

  getPrides(token, name): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'getPrides/' + name, { headers: headers });
  }

  applyPride(token, pride): Observable<any> {
    let params = JSON.stringify(pride);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.post(this.url + 'applyPride', params, {
      headers: headers,
    });
  }

  getPrideRequests(token): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'getPrideRequests', { headers: headers });
  }

  deleteRequest(token, userId): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.delete(this.url + 'deleteRequest/' + userId, {
      headers: headers,
    });
  }

  joinPride(token, userId): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'joinPride/' + userId, {
      headers: headers,
    });
  }

  getMembers(token, prideId): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'getMembers/' + prideId, {
      headers: headers,
    });
  }

  deleteMember(token, userId: User): Observable<any> {
    let params = JSON.stringify(userId);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.put(this.url + 'deleteMember', params, {
      headers: headers,
    });
  }
}
