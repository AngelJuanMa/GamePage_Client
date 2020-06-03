import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['../pride/pride.style.css'],
  providers: [UserService],
})
export class UserEditComponent {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public url: string;
  public error;
  @Input('popupUpdate') popupUpdate;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ṕ;

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      (response) => {
        localStorage.setItem('identity', JSON.stringify(this.user));
        this.identity = this.user;
        location.reload();
      },
      (error) => {
        this.error = error.error.message;
        console.log(<any>error);
      }
    );
  }
}
