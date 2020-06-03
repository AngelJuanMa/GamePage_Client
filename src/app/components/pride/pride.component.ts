import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Pride } from '../../models/pride';
import { PrideRequest } from '../../models/prideRequest';
import { PrideService } from '../../services/pride.service';
import io from 'socket.io-client';

@Component({
  selector: 'pride',
  templateUrl: './pride.component.html',
  styleUrls: ['pride.style.css'],
  providers: [UserService, PrideService],
})
export class PrideComponent implements OnInit {
  public title: string;
  public message;
  public token;
  public identity;
  public pride: Pride;
  public prideRequest: PrideRequest;
  public user: User;
  @Input('popupPride') popupPride = false;
  private socket: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _prideService: PrideService
  ) {
    this.title = 'PRIDE';
    this.socket = io('http://localhost:3002');
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.pride = new Pride('', '', '');
    this.prideRequest = new PrideRequest('', '', '');
    this.user = new User(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      false,
      0,
      0,
      '',
      '',
      '',
      '',
      360
    );
  }

  ngOnInit() {
    if (this.identity.pride) {
      this.getMembers();
      this.getMyPride();
    }
    this.sockets();
  }

  public userReq;
  sockets() {
    this.socket.emit('user', this.identity._id);
    if (this.identity.pride) {
      this.socket.on('request', (target, user) => {
        this.userReq = user;

        var userTarget = { user: { nick: user.nick, _id: user._id } };

        this.usersToRequest.push(userTarget);
      });
    }
    this.socket.on('requestAceppted', (prideId) => {
      this.identity.pride = prideId;
      localStorage.setItem('identity', JSON.stringify(this.identity));
      this.getMembers();
      this.getMyPride();
    });
    this.socket.on('error', (error) => {
      console.log(error);
    });
  }

  onSubmit(form) {
    this._prideService.savePride(this.token, this.pride).subscribe(
      (response) => {},
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  public prideUsers;
  getPride(pride) {
    this._prideService.getPride(this.token, pride._id).subscribe(
      (response) => {
        this.prideUsers = response.users;
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  public prideName;
  public prideMaster;
  getMyPride() {
    this._prideService.getMyPride(this.token).subscribe(
      (response) => {
        this.prideName = response.pride.name;
        this.prideMaster = response.pride.master;
        if (this.identity._id == response.pride.master) this.getPrideRequests();
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  public prides = { name: '' };
  public pridesR;
  getPrides() {
    this._prideService.getPrides(this.token, this.prides.name).subscribe(
      (response) => {
        this.pridesR = response.clanesArr;
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  applyPride(prideR) {
    this._prideService.applyPride(this.token, prideR).subscribe(
      (response) => {
        this.socket.emit(
          'applyPride',
          this.identity,
          prideR.name,
          response.prideReqStored
        );
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  public usersToRequest: any[] = [];
  getPrideRequests() {
    this._prideService.getPrideRequests(this.token).subscribe(
      (response) => {
        this.usersToRequest = response.pridesRequest;
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  deleteRequest(userId) {
    this._prideService.deleteRequest(this.token, userId).subscribe(
      (response) => {
        this.getMembers();
        this.getPrideRequests();
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  joinPride(userId) {
    this._prideService.joinPride(this.token, userId).subscribe(
      (response) => {
        this.socket.emit('requestAccept', this.userReq, this.identity.pride);
        this.getMembers();
        this.getPrideRequests();
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  public members: [];
  getMembers() {
    var prideId = this.identity.pride;

    this._prideService.getMembers(this.token, prideId).subscribe(
      (response) => {
        console.log(response);
        this.members = response.users;
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  deleteMember(userId) {
    this.user._id = userId;
    this._prideService.deleteMember(this.token, this.user).subscribe(
      (response) => {
        this.members = response.users;
        this.getMembers();
        this.getMyPride();
      },
      (error) => {
        this.message = error.error.message;
        console.log(<any>error);
      }
    );
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }
}
