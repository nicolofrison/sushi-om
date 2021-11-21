import React from 'react';

import { withTranslation } from "react-i18next";

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import translations from '../../Utils/TranslationKeys';
import UserService from '../../services/user.service';

import UserUtils from '../../Utils/UserUtils';
import AddOrder from './AddOrder';
import { handleError, ToFirstCapitalLetter } from '../../Utils/Utils';
import { IOrdersListProps } from '../OrdersList';
import CartOrdersRow from './CartOrdersRow';

interface IGenericOrdersListProps extends IOrdersListProps {
  isLoading: boolean,
  orders: any[],
  setIsLoading: (isLoading: boolean) => void,
  updateOrders: () => void
}

interface IGenericOrdersListState {
  confirmed: boolean
}

class CartOrdersList extends React.Component<IGenericOrdersListProps, IGenericOrdersListState> {

  constructor(props: IGenericOrdersListProps) {
    super(props);

    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.state = {
      confirmed: user.confirmed
    };
  }

  updateUserConfirmation() {
    const confirmed = !this.state.confirmed;

    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    UserService.updateUserConfirmation(user.accessToken, user.userId, confirmed)
      .then(res => {
        console.debug(res.data);

        this.props.updateOrders();
      })
      .catch(handleError);
  }

  render() {
    const { t } = this.props;
    const bottomBarHeight = '50px';

    let ordersRows = <TableRow>
      <TableCell colSpan={3} align="center">{ToFirstCapitalLetter(t(translations.ordersEmpty))}</TableCell>
    </TableRow>;
    if (this.props.orders.length > 0) {
      ordersRows = <React.Fragment>
        {this.props.orders.map((row) => <CartOrdersRow confirmed={this.state.confirmed} orderRow={row} updateOrders={this.props.updateOrders} />)}
      </React.Fragment>
    }

    return (
      <Paper square sx={{ pb: bottomBarHeight }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">{ToFirstCapitalLetter(t(translations.code))}</TableCell>
                <TableCell align="center">{ToFirstCapitalLetter(t(translations.amount))}</TableCell>
                <TableCell align="center">{ToFirstCapitalLetter(t(translations.actions))/*Users*/}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AddOrder updateOrders={this.props.updateOrders} ordersConfirmed={this.state.confirmed} />
              {this.props.isLoading
                ? <TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>
                : ordersRows
              }
            </TableBody>
          </Table>
        </TableContainer>
        {this.state.confirmed
          ? <Button fullWidth variant="contained" color="error" onClick={() => this.updateUserConfirmation()}>{ToFirstCapitalLetter(t(translations.undoConfirm))}</Button>
          : <Button fullWidth variant="contained" color="success" onClick={() => this.updateUserConfirmation()}>{ToFirstCapitalLetter(t(translations.confirm))}</Button>
        }
      </Paper>
    );
  }
}

export default withTranslation('')(CartOrdersList);