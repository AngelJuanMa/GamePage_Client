"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LobbyComponent = void 0;
var core_1 = require("@angular/core");
var sala_1 = require("../../models/sala");
var user_service_1 = require("../../services/user.service");
var lobby_service_1 = require("../../services/lobby.service");
var sala_service_1 = require("../../services/sala.service");
var global_1 = require("../../services/global");
var message_service_1 = require("../../services/message.service");
var message_1 = require("../../models/message");
var LobbyComponent = /** @class */ (function () {
    function LobbyComponent(_route, _router, _userService, _lobbyService, _messageService, _salaService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this._lobbyService = _lobbyService;
        this._messageService = _messageService;
        this._salaService = _salaService;
        this.pride = false;
        this.title = 'Lobby';
        this.url = global_1.GLOBAL.url;
        this.popupp = false;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.page = 1;
        this.salaOver = false;
        this.status = false;
        this.title = 'Registrate';
        this.sala = new sala_1.Sala('', '¡Ven y unete!!', null, 'Tres en línea', '', '', '', '', null, '', '', false, false, false, false);
        this.message = new message_1.Message('', '', '', '', '', false, false);
    }
    LobbyComponent.prototype.ngOnInit = function () {
        if (this.identity) {
            this.getSalas('num');
            this.findUserInSala();
        }
        else
            this._router.navigate(['/login']);
    };
    LobbyComponent.prototype.findUserInSala = function () {
        var _this = this;
        this._salaService.findUserInSala(this.token).subscribe(function (response) {
            if (response.sala)
                _this._router.navigate(['/sala/' + response.sala.num]);
        }, function (error) {
            console.log('');
        });
    };
    LobbyComponent.prototype.createSala = function (form) {
        var _this = this;
        this._lobbyService.createSala(this.token, this.sala).subscribe(function (response) {
            console.log(response.sala.num);
            var num = response.sala.num;
            _this._router.navigate(['/sala/' + num]);
        }, function (error) {
            console.log(error);
        });
    };
    LobbyComponent.prototype.getSalas = function (ordenar) {
        var _this = this;
        this._lobbyService.getSalas(this.token, ordenar).subscribe(function (response) {
            if (response.allSalas_clean) {
                _this.salas = response.allSalas_clean;
            }
        }, function (error) {
            console.log(error);
        });
    };
    LobbyComponent.prototype.mouseEnter = function (sala) {
        this.salaOver = sala;
    };
    LobbyComponent.prototype.mouseLeave = function (sala) {
        this.salaOver = 0;
    };
    LobbyComponent.prototype.joinSala = function (sala) {
        var _this = this;
        this._lobbyService.joinSala(this.token, sala.num).subscribe(function (response) {
            _this._router.navigate(['/sala/' + response.sala.num]);
        }, function (error) {
            console.log(error);
        });
    };
    LobbyComponent.prototype.popup = function () {
        this.popupp = this.popupp == true ? false : true;
    };
    LobbyComponent.prototype.ngDoCheck = function () {
        this.identity = this._userService.getIdentity();
    };
    __decorate([
        core_1.ViewChild('clan')
    ], LobbyComponent.prototype, "clan");
    __decorate([
        core_1.ViewChild('todos')
    ], LobbyComponent.prototype, "todos");
    LobbyComponent = __decorate([
        core_1.Component({
            selector: 'lobby',
            templateUrl: './lobby.component.html',
            styleUrls: ['lobby.style.css'],
            providers: [user_service_1.UserService, lobby_service_1.LobbyService, message_service_1.MessageService, sala_service_1.SalaService]
        })
    ], LobbyComponent);
    return LobbyComponent;
}());
exports.LobbyComponent = LobbyComponent;
