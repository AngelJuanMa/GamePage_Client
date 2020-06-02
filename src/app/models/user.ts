export class User{
	constructor(
		public _id: string,
		public name: string,
		public nick: string,
		public description: string,
		public created_at:string,
		public email: string,
		public password: string,
		public politics: boolean,
		public wins: number,
		public lose: number,
		public code: string,
		public color: string,
		public color2: string,
		public color3: string,
		public deg: number,
	){}
}
