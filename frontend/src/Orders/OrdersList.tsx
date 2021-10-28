import React from 'react';

import {WithTranslation, withTranslation} from "react-i18next";

import { withStyles, createStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import translations from '../Utils/TranslationKeys';
import OrderService from '../services/order.service';
import { TextField } from '@mui/material';
import OrderPost from '../Interfaces/OrderPost.interface';
import User from '../Interfaces/User.interface';
import { OrdersType } from '../Utils/Enums';
import UserUtils from '../Utils/UserUtils';
import AddOrder from './AddOrder';

interface IProps extends WithTranslation {
  OrdersType: OrdersType
}

interface IState {
  orders: any[],
  code: string,
  amount: number
}

class OrdersList extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      orders: [],
      code: "",
      amount: 0
    };
  }

    componentDidMount() {
      this.updateOrders();
    }

    componentDidUpdate(prevProps: IProps) {
      if(this.props.OrdersType != prevProps.OrdersType)
      {
        this.updateOrders();
      }
    }

    updateOrders() {
      const user = UserUtils.getUser();
      if (user == null) {
        window.location.reload();
        return;
      }

      const userId = this.props.OrdersType == OrdersType.user ? user.userId : -1;
      const groupId = this.props.OrdersType == OrdersType.group ? user.groupId : -1;

      OrderService.getOrders(user.accessToken, groupId, userId)
      .then(res => {
        this.setState({orders: res.data as any[]});

        console.log(res.data);
      });
    }

    deleteOrder(orderId: number) {
      const accessToken = UserUtils.getToken();
      if (accessToken == null) {
        window.location.reload();
        return;
      }

      OrderService.deleteOrder(accessToken, orderId)
      .then(res => {
        console.log(res.data);

        this.updateOrders();
      })
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      const target = event.target;
      if (target != null) {
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
  
        this.setState({
          [name]: value
        } as unknown as IState);
      }
    }

    addOrder() {
      const orderPost: OrderPost = {
        code: this.state.code,
        amount: +this.state.amount
      };

      console.log(this.state.amount);

      const user: User | null = UserUtils.getUser();
      if (user == null) {
        window.location.reload();
        return;
      }

      OrderService.addOrder(user.accessToken, orderPost)
      .then(res => {
        console.log(res.data);

        this.setState({code: "", amount: 0});

        this.updateOrders();
      });
    }

    render() {
      const { t } = this.props;
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                      <TableCell />
                    <TableCell align="center">Code</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Round</TableCell>
                    <TableCell align="center">Actions{/*Users*/}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.OrdersType == OrdersType.user ? <AddOrder updateOrders={this.updateOrders.bind(this)} /> : ""}
                    {this.state.orders.map((row) => (
                    <TableRow key={row.code}>
                        <TableCell component="th" scope="row">
                        
                        </TableCell>
                        <TableCell align="center">{row.code}</TableCell>
                        <TableCell align="center">{row.amount}</TableCell>
                        <TableCell align="center">{row.round}</TableCell>
                        <TableCell align="center">
                          {this.props.OrdersType == OrdersType.user ? 
                            <Button size="large" variant="contained" color="error" onClick={() => this.deleteOrder(row.orderId)}>{"Remove"}</Button>
                          : ""}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            );
    }
}

export default withTranslation('')(OrdersList);