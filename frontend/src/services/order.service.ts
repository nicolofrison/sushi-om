import axios from 'axios';
import OrderPost from '../Interfaces/OrderPost.interface';
import BaseService from './base.service';

export class OrderService extends BaseService {
    private static instance: OrderService;

    public static getInstance() {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }

        return OrderService.instance;
    }

    public addOrder(token: string, orderPost: OrderPost) {
        return axios.post(this.baseUrl + "orders", orderPost, this.config(token));
    }

    public getOrders(token: string, groupId: number = -1, userId: number = -1) {
        let query = groupId > -1 ? `groupId=${groupId}` : "";
        query += userId > -1 ? (query.length > 0 ? "&" : "") + `userId=${userId}` : "";
        query = query.length > 0 ? `?${query}` : "";
        return axios.get(this.baseUrl + "orders" + query, this.config(token));
    }

    public deleteOrder(token: string, orderId: number) {
        return axios.delete(`${this.baseUrl}orders/${orderId}`, this.config(token));
    }

    public updateOrderAmount(token: string, orderId: number, amount: number) {
        return axios.patch(`${this.baseUrl}orders/${orderId}`, {amount}, this.config(token));
    }

    public updateOrderChecked(token: string, orderId: number, checked: boolean) {
        return axios.patch(`${this.baseUrl}orders/${orderId}`, {checked}, this.config(token));
    }
}

export default OrderService.getInstance();