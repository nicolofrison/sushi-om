import User from "../Interfaces/User.interface";


export default class UserUtils {

    public static getUser(): User | null {
        const jsonUser = localStorage.getItem("user");
        if (!jsonUser) {
            return null;
        }

        const user = JSON.parse(jsonUser);
        console.debug(user);
        if (!user.accessToken) {
            this.removeUser();
            return null;
        }

        return user;
    }

    public static getToken(): string | null {
        const user = this.getUser();

        if(!user) {
            return null;
        }

        return user.accessToken;
    }

    public static IsLoggedIn() {
        return this.getUser() != null;
    }

    public static removeUser() {
        localStorage.removeItem("user");
    }

    public static setUser(user: User) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload();
    }
}