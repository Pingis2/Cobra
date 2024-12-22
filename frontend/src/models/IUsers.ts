export interface IUsers {
    _id: number;
    userName: string;
    firstName: string;
    lastname: string;
    email: string;
    password: string;
    country: string;
    highscore: number;
}

export interface IUserData {
    users?: IUsers[];
    error?: boolean;
}