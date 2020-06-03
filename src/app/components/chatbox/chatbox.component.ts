import { Component, OnInit, ViewChild, ContentChildren } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Sala } from '../../models/sala';
import { MessageGeneral } from '../../models/messageGeneral';
import { UserService } from '../../services/user.service';
import { async } from '@angular/core/testing';
import { GLOBAL } from '../../services/global';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import io from 'socket.io-client';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['../lobby/lobby.style.css'],
  providers: [UserService, MessageService],
})
export class ChatboxComponent implements OnInit {
  public salas: Sala[];
  public url: string;
  public sala: Sala;
  public identity;
  public token;
  public message: MessageGeneral;
  public pride: boolean;
  public erorr;
  private userIo: any;
  private messageIo: any;
  @ViewChild('todos') todos;
  @ViewChild('clan') clan;
  @ViewChild('chatboxTodos') chatboxTodos;
  @ViewChild('chatboxPride') chatboxPride;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _messageService: MessageService
  ) {
    this.userIo = io('http://localhost:3000');
    this.messageIo = io('http://localhost:3001');
    this.pride = false;
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.sala = new Sala(
      '',
      '',
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
    this.message = new MessageGeneral('', this.identity.nick, '');
    this.erorr = false;
  }

  ngOnInit() {
    !this.identity && this._router.navigate(['/login']);
    this.userSocket();
    this.messageSocket();
    this.getUsersConnecteds();
  }

  userSocket() {
    this.userIo.emit('user', this.identity);

    this.userIo.on('userConnected', (userC) => {
      var calc = this.usersArr.length;

      for (var f = 0; f < calc; f++) {
        if (userC.nick != this.usersArr[f].userId.nick) {
          this.usersArr.push(userC);
        }
      }
    });
    this.userIo.on('userDisconnected', (userD) => {
      var i = 0;

      for (const iterator of this.usersArr) {
        if (userD == this.usersArr[i].userId.nick) {
          this.usersArr[i].userId.nick = null;
        }

        i++;
      }
    });

    this.userIo.on('error', (error) => {
      console.error(error);
    });
  }

  public messagesTodosGeneral = [];
  public messagesPrideGeneral = [];
  messageSocket() {
    this.messageIo.emit('user', this.identity._id);
    this.messageIo.on('error', (error) => {
      console.error(error);
    });
    this.messageIo.on('chatbox todos:input', (messageTodos) => {
      this.messagesTodosGeneral.push(messageTodos);

      setTimeout(() => {
        if (
          this.chatboxTodos.nativeElement.scrollTop >=
          this.chatboxTodos.nativeElement.scrollHeight - 190
        )
          this.chatboxTodos.nativeElement.scrollTop = this.chatboxTodos.nativeElement.scrollHeight;
      }, 100);
    });

    this.messageIo.on('chatbox pride:input', (messagePride) => {
      this.messagesPrideGeneral.push(messagePride);

      setTimeout(() => {
        if (
          this.chatboxPride.nativeElement.scrollTop >=
          this.chatboxPride.nativeElement.scrollHeight - 190
        )
          this.chatboxPride.nativeElement.scrollTop = this.chatboxPride.nativeElement.scrollHeight;
      }, 100);
    });
  }

  public usersArr = [];
  getUsersConnecteds() {
    this._userService.getUsers(this.token).subscribe(
      (response) => {
        this.usersArr = response.users;
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  sendMessage(form) {
    if (this.message.text) {
      if (!this.pride) {
        this.messageIo.emit('chatbox todos:send', this.message);
        setTimeout(() => {
          this.chatboxTodos.nativeElement.scrollTop = this.chatboxTodos.nativeElement.scrollHeight;
          this.message.text = null;
        }, 100);
      } else {
        this.messageIo.emit(
          'chatbox pride:send',
          this.message,
          this.identity.pride
        );
        setTimeout(() => {
          this.chatboxPride.nativeElement.scrollTop = this.chatboxPride.nativeElement.scrollHeight;
          this.message.text = null;
        }, 100);
      }
    }
  }

  toPride(bool) {
    this.pride = bool;
    if (bool) {
      this.clan.nativeElement.style.background = 'rgb(132, 130, 130)';
      this.clan.nativeElement.style.color = 'black';
      this.todos.nativeElement.style.background = '#1d1e1a';
      this.todos.nativeElement.style.color = 'white';
      setTimeout(() => {
        this.chatboxPride.nativeElement.scrollTop = this.chatboxPride.nativeElement.scrollHeight;
      }, 100);
    } else {
      this.clan.nativeElement.style.background = '#1d1e1a';
      this.clan.nativeElement.style.color = 'white';
      this.todos.nativeElement.style.background = 'rgb(132, 130, 130)';
      this.todos.nativeElement.style.color = 'black';
      setTimeout(() => {
        this.chatboxTodos.nativeElement.scrollTop = this.chatboxTodos.nativeElement.scrollHeight;
      }, 100);
    }
  }

  todosHover(bool) {
    if (bool && !this.pride)
      this.todos.nativeElement.style.background = 'rgb(150, 148, 148)';
    else if (bool)
      this.todos.nativeElement.style.background = 'rgb(61, 62, 60)';
    else if (!bool && !this.pride)
      this.todos.nativeElement.style.background = 'rgb(132, 130, 130)';
    else if (!bool && this.pride)
      this.todos.nativeElement.style.background = '#1d1e1a';
  }

  clanHover(bool) {
    if (bool && this.pride)
      this.clan.nativeElement.style.background = 'rgb(150, 148, 148)';
    else if (bool) this.clan.nativeElement.style.background = 'rgb(61, 62, 60)';
    else if (!bool && this.pride)
      this.clan.nativeElement.style.background = 'rgb(132, 130, 130)';
    else if (!bool && !this.pride)
      this.clan.nativeElement.style.background = '#1d1e1a';
  }
}
