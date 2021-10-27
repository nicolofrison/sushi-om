import axios from 'axios';
import OrderPost from '../Interfaces/OrderPost.interface';

const baseUrl = "http://localhost:5000/";

export class OrderService {
    private static instance: OrderService;

    public static getInstance() {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }

        return OrderService.instance;
    }

    private config(token: string) {
        return {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
    }

    public addOrder(token: string, orderPost: OrderPost) {
        return axios.post(baseUrl + "orders", orderPost, this.config(token));
    }

    public getOrders(token: string, groupId: number = -1, userId: number = -1) {
        return axios.get(baseUrl + "orders", this.config(token));
    }
}

export default OrderService.getInstance();