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
      this.setState({orders: res.data as any[], isLoading: false});

      console.log(res.data);
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