import React from 'react';

import { withTranslation } from "react-i18next";

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import translations from '../../Utils/TranslationKeys';

import UserUtils from '../../Utils/UserUtils';
import { ToFirstCapitalLetter } from '../../Utils/Utils';
import { IOrdersListProps } from '../OrdersList';
import UserConfirmedOrdersRow from './UserConfirmedOrdersRow';

interface IGenericOrdersListProps extends IOrdersListProps {
  isLoading: boolean,
  orders: any[],
  setIsLoading: (isLoading: boolean) => void,
  updateOrders: () => void
}

interface IGenericOrdersListState { }

class UserConfirmedOrdersList extends React.Component<IGenericOrdersListProps, IGenericOrdersListState> {

  constructor(props: IGenericOrdersListProps) {
    super(props);

    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.state = { };
  }

  render() {
    const { t } = this.props;

    let ordersRows = <TableRow>
      <TableCell colSpan={4} align="center">{ToFirstCapitalLetter(t(translations.ordersEmpty))}</TableCell>
    </TableRow>;
    if (this.props.orders.length > 0) {
      ordersRows = <React.Fragment>
        {this.props.orders.map((row) => <UserConfirmedOrdersRow orderRow={row} setIsLoading={this.props.setIsLoading} updateOrders={this.props.updateOrders} />)}
      </React.Fragment>
    }


    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" width="10%">{ToFirstCapitalLetter(t(translations.checked))}</TableCell>
              <TableCell align="center" width="10%">{ToFirstCapitalLetter(t(translations.round))}</TableCell>
              <TableCell align="center">{ToFirstCapitalLetter(t(translations.code))}</TableCell>
              <TableCell align="center">{ToFirstCapitalLetter(t(translations.amount))}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.isLoading
              ? <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
              : ordersRows
            }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withTranslation('')(UserConfirmedOrdersList);