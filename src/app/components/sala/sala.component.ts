import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { SalaService } from '../../services/sala.service';

@Component({
	selector: 'sala',
	templateUrl: './sala.component.html',
	styleUrls: ['sala.style.css'],
	providers: [UserService, SalaService]
}) 

export class SalaComponent implements OnInit{
	public title:string;
    public message;
    public num;
    public identity;
	public token;
	@ViewChild("red1") red1;
	@ViewChild("red2") red2;
	@ViewChild("blue1") blue1;
	@ViewChild("blue2") blue2;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
        private _userService: UserService,
        private _salaService: SalaService
	){
        this.title = 'Sala';
        this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		
	}
	
    ngOnInit(){
        this._route.params.subscribe(params => {
            this.num = params['num'];
			this.getSala(this.num);
		});
    }

	ngAfterViewInit() {
			this.chageColors();
	  }

	public sala;
    getSala(num){
        this._salaService.getSala(this.token, num).subscribe(
			response => {
				if(!response.sala) this._router.navigate(['/lobby']);
				this.sala = response.sala;
				
				if(this.sala.red_1) this.usersLevels(this.sala.red_1);
				if(this.sala.red_2) this.usersLevels(this.sala.red_2);
				if(this.sala.blue_1) this.usersLevels(this.sala.blue_1);
				if(this.sala.blue_2) this.usersLevels(this.sala.blue_2);

				
				
			},
			error => {
			var errorMessage = <any>error;
			console.error(errorMessage);
			}
		);
	}

	chageColors(){
		if(this.sala.red_1) this.red1.nativeElement.style.color = this.sala.red_1.color;
		if(this.sala.red_2) this.red2.nativeElement.style.color = this.sala.red_2.color;
		if(this.sala.blue_1) this.blue1.nativeElement.style.color = this.sala.blue_1.color;
		if(this.sala.blue_2) this.blue2.nativeElement.style.color = this.sala.blue_2.color;
	}
	
	public ranking = new Array();
	usersLevels(user){
		
		if(user != null){
			if(user.wins < 4 ) this.ranking.push(4);
			else if(user.wins < 11) this.ranking.push(6);
			else if(user.wins < 23) this.ranking.push(12);
			else if(user.wins < 40) this.ranking.push(17);
			else if(user.wins < 61) this.ranking.push(21);
			else if(user.wins >= 61) this.ranking.push(27);	
		}else{
		this.ranking.push[4];
		}
	}
}
