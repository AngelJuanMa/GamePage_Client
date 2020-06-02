import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Mover } from '../models/movimiento';

@Injectable()
export class JuegoService{
	public url:string;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	registerMove(token, mover: Mover): Observable<any>{
		let params = JSON.stringify(mover);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization',token);

		return this._http.post(this.url+'juego', params, {headers:headers});
	}
	
	getMove(token, num):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',token);

		
		return this._http.get(this.url+'getMove/'+num, {headers: headers});
	}
}

