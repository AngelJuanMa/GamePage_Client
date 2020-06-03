import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Sala } from '../models/sala';

@Injectable()
export class LobbyService {
  public url: string;
  public identity;
  public token;
  public stats;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  createSala(token, sala: Sala): Observable<any> {
    let params = JSON.stringify(sala);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.post(this.url + 'createSala', params, {
      headers: headers,
    });
  }

  getSalas(token, ordenar): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'getSalas/' + ordenar, {
      headers: headers,
    });
  }

  joinSala(token, num): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http.get(this.url + 'joinSala/' + num, { headers: headers });
  }
}
