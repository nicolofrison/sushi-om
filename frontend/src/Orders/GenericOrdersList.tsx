import React from 'react';

import {withTranslation} from "react-i18next";

import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import translations from '../Utils/TranslationKeys';
import OrderService from '../services/order.service';
import UserService from '../services/user.service';

import { AlertType, OrdersType } from '../Utils/Enums';
import UserUtils from '../Utils/UserUtils';
import AddOrder from './AddOrder';
import EditOrder from './EditOrder';
import { handleError, isNullOrUndefined, ToFirstCapitalLetter } from '../Utils/Utils';
import alertService from '../services/alert.service';
import User from '../Interfaces/User.interface';
import { IOrdersListProps, IOrdersListState, OrdersList } from './OrdersList';

interface IGenericOrdersListProps extends IOrdersListProps {
  OrdersType: OrdersType
}

interface IGenericOrdersListState extends IOrdersListState {
  confirmed: boolean
}

class GenericOrdersList extends OrdersList<IGenericOrdersListProps, IGenericOrdersListState> {

  constructor(props: IGenericOrdersListProps) {
    super(props);

    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.state = {
      orders: [],
      isLoading: false,
      confirmed: user.confirmed
    };
  }

    componentDidMount() {
      super.componentDidMount();
      this.updateConfirmed();
    }

    componentDidUpdate(prevProps: IGenericOrdersListProps) {
      if(this.props.OrdersType !== prevProps.OrdersType)
      {
        this.updateOrders();
        this.updateConfirmed();
      }
    }

    updateOrders() {
      const user = UserUtils.getUser();
      if (user == null) {
        window.location.reload();
        return;
      }

      const userId = this.props.OrdersType === OrdersType.user ? user.userId : -1;
      const groupId = this.props.OrdersType === OrdersType.group ? user.groupId : -1;

      super.updateOrders(userId, groupId);
    }

    updateConfirmed() {
      const user = UserUtils.getUser();
      if (user == null) {
        window.location.reload();
        return;
      }

      UserService.getUser(user.accessToken, user.userId)
      .then(res => {
        console.debug(res.data);
        
        const newUser = res.data as User;
        this.setUserConfirmation(user, newUser.confirmed);
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
        alertService.showAlert(translations.orderRemovedSuccessfully, AlertType.error);

        this.updateOrders();
        this.updateConfirmed();
      });
    }

    confirmOrders() {
      const confirmed = !this.state.confirmed;

      const user = UserUtils.getUser();
      if (user == null) {
        window.location.reload();
        return;
      }

      UserService.updateUserConfirmation(user.accessToken, user.userId, confirmed)
      .then(res => {
        console.debug(res.data);
        
        const newUser = res.data as User;
        this.setUserConfirmation(user, newUser.confirmed);
      })
      .catch(handleError);
    }

    setUserConfirmation(user: User, confirmed: boolean) {
      user.confirmed = confirmed;
      UserUtils.setUser(user);

      this.setState({confirmed: confirmed});
    }

    orderRow(row: any) {
      const { t } = this.props;

      const notConfirmedUsersOrders = this.props.OrdersType === OrdersType.user 
        && isNullOrUndefined(row.round) 
        && !this.state.confirmed;

      return <TableRow key={row.orderId}>
        <TableCell component="th" scope="row" />
        <TableCell align="center">{row.round}</TableCell>
        <TableCell align="center">{row.code}</TableCell>
        <TableCell align="center">
        {notConfirmedUsersOrders
          ? <EditOrder orderId={row.orderId} amount={row.amount} updateOrders={this.updateOrders.bind(this)} />
          : row.amount
        }
        </TableCell>
        <TableCell align="center">
          {notConfirmedUsersOrders
            && <Button size="large" variant="contained" color="error" onClick={() => this.deleteOrder(row.orderId)}>{t(translations.remove)}</Button>
          }
        </TableCell>
      </TableRow>;
    }

    ordersTable() {
      const { t } = this.props;
        return (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                  <TableCell align="center">{ToFirstCapitalLetter(t(translations.round))}</TableCell>
                  <TableCell align="center">{ToFirstCapitalLetter(t(translations.code))}</TableCell>
                  <TableCell align="center">{ToFirstCapitalLetter(t(translations.amount))}</TableCell>
                  <TableCell align="center">{ToFirstCapitalLetter(t(translations.actions))/*Users*/}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.OrdersType === OrdersType.user
                    && <AddOrder updateOrders={this.updateOrders.bind(this)} ordersConfirmed={this.state.confirmed} />
                  }
                  {this.state.isLoading
                    ? <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                    : this.state.orders.map((row) => this.orderRow(row))
                  }
                </TableBody>
              </Table>
            </TableContainer>
            );
    }

    render() {
      const { t } = this.props;
      const bottomBarHeight = this.props.OrdersType === OrdersType.user ? '50px' : 0;
        return (
            <React.Fragment>
              <Paper square sx={{ pb: bottomBarHeight }}>
                {this.ordersTable()}
              </Paper>
              <AppBar sx={{ position: 'fixed', top: 'auto', bottom: 0, left: 0, right: 0, height: bottomBarHeight }} elevation={3}>
                <Toolbar>
                  <Button fullWidth variant="contained" color="primary" onClick={() => this.confirmOrders()}>{t(ToFirstCapitalLetter(translations.confirm))}</Button>
                </Toolbar>
              </AppBar>
            </React.Fragment>
            );
    }
}

export default withTranslation('')(GenericOrdersList);