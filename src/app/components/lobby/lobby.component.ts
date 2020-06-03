import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Sala } from '../../models/sala';
import { UserService } from '../../services/user.service';
import { LobbyService } from '../../services/lobby.service';
import { SalaService } from '../../services/sala.service';
import { async } from '@angular/core/testing';
import { GLOBAL } from '../../services/global';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';

@Component({
  selector: 'lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['lobby.style.css'],
  providers: [UserService, LobbyService, MessageService, SalaService],
})
export class LobbyComponent implements OnInit {
  public title: string;
  public salas: Sala[];
  public url: string;
  public sala: Sala;
  public identity;
  public token;
  public popupp: boolean;
  public salaOver;
  public page: number;
  public status: boolean;
  public message: Message;
  public pride: boolean;
  @ViewChild('clan') clan;
  @ViewChild('todos') todos;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _lobbyService: LobbyService,
    private _messageService: MessageService,
    private _salaService: SalaService
  ) {
    this.pride = false;
    this.title = 'Lobby';
    this.url = GLOBAL.url;
    this.popupp = false;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.page = 1;
    this.salaOver = false;
    this.status = false;
    this.title = 'Registrate';
    this.sala = new Sala(
      '',
      '¡Ven y unete!!',
      null,
      '',
      '',
      '',
      '',
      '',
      null,
      '',
      '',
      false,
      false,
      false,
      false
    );
    this.message = new Message('', '', '', '', '', false, false);
  }
  ngOnInit() {
    if (this.identity) {
      this.getSalas('num');
      this.findUserInSala();
    } else this._router.navigate(['/login']);
  }

  findUserInSala() {
    this._salaService.findUserInSala(this.token).subscribe(
      (response) => {
        if (response.sala)
          this._router.navigate(['/sala/' + response.sala.num]);
      },
      (error) => {
        console.log('');
      }
    );
  }

  createSala(form) {
    this._lobbyService.createSala(this.token, this.sala).subscribe(
      (response) => {
        console.log(response.sala.num);
        var num = response.sala.num;
        this._router.navigate(['/sala/' + num]);
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  getSalas(ordenar) {
    this._lobbyService.getSalas(this.token, ordenar).subscribe(
      (response) => {
        if (response.allSalas_clean) {
          this.salas = response.allSalas_clean;
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  mouseEnter(sala) {
    this.salaOver = sala;
  }

  mouseLeave(sala) {
    this.salaOver = 0;
  }

  joinSala(sala) {
    this._lobbyService.joinSala(this.token, sala.num).subscribe(
      (response) => {
        this._router.navigate(['/sala/' + response.sala.num]);
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  popup() {
    this.popupp = this.popupp == true ? false : true;
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }
}
