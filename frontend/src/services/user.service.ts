import axios from 'axios';

import AuthPost from '../Interfaces/AuthPost.interface';
import BaseService from './base.service';

export class UserService extends BaseService {
    private static instance: UserService;

    public static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    public signUp(authPost: AuthPost) {
        return axios.post(this.baseUrl + "auth/register", authPost);
    }

    public getUser(token: string, userId: number) {
        return axios.get(this.baseUrl + "users/" + userId, this.config(token));
    }

    public updateUserConfirmation(token: string, userId: number, confirmed: boolean) {
        return axios.patch(this.baseUrl + "users/" + userId, {confirmed}, this.config(token));
    }
}

export default UserService.getInstance();