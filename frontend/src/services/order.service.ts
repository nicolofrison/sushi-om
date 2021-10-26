import axios from 'axios';

const baseUrl = "http://localhost:5000/";

export class OrderService {
    private static instance: OrderService;

    public static getInstance() {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }

        return OrderService.instance;
    }

    public getOrders(token: string, groupId: number = -1, userId: number = -1) {
        return axios.get(baseUrl + "orders", {
            headers: {
                'Authorization': token
            }
        });
    }
}

export default OrderService.getInstance();