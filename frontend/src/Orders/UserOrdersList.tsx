import React from 'react';

import {withTranslation} from "react-i18next";

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';

import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

import translations from '../Utils/TranslationKeys';
import OrderService from '../services/order.service';
import UserService from '../services/user.service';

import { AlertType } from '../Utils/Enums';
import UserUtils from '../Utils/UserUtils';
import AddOrder from './AddOrder';
import EditOrder from './EditOrder';
import { handleError, isNullOrUndefined, ToFirstCapitalLetter } from '../Utils/Utils';
import alertService from '../services/alert.service';
import User from '../Interfaces/User.interface';
import { IOrdersListProps, IOrdersListState, OrdersList } from './OrdersList';
import { AxiosError } from 'axios';

interface IGenericOrdersListProps extends IOrdersListProps { }

interface IGenericOrdersListState extends IOrdersListState {
  confirmed: boolean
}

class UserOrdersList extends OrdersList<IGenericOrdersListProps, IGenericOrdersListState> {

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
      this.updateOrders();
      this.updateConfirmed();
    }

    updateOrders() {
      const user = UserUtils.getUser();
      if (user == null) {
        window.location.reload();
        return;
      }

      super.updateOrders(user.userId);
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
        console.debug(res.data);
        alertService.showAlert(translations.orderRemovedSuccessfully, AlertType.success);

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

    handleCheckChange(event: React.ChangeEvent<HTMLInputElement>) {
      const target = event.target;
      if (target != null) {
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        const orderId = +(name.split("-")[1]);
        const accessToken = UserUtils.getToken();
        if (accessToken == null) {
          window.location.reload();
          return;
        }
        
        this.setState({isLoading: true});
        OrderService.updateOrderChecked(accessToken, orderId, value as boolean)
        .then(res => {
          console.debug(res.data);
          alertService.showAlert(translations.orderCheckedSuccessfully, AlertType.success);
  
          this.updateOrders();
          this.updateConfirmed();
        })
        .catch((error: Error | AxiosError) => {
          handleError(error);
    
          this.setState({isLoading: false});
        });
      }
    }

    orderRow(row: any) {
      const { t } = this.props;

      const notConfirmedUsersOrders = isNullOrUndefined(row.round) 
        && !this.state.confirmed;

      return <TableRow key={row.orderId}>
        <TableCell>{row.round && <Checkbox name={"check-" + row.orderId} checked={row.checked} onChange={this.handleCheckChange.bind(this)} />}</TableCell>
        <TableCell align="center" component="th" scope="row">{row.round}</TableCell>
        <TableCell align="center">{row.code}</TableCell>
        <TableCell align="center">
        {notConfirmedUsersOrders
          ? <EditOrder orderId={row.orderId} amount={row.amount} updateOrders={this.updateOrders.bind(this)} />
          : row.amount
        }
        </TableCell>
        <TableCell align="center">
          {notConfirmedUsersOrders
            && <IconButton aria-label={t(translations.remove)} size="large" onClick={() => this.deleteOrder(row.orderId)}>
            <IndeterminateCheckBoxIcon fontSize="inherit" color="error" />
          </IconButton>
          }
        </TableCell>
      </TableRow>;
    }

    ordersTable() {
      const { t } = this.props;

      let ordersRows =  <TableRow>
        <TableCell colSpan={5} align="center">{ToFirstCapitalLetter(t(translations.ordersEmpty))}</TableCell>
      </TableRow>;
      if (this.state.orders.length > 0) {
        ordersRows = <React.Fragment>
          {this.state.orders.map((row) => this.orderRow(row))}
        </React.Fragment>
      }

        
      return (
        <TableContainer component={Paper}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="10%" sx={{ paddingX: "8px" }}>{ToFirstCapitalLetter(t(translations.checked))}</TableCell>
                <TableCell align="center" width="10%" sx={{ paddingX: "8px" }}>{ToFirstCapitalLetter(t(translations.round))}</TableCell>
                <TableCell align="center" width="10%" sx={{ paddingX: "8px" }}>{ToFirstCapitalLetter(t(translations.code))}</TableCell>
                <TableCell align="center" sx={{ paddingX: "8px" }}>{ToFirstCapitalLetter(t(translations.amount))}</TableCell>
                <TableCell align="center" sx={{ paddingX: "8px" }}>{ToFirstCapitalLetter(t(translations.actions))/*Users*/}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AddOrder updateOrders={this.updateOrders.bind(this)} ordersConfirmed={this.state.confirmed} />
              {this.state.isLoading
                ? <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                : ordersRows
              }
            </TableBody>
          </Table>
        </TableContainer>
        );
    }

    render() {
      const { t } = this.props;
      const bottomBarHeight = '50px';
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

export default withTranslation('')(UserOrdersList);