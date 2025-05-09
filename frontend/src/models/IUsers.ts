export interface IUsers {
    _id: number;
    userName: string;
    firstName: string;
    lastname: string;
    email: string;
    password: string;
    country: string;
    highscore: number;
    latestScore: number;
    timer: number;
}

export interface IUserData {
    token: string;
    users?: IUsers[];
    error?: boolean;
}