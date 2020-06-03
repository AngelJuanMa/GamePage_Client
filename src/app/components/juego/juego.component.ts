import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Mover } from '../../models/movimiento';
import { JuegoService } from '../../services/mover.service';
import { UserService } from '../../services/user.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'juego',
  templateUrl: './juego.component.html',
  providers: [UserService, JuegoService],
})
export class JuegoComponent implements OnInit {
  public title: string;
  public identity;
  public ficha: string;
  public hisFicha: string;
  public mover: Mover;
  public num: number;
  public token;
  public a1: boolean;
  public a2: boolean;
  public a3: boolean;
  public b1: boolean;
  public b2: boolean;
  public b3: boolean;
  public c1: boolean;
  public c2: boolean;
  public c3: boolean;
  public can = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _juegoService: JuegoService,
    private _userService: UserService
  ) {
    this.ficha = 'X';
    this.hisFicha = 'O';
    this.title = 'TaTeTi';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.mover = new Mover('', '', '', null, '');
  }
  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this._route.params.subscribe((params) => {
      const num = params['num'];
      this.num = num;
      this.mover.num = num;
      //this.getMove(num);
    });
  }

  onSubmit(form) {
    if (this.can == false) return 'error';
    this.mover.campo = form;

    this._juegoService.registerMove(this.token, this.mover).subscribe(
      (response) => {
        this.can = false;
        var camp = document.getElementById(form);
        camp.textContent = this.ficha;
        this.getMove(this.num);
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  getMove(num) {
    this._juegoService.getMove(this.token, num).subscribe(
      (response) => {
        var resp = response.move;
        if (resp == null) return 'nada aun';
        this.can = true;
        switch (resp.campo) {
          case 'a1':
            var a1 = document.getElementById('a1');
            this.a1 = true;
            a1.textContent = this.hisFicha;
            break;
          case 'a2':
            var a2 = document.getElementById('a2');
            this.a2 = true;
            a2.textContent = this.hisFicha;
            break;
          case 'a3':
            var a3 = document.getElementById('a3');
            this.a3 = true;
            a3.textContent = this.hisFicha;
            break;
          case 'b1':
            var b1 = document.getElementById('b1');
            this.b1 = true;
            b1.textContent = this.hisFicha;
            break;
          case 'b2':
            var b2 = document.getElementById('b2');
            this.b2 = true;
            b2.textContent = this.hisFicha;
            break;
          case 'b3':
            var b3 = document.getElementById('b3');
            this.b3 = true;
            b3.textContent = this.hisFicha;
            break;
          case 'c1':
            this.c1 = true;
            var c1 = document.getElementById('c1');
            c1.textContent = this.hisFicha;
            break;
          case 'c2':
            this.c2 = true;
            var c2 = document.getElementById('c2');
            c2.textContent = this.hisFicha;
            break;
            this.c3 = true;
            var c3 = document.getElementById('c3');
            c3.textContent = this.hisFicha;
          case 'c3':
            break;
        }

        this.comprobar();
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }
  comprobar() {
    console.log('comprobando...');
    if (this.a1 == true && this.a2 == true && this.a3 == true) alert('ganaste');
    else if (this.b1 == true && this.b2 == true && this.b3 == true)
      alert('ganaste');
    else if (this.c1 == true && this.c2 == true && this.c3 == true)
      alert('ganaste');
    else if (this.a1 == true && this.b2 == true && this.c3 == true)
      alert('ganaste');
    else if (this.c1 == true && this.b2 == true && this.a3 == true)
      alert('ganaste');
  }
}
