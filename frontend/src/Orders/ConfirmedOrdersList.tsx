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

import UserUtils from '../Utils/UserUtils';
import { handleError, ToFirstCapitalLetter } from '../Utils/Utils';
import { AxiosError } from 'axios';
import { IOrdersListProps, IOrdersListState, OrdersList } from './OrdersList';

interface IConfirmedOrdersListState extends IOrdersListState {
    expandedCode: string
}

class ConfirmedOrdersList extends OrdersList<IOrdersListProps, IConfirmedOrdersListState> {

  constructor(props: IOrdersListProps) {
    super(props);

    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.state = {
      orders: [],
      isLoading: false,
      expandedCode: ""
    };
  }

  componentDidMount() {
    this.updateOrders();
  }

  updateOrders() {
    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.setState({isLoading: true});
    const groupId = user.groupId;

    OrderService.getOrders(user.accessToken, groupId, -1)
    .then(res => {
      this.setState({orders: res.data as any[], isLoading: false});

      console.log(res.data);
    })
    .catch((error: Error | AxiosError) => {
      handleError(error);

      this.setState({isLoading: false});
    });
  }

  codesList() {
    const { t } = this.props;

    if (this.state.orders.length === 0) {
      return;
    }

    // group orders by code
    const codesList: any[] = [];
    this.state.orders.forEach(o => {
      const key = o.code;
      codesList[key] = [...codesList[key] || [], o];
    });

    return <Box>
        <Grid container spacing={2}>
            <Grid item xs={2} color="black">{t(ToFirstCapitalLetter(translations.checked))}</Grid>
            <Grid item xs={5} color="black">{t(ToFirstCapitalLetter(translations.code))}</Grid>
            <Grid item xs={5} color="black">{t(ToFirstCapitalLetter(translations.amount))}</Grid>
        </Grid>
        {Object.entries(codesList).map((codeRow: any) => this.codeRow(codeRow))}
    </Box>
  }

  handleSelectedUserRowChange = (code: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    this.setState({expandedCode: newExpanded ? code : ""});
  }

  codeRow(codeRow: any) {
    // the username or the combination of user's firstName and lastName
    const code = codeRow[0];
    // The orders of the users with the same code
    const usersOrders = codeRow[1];
    let codeTotalAmount = 0;
    usersOrders.forEach((o: any) => {
        codeTotalAmount += o.amount;
    });
    console.log(codeTotalAmount);

    return <Accordion expanded={this.state.expandedCode === code} onChange={this.handleSelectedUserRowChange(code)}>
      <AccordionSummary aria-controls={code + "-content"} id={code + "-header"}>
        <Grid container spacing={2}>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            {code}
          </Grid>
          <Grid item xs={5}>
            {codeTotalAmount}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {this.usersOrders(usersOrders)}
      </AccordionDetails>
    </Accordion>;
  }

  usersOrders(usersOrders: any[]) {
    const { t } = this.props;

    return <TableContainer component={Paper}>
        <Table aria-label="simple table">
        <TableHead>
            <TableRow>
              <TableCell />
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.round))}</TableCell>
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.username))}</TableCell>
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.amount))}</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {usersOrders.map((userOrder: any) => this.userOrderRow(userOrder))}
        </TableBody>
        </Table>
    </TableContainer>
  }

  userOrderRow(row: any) {
    return <TableRow key={row.orderId}>
      <TableCell component="th" scope="row" />
      <TableCell align="center">{row.round}</TableCell>
      <TableCell align="center">{row.username ?? row.name + " " + row.surname}</TableCell>
      <TableCell align="center">{row.amount}</TableCell>
    </TableRow>;
  }

  render() {
    const content = this.state.isLoading
      ? <CircularProgress />
      : this.codesList();

    return <Box justifyContent="center">
      {content}
    </Box>
  }
}

export default withTranslation('')(ConfirmedOrdersList);