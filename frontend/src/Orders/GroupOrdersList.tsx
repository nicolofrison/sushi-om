import React from 'react';

import {withTranslation} from "react-i18next";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import translations from '../Utils/TranslationKeys';
import OrderService from '../services/order.service';

import { OrdersType } from '../Utils/Enums';
import UserUtils from '../Utils/UserUtils';
import { handleError, ToFirstCapitalLetter } from '../Utils/Utils';
import { AxiosError } from 'axios';
import { IOrdersListProps, IOrdersListState, OrdersList } from './OrdersList';

interface IGroupOrdersListProps extends IOrdersListProps {
  OrdersType: OrdersType
}

interface IGroupOrdersListState extends IOrdersListState {
    expandedUser: string
}

class UserOrdersList extends OrdersList<IGroupOrdersListProps, IGroupOrdersListState> {

  constructor(props: IGroupOrdersListProps) {
    super(props);

    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.state = {
      orders: [],
      isLoading: false,
      expandedUser: ""
    };
  }

  componentDidMount() {
    this.updateOrders();
  }

  componentDidUpdate(prevProps: IGroupOrdersListProps) {
    if(this.props.OrdersType !== prevProps.OrdersType)
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

    this.setState({isLoading: true});
    const userId = this.props.OrdersType === OrdersType.user ? user.userId : -1;
    const groupId = this.props.OrdersType === OrdersType.group ? user.groupId : -1;

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

  usersList() {
    if (this.state.orders.length === 0) {
      return;
    }

    const usersList: any[] = [];
    this.state.orders.forEach(o => {
      const key = o.username ?? o.name + " " + o.surname;
      usersList[key] = [...usersList[key] || [], o];
    });

    return Object.entries(usersList).map((userRow: any) => this.userRow(userRow));
  }

  handleSelectedUserRowChange = (username: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    this.setState({expandedUser: newExpanded ? username : ""});
  }

  userRow(userRow: any) {
    // the username or the combination of user's firstName and lastName
    const username: string = userRow[0];
    const userOrders = userRow[1];

    return <Accordion expanded={this.state.expandedUser === username} onChange={this.handleSelectedUserRowChange(username)}>
      <AccordionSummary aria-controls={username.replaceAll(" ", "_") + "-content"} id={username.replaceAll(" ", "_") + "-header"}>
        <Grid container spacing={2}>
          <Grid item xs={2}>true</Grid>
          <Grid item xs={10} textAlign="left">
            {username}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {this.userOrders(userOrders)}
      </AccordionDetails>
    </Accordion>;
  }

  userOrders(userOrders: any[]) {
    const { t } = this.props;

    return <TableContainer component={Paper}>
        <Table aria-label="simple table">
        <TableHead>
            <TableRow>
              <TableCell />
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.round))}</TableCell>
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.code))}</TableCell>
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.amount))}</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {userOrders.map((userOrder: any) => this.orderRow(userOrder))}
        </TableBody>
        </Table>
    </TableContainer>
  }

  orderRow(row: any) {
    return <TableRow key={row.orderId}>
      <TableCell component="th" scope="row" />
      <TableCell align="center">{row.round}</TableCell>
      <TableCell align="center">{row.code}</TableCell>
      <TableCell align="center">{row.amount}</TableCell>
    </TableRow>;
  }

  render() {
    const content = this.state.isLoading
      ? <CircularProgress />
      : this.usersList();

    return <Box justifyContent="center">
      {content}
    </Box>
  }
}

export default withTranslation('')(UserOrdersList);