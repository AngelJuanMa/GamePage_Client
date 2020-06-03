import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../models/message';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { FollowService } from '../../services/follow.service';

import { User } from 'src/app/models/user';
import { FollowRequest } from 'src/app/models/followRequest';

import io from 'socket.io-client';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['message.style.css'],
  providers: [UserService, MessageService, FollowService],
})
export class MessageComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public friend;
  public user: User;
  public message: Message;
  public followReq: FollowRequest;
  public id;
  public req;
  public warning;
  public bucleM: boolean;
  public error;
  @Input('popupUser') popupUser = false;
  @Input('popupMessage') popupMessage = false;
  @Input('popupPride') popupPride = false;
  public userReq: User;
  @ViewChild('userRequest') userRequest;
  @ViewChild('friends') friends;
  @ViewChild('doMessages') doMessages;
  private socket: any;
  @ViewChild('chatbox') chatbox;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _messageService: MessageService,
    private _followService: FollowService
  ) {
    this.socket = io('http://localhost:3003');

    this.title = 'Mensajes';
    this.bucleM = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.message = new Message('', '', '', '', '', false, false);
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
    this.followReq = new FollowRequest('', '', '');
  }
  ngOnInit() {
    if (this.identity) {
      this.friendsSocket();
      this.getFollows();
      this.getFollowsReq();
      this.usersLevel(this.identity);
    }
  }

  public userWriting = false;
  public writing = false;
  public followsReq = [];
  public lastReq;
  public reduce;
  friendsSocket() {
    this.socket.emit('user', this.identity._id);
    this.socket.on('request', (user) => {
      this.lastReq = user;
      let userReq = { user };
      this.followsReq.push(userReq);
    });
    this.socket.on('accepted', (data) => {
      this.getFollows();
    });
    this.socket.on('friendOut', (data) => {
      this.getFollows();
    });
    this.socket.on('friendWriting', (user) => {
      if (user && this.friend && this.friend._id == user)
        this.userWriting = true;
    });
    this.socket.on('stopWriting', (user) => {
      if (user && this.friend && this.friend._id == user)
        this.userWriting = false;
    });
    this.socket.on('newMessage', (message, emitter, created_at) => {
      if (this.openMessageBox && this.friend._id == emitter._id) {
        let newMessage = {
          text: message.text,
          viewed: 'false',
          emitter,
          created_at: created_at,
        };
        this.messagesArr.push(newMessage);
        this.setViewedMessages(this.friend);
        setTimeout(() => {
          if (
            this.chatbox.nativeElement.scrollTop >
            this.chatbox.nativeElement.scrollHeight - this.reduce
          ) {
            this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
          }
        }, 100);
      }
    });
    this.socket.on('friendViewedMessages', (user) => {
      if (this.openMessageBox && this.friend && this.friend._id == user._id)
        this.reciveMessages();
    });
  }
  emitWriting(e) {
    if (e.key === 'Enter') return;
    if (this.message.text.length != 0 && this.writing === false) {
      this.socket.emit('writing', this.identity._id, this.friend);
      this.writing = true;
    } else if (this.message.text.length != 0) {
      this.writing = true;
    } else {
      this.writing = false;
      this.socket.emit('noWriting', this.identity._id, this.friend);
    }
  }

  onSubmit(form) {
    this.message.receiver = this.friend;
    this._messageService.sendMessage(this.token, this.message).subscribe(
      (response) => {
        let newMessage = {
          text: this.message.text,
          viewed: 'false',
          emitter: this.identity,
          created_at: response.message.created_at,
        };
        this.messagesArr.push(newMessage);
        this.socket.emit('message', this.message, this.identity);
        this.socket.emit('noWriting', this.identity._id, this.friend);
        this.message.text = null;
        this.writing = false;

        setTimeout(() => {
          this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
        }, 100);
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }
  public messagesArr = [];
  userMessages(user) {
    this.friend = user;
    this.reciveMessages();
    this.friendMessages('block', 'none');
  }

  reciveMessages() {
    this._messageService.userMessages(this.token, this.friend._id).subscribe(
      (response) => {
        this.messagesArr = response.messages;
        setTimeout(() => {
          this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
          this.reduce =
            this.chatbox.nativeElement.scrollHeight -
            this.chatbox.nativeElement.scrollTop +
            100;
        }, 100);
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  public friendColor;
  public openMessageBox: boolean;
  friendMessages(messages, friends) {
    this.doMessages.nativeElement.style.display = messages;
    this.friends.nativeElement.style.display = friends;
    this.friendLevel(this.friend);

    if (messages == 'block' && friends == 'none') {
      this.setViewedMessages(this.friend);
      this.openMessageBox = true;
    } else if (
      messages == 'none' &&
      friends == 'block' &&
      this.writing == true
    ) {
      this.socket.emit('noWriting', this.identity._id, this.friend);
      this.writing = false;
      this.openMessageBox = false;
    } else if (messages == 'none' && friends == 'block')
      this.openMessageBox = false;
  }

  setViewedMessages(emitter) {
    this._messageService.setViewedMessages(this.token, emitter).subscribe(
      (response) => {
        this.socket.emit('messagesViewed', this.identity, emitter);
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  public friendSuccess: boolean;
  onFollow(form) {
    this._followService.follow(this.token, this.followReq).subscribe(
      (response) => {
        this.error = null;
        this.friendSuccess = true;
        this.socket.emit('onFollow', response);
      },
      (error) => {
        this.friendSuccess = false;
        this.error = error.error.message;
        console.log(<any>error);
      }
    );
  }

  resetForm() {
    this.error = null;
    this.friendSuccess = false;
  }

  getFollowsReq() {
    this._followService.getfollowedRequest(this.token).subscribe(
      (response) => {
        this.followsReq = response.follows;
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  public friendsUsers;
  getFollows() {
    this._followService.getFollows(this.token).subscribe(
      (response) => {
        this.friendsUsers = response.friends;
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  userSelected(e) {
    this.userReq = e;
  }

  doFollowReq(e) {
    this._followService.doFollowReq(this.token, this.userReq, e).subscribe(
      (response) => {
        this.socket.emit('accepted', this.userReq);
        this.userRequest.nativeElement.style.display = 'none';
        this.getFollows();
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  public userToRecive;
  public userToDelete_id;
  public userToDelete_nick;
  doDeleteFriend(userToDelete) {
    if (userToDelete.user._id) this.userToRecive = userToDelete.user._id;
    else if (userToDelete.followed._id)
      this.userToRecive = userToDelete.followed._id;
    this.userToDelete_id = userToDelete._id;
    if (userToDelete.followed.nick)
      this.userToDelete_nick = userToDelete.followed.nick;
    else if (userToDelete.user.nick)
      this.userToDelete_nick = userToDelete.user.nick;
  }

  deleteFriend() {
    this._followService
      .deleteFollow(this.token, this.userToDelete_id)
      .subscribe(
        (response) => {
          this.getFollows();
          this.socket.emit('deleted', this.userToRecive);
          this.userToDelete_nick = null;
          this.userToDelete_id = null;
        },
        (error) => {
          console.log(<any>error);
        }
      );
  }

  dontDeleteFriend() {
    this.userToDelete_nick = null;
    this.userToDelete_id = null;
  }

  public level;
  usersLevel(user) {
    if (user.wins != null) {
      if (user.wins < 4) this.level = 1;
      else if (user.wins < 11) this.level = 2;
      else if (user.wins < 23) this.level = 3;
      else if (user.wins < 40) this.level = 4;
      else if (user.wins < 61) this.level = 5;
      else if (user.wins >= 61) this.level = 6;
    } else {
      this.level = 4;
    }
  }
  public friendsLevel;
  friendLevel(user) {
    if (user.wins != null) {
      if (user.wins < 4) this.friendsLevel = 1;
      else if (user.wins < 11) this.friendsLevel = 2;
      else if (user.wins < 23) this.friendsLevel = 3;
      else if (user.wins < 40) this.friendsLevel = 4;
      else if (user.wins < 61) this.friendsLevel = 5;
      else if (user.wins >= 61) this.friendsLevel = 6;
    } else {
      this.friendsLevel = 4;
    }
  }
}
