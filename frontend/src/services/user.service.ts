import axios from 'axios';

import AuthPost from '../Interfaces/AuthPost.interface';

const baseUrl = "http://192.168.1.74:5000/";

export class UserService {
    private static instance: UserService;

    public static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    public signUp(authPost: AuthPost) {
        return axios.post(baseUrl + "auth/register", authPost);
    }
}

export default UserService.getInstance();