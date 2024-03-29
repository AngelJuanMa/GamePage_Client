import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['login.style.css'],
  providers: [UserService],
})
export class LoginComponent implements OnInit {
  public user: User;
  public status: string;
  public identity;
  public message;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.identity = this._userService.getIdentity();
    this.user = new User(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      true,
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
    if (this.identity) this._router.navigate(['/lobby']);
  }

  onSubmit() {
    // loguear al usuario y conseguir sus datos
    this._userService.signup(this.user).subscribe(
      (response) => {
        this.identity = response.user;

        if (!this.identity || !this.identity._id) {
          this.status = 'error';
        } else {
          // PERSISTIR DATOS DEL USUARIO
          localStorage.setItem('identity', JSON.stringify(this.identity));

          // Conseguir el token
          this.getToken();
        }
      },
      (error) => {
        this.message = error.error.message;
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  getToken() {
    this._userService.signup(this.user, 'true').subscribe(
      (response) => {
        this.token = response.token;

        if (this.token.length <= 0) {
          this.status = 'error';
        } else {
          // PERSISTIR TOKEN DEL USUARIO
          localStorage.setItem('token', this.token);
          this._router.navigate(['/lobby']);
          location.reload();
        }
      },
      (error) => {
        this.message = error.error.message;
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }
}
