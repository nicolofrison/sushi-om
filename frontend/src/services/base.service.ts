export default class BaseService {
    protected readonly baseUrl = "http://192.168.1.74:5000/";

    protected config(token: string) {
        return {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
    }
}