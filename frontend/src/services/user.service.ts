import axios from 'axios';

import AuthPost from '../Interfaces/AuthPost.interface';
import User from '../Interfaces/User.interface';

const baseUrl = "http://localhost:5000/";

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