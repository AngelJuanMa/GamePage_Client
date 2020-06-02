export class Sala{
	constructor(
    public _id: string,
    public name: string,
    public players: number,
    public game: string,
    public master: string,
    public red_1: string,
    public red_2: string,
    public password: string,
    public num : number,
    public blue_1: string,
    public blue_2: string,
    public redB_1: boolean,
    public redB_2: boolean,
    public blueB_1: boolean,
    public blueB_2: boolean
	){}
}