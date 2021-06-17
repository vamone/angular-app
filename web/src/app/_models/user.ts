export class User {
    id: number;
    username: string;
    password: string;
    token: string;

    constructor() {
        this.id = 1;
        this.username = '';
        this.password = '';
        this.token = '';
    }
}