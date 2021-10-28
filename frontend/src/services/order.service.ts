import axios from 'axios';
import OrderPost from '../Interfaces/OrderPost.interface';

const baseUrl = "http://192.168.1.74:5000/";

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
        let query = groupId > -1 ? `groupId=${groupId}` : "";
        query += userId > -1 ? (query.length > 0 ? "&" : "") + `userId=${userId}` : "";
        query = query.length > 0 ? `?${query}` : "";
        return axios.get(baseUrl + "orders" + query, this.config(token));
    }

    public deleteOrder(token: string, orderId: number) {
        return axios.delete(`${baseUrl}orders/${orderId}`, this.config(token));
    }

    public updateOrder(token: string, orderId: number, newAmount: number) {
        return axios.put(`${baseUrl}orders/${orderId}`, {amount: newAmount}, this.config(token));
    }
}

export default OrderService.getInstance();