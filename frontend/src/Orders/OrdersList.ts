import React from 'react';

import { AxiosError } from 'axios';

import {WithTranslation} from "react-i18next";

import OrderService from '../services/order.service';
import UserUtils from '../Utils/UserUtils';
import { handleError } from '../Utils/Utils';

export interface IOrdersListProps extends WithTranslation { }

export interface IOrdersListState {
  orders: any[],
  isLoading: boolean
}

export class OrdersList<P extends IOrdersListProps, S extends IOrdersListState> extends React.Component<P, S> {

  updateOrders(userId: number = -1, groupId: number = -1) {
    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.setState({isLoading: true});
    OrderService.getOrders(user.accessToken, groupId, userId)
    .then(res => {
      const orders = res.data as any[];
      const sortedOrders = orders
        .sort((a: any, b:any) => {
          const roundOrderValue = a.round - b.round;
          return roundOrderValue !== 0 ? roundOrderValue : a.code - b.code;
        });
      console.log(sortedOrders);
      
      this.setState({orders: orders, isLoading: false});
    })
    .catch((error: Error | AxiosError) => {
      handleError(error);

      this.setState({isLoading: false});
    });
  }

  componentDidMount() {
    this.updateOrders();
  }
}