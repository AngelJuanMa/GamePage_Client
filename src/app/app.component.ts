import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import io from 'socket.io-client';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService],
})
export class AppComponent implements OnInit, DoCheck {
  public title: string;
  public identity;
  public user: User;
  public open_box: boolean;
  public open_user: boolean;
  public open_clan: boolean;
  public open_update: boolean;
  public url: string;
  public ranking;
  public gp;
  public token;
  public max;
  public percent;
  public href: boolean;
  @ViewChild('skin') skin;
  private userIo: any;
  @ViewChild('clan') clan;
  @ViewChild('friends') friends;
  @ViewChild('edit') edit;

  datoHijo: string = 'Sin datos';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.userIo = io('http://localhost:3000');
    this.title = 'RedJuegos';
    this.url = GLOBAL.url;
    this.user = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.open_box = false;
    this.open_user = false;
    this.open_clan = false;
    this.open_update = false;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.nivel(this.identity);
    /* href return true o false */
    this.href = (window.location.href).includes('sala');
  }

  ngAfterViewInit() {
    this.changeColor();
  }

  nivel(identity) {
    if (identity != null) {
      if (identity.wins < 4) {
        this.gp = identity.wins;
        this.ranking = 4;
      } else if (identity.wins < 11) {
        this.gp = identity.wins - 4;
        this.ranking = 6;
      } else if (identity.wins < 23) {
        this.gp = identity.wins - 11;
        this.ranking = 12;
      } else if (identity.wins < 40) {
        this.gp = identity.wins - 23;
        this.ranking = 17;
      } else if (identity.wins < 61) {
        this.gp = identity.wins - 40;
        this.ranking = 21;
      } else if (identity.wins >= 61) {
        this.gp = identity.wins - 61;
        this.ranking = 27;
      }
      this.max = identity.wins + identity.lose;
      if (this.max == 0) return (this.percent = 0);

      this.percent = 100 - (identity.lose * 100) / this.max;
    } else {
      this.gp, this.max, (this.percent = 0);
      this.ranking = 4;
    }
  }
  public colors;
  changeColor(){
    this.colors = this.identity.deg+"deg,"+this.identity.color +","+this.identity.color2 + ","+ this.identity.color3;
    this.skin.nativeElement.style.background = "linear-gradient("+this.colors+")";
  }

  funCambiar(e) {
    console.log('123');
    console.log(e);
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }

  logout() {
    if(this.href === true){
      console.log(this.token)
      this._userService.returnToLobby(this.user).subscribe(
        (response) => {
          console.log(response);
          this._router.navigate(['/lobby']);
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      this.userIo.emit('userDisconnect', this.identity._id);
      localStorage.clear();
      this.identity = null;
      this._router.navigate(['/']);
    }

  }

  openPopup_box(enter, leave) {
    if (leave && !this.open_box)
      this.friends.nativeElement.style.color = 'rgb(209, 209, 209)';
    if (enter) this.friends.nativeElement.style.color = 'rgb(148, 148, 148)';
    else if (!leave) {
      this.open_box = this.open_box == false ? true : false;

      if (this.open_box)
        this.friends.nativeElement.style.color = 'rgb(148, 148, 148)';
      else this.friends.nativeElement.style.color = 'rgb(209, 209, 209)';
      this.clearColor(1);

      this.open_user = false;
      this.open_clan = false;
      this.open_update = false;
    }
  }
  openPopup_clan(enter, leave) {
    if (leave && !this.open_clan)
      this.clan.nativeElement.style.color = 'rgb(209, 209, 209)';
    if (enter) this.clan.nativeElement.style.color = 'rgb(148, 148, 148)';
    else if (!leave) {
      this.open_clan = this.open_clan == false ? true : false;

      if (this.open_clan)
        this.clan.nativeElement.style.color = 'rgb(148, 148, 148)';
      else this.clan.nativeElement.style.color = 'rgb(209, 209, 209)';
      this.clearColor(3);

      this.open_box = false;
      this.open_user = false;
      this.open_update = false;
    }
  }
  openPopup_update(enter, leave) {
    if (leave && !this.open_update)
      this.edit.nativeElement.style.color = 'rgb(209, 209, 209)';
    if (enter) this.edit.nativeElement.style.color = 'rgb(148, 148, 148)';
    else if (!leave) {
      this.open_update = this.open_update == false ? true : false;

      if (this.open_update)
        this.edit.nativeElement.style.color = 'rgb(148, 148, 148)';
      else this.edit.nativeElement.style.color = 'rgb(209, 209, 209)';
      this.clearColor(4);

      this.open_box = false;
      this.open_user = false;
      this.open_clan = false;
    }
  }

  clearColor(data) {
    if (data !== 1)
      this.friends.nativeElement.style.color = 'rgb(209, 209, 209)';
    if (data !== 3) this.clan.nativeElement.style.color = 'rgb(209, 209, 209)';
    if (data !== 4) this.edit.nativeElement.style.color = 'rgb(209, 209, 209)';
  }
}
