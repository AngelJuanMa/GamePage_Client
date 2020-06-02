import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { trigger ,state ,style ,animate ,transition, keyframes} from '@angular/animations';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['register.style.css'],
	providers: [UserService],
	animations: [
		trigger('anyBoton',[
			state('inactive', style({
				transform: 'scale(1)'
			})),
			state('active', style({
				backgroundColor: '#1b752f',
				transform: 'scale(1.1)',
			})),
			transition('inactive => active', [
				animate(500, keyframes ([
					style({transform: 'scale(1.03)' ,backgroundColor: '#22903b', offset:0.4}),
					style({transform: 'scale(1.06)' ,backgroundColor: '#208436', offset:0.8}),
					style({transform: 'scale(1.1)', backgroundColor: '#1b752f', offset:1}),
				]))
			]),
			transition('active => inactive', animate('100ms ease-out'))
		])
	]
})

export class RegisterComponent implements OnInit{
	public title:string;
	public user: User;
	public status: string;
	public identity;
	public token;
	public message;
	public state:string;
	public codigo;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.title = 'Registrate';
		this.state = "inactive";
		this.user = new User("",
		"", 
		"",
		"",
		"",
		"",
		"",
    	false,
    	0,
		0,
		"",
		"",
		"",
		"",
		360
		);
		this.identity = this._userService.getIdentity();
	}

  	ngOnInit(){
	if(this.identity) this._router.navigate(['/lobby']);
	}
	
	public stepTwo = false
	verifyEmail(form){
		
		this._userService.confirmEmail(this.user).subscribe(
			response => {
				if(response.gmail) this.stepTwo = true
			},
			error => {
				console.log(error);
				this.message = error.error.message;
				if(this.message == "Ya has enviado un email"){
					this.stepTwo = true;
					this.message = null
				} 
				console.log(<any>error);
			}
		)
	}

	onSubmit(){
		this._userService.register(this.user).subscribe(
			response => {
				if(response.user && response.user._id){
					this.status = 'success';
					this.login();
				}else{
					this.status = 'error';
				}
			},
			error => {
				this.message = error.error.message;
				console.log(<any>error);
			}
		);
	}


	login(){
		// loguear al usuario y conseguir sus datos
		this._userService.signup(this.user).subscribe(
			response => {
				this.identity = response.user;


				if(!this.identity || !this.identity._id){
					this.status = 'error2';
				}else{
					// PERSISTIR DATOS DEL USUARIO
					localStorage.setItem('identity', JSON.stringify(this.identity));

					// Conseguir el token
					this.getToken();
				}

			},
			error => {
				this.message = error.error.message;
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error2';
				}
			}
		);
	}


	getToken(){
		this._userService.signup(this.user, 'true').subscribe(
			response => {
				this.token = response.token;


				if(this.token.length <= 0){
					this.status = 'error2';
				}else{

					// PERSISTIR TOKEN DEL USUARIO
					localStorage.setItem('token',this.token);
		  			
					location.reload();
					this._router.navigate(['/lobby']);
				}

			},
			error => {
				this.message = error.error.message;
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error2';
				}
			}
		);
	}

	togleBoton(){
		this.state = this.state === 'active' ? 'inactive' : 'active';
	}

}

// animations: [
// 	trigger('anyBoton',[
// 		state('inactive', style({
// 			backgroundColor: '#eee',
// 			transform: 'scale(1)'
// 		})),
// 		state('active', style({
// 			backgroundColor: 'red',
// 			transform: 'scale(1.5)'
// 		})),
// 		transition('inactive => active', animate('100ms ease-in')),
// 		transition('active => inactive', animate('100ms ease-out'))
// 	])
// ]
