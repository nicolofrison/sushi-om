import React from 'react';

import {useTranslation, withTranslation} from "react-i18next";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

  codesTable() {
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

    return <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell width="10%" />
            <TableCell width="10%">{t(ToFirstCapitalLetter(translations.checked))}</TableCell>
            <TableCell align="center">{t(ToFirstCapitalLetter(translations.code))}</TableCell>
            <TableCell align="center">{t(ToFirstCapitalLetter(translations.amount))}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(codesList).map((codeRow: any) => <CodeUsersTable codeRow={codeRow} />)}
        </TableBody>
      </Table>
    </TableContainer>;
  }

  render() {
    const content = this.state.isLoading
      ? <CircularProgress />
      : this.codesTable();

    return <Box justifyContent="center">
      {content}
    </Box>
  }
}

function CodeUsersTable(props: { codeRow: any }) {
  const { codeRow } = props;
  const [open, setOpen] = React.useState(false);
  
    const code = codeRow[0];
    // The orders of the users with the same code
    const usersOrders = codeRow[1];
    let codeTotalAmount = 0;
    usersOrders.forEach((o: any) => {
        codeTotalAmount += o.amount;
    });
  const allCodeOrdersChecked = usersOrders.every((o: any) => o.checked);

  const headerRow = <TableRow>
    <TableCell>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpen(!open)}
      >
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </TableCell>
    <TableCell align="center">{allCodeOrdersChecked && <CheckCircleIcon color="success" />}</TableCell>
    <TableCell align="center" component="th" scope="row">{code}</TableCell>
    <TableCell align="center">{codeTotalAmount}</TableCell>
  </TableRow>;

  const contentRow =<TableRow>
    <TableCell colSpan={4}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box>
          <Typography variant="h6">
            Orders
          </Typography>
          <UsersOrders usersOrders={usersOrders} />
        </Box>
      </Collapse>
    </TableCell>
  </TableRow>;

  return (
    <React.Fragment>
      {headerRow}
      {contentRow}
    </React.Fragment>
  );
}

function UsersOrders(props: { usersOrders: any }) {
  const { t } = useTranslation();

  const { usersOrders } = props;

  return <TableContainer component={Paper}>
      <Table aria-label="simple table">
      <TableHead>
          <TableRow>
            <TableCell align="center" width="10%">{ToFirstCapitalLetter(t(translations.checked))}</TableCell>
            <TableCell align="center" width="10%">{ToFirstCapitalLetter(t(translations.round))}</TableCell>
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.username))}</TableCell>
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.amount))}</TableCell>
          </TableRow>
      </TableHead>
      <TableBody>
        {usersOrders.map((userOrder: any) => <UserOrderRow userOrder={userOrder} />)}
      </TableBody>
      </Table>
  </TableContainer>
}

function UserOrderRow(props: {userOrder: any}) {
  const { userOrder } = props;

  const username = userOrder.username ?? userOrder.name + " " + userOrder.surname;

  return <TableRow key={userOrder.orderId}>
    <TableCell component="th" scope="row" />
    <TableCell align="center">{userOrder.round}</TableCell>
    <TableCell align="center">{username}</TableCell>
    <TableCell align="center">{userOrder.amount}</TableCell>
  </TableRow>;
}

export default withTranslation('')(ConfirmedOrdersList);