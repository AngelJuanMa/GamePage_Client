import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { FollowRequest } from '../models/followRequest';

@Injectable()
export class FollowService{
	public url:string;
	public identity;
	public token;
	public stats;

	constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
    }

    follow(token , followed: FollowRequest): Observable<any>{
    let params = JSON.stringify(followed);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									                 .set('Authorization',token);

		return this._http.post(this.url+'followReq', params, {headers:headers});
    }

    doFollowReq(token, followed, follow): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									                 .set('Authorization',token);

		return this._http.delete(this.url+'doFollowReq/'+followed+'/'+follow, {headers:headers});
    }

    getfollowedRequest(token): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									                 .set('Authorization',token);

		return this._http.get(this.url+'followedRequest', {headers:headers});
	}

    getFollows(token): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									                 .set('Authorization',token);

		return this._http.get(this.url+'getFollows', {headers:headers});
    }

    deleteFollow(token, friend): Observable<any>{
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization',token);

      return this._http.delete(this.url+'deleteFollow/'+friend, {headers:headers});
      }
}

