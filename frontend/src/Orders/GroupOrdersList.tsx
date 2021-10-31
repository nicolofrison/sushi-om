import React from 'react';

import {useTranslation, withTranslation} from "react-i18next";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
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

interface IGroupOrdersListState extends IOrdersListState { }

class UserOrdersList extends OrdersList<IOrdersListProps, IGroupOrdersListState> {

  constructor(props: IOrdersListProps) {
    super(props);

    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.state = {
      orders: [],
      isLoading: false
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

  usersTable() {
    const { t } = this.props;

    if (this.state.orders.length === 0) {
      return;
    }

    const usersList: any[] = [];
    this.state.orders.forEach(o => {
      const key = o.username ?? o.name + " " + o.surname;
      usersList[key] = [...usersList[key] || [], o];
    });

    return <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell width="10%" />
            <TableCell width="10%">{t(ToFirstCapitalLetter(translations.checked))}</TableCell>
            <TableCell>{t(ToFirstCapitalLetter(translations.username))}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(usersList).map((userRow: any) => <UserTableRow userRow={userRow} />)}
        </TableBody>
      </Table>
    </TableContainer>;
  }

  render() {
    const content = this.state.isLoading
      ? <CircularProgress />
      : this.usersTable();

    return <Box justifyContent="center">
      {content}
    </Box>
  }
}

function UserTableRow(props: { userRow: any }) {
  const { userRow } = props;
  const [open, setOpen] = React.useState(false);

  // the username or the combination of user's firstName and lastName
  const username: string = userRow[0];
  const userOrders = userRow[1];

  const allUserOrdersChecked = userOrders.every((o: any) => o.checked);

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
    <TableCell align="center">{allUserOrdersChecked && <CheckCircleIcon color="success" />}</TableCell>
    <TableCell component="th" scope="row">{username}</TableCell>
  </TableRow>;

  const contentRow =<TableRow>
    <TableCell colSpan={3}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box>
          <Typography variant="h6">
            Orders
          </Typography>
          <UserOrders userOrders={userOrders} />
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

function UserOrders(props: { userOrders: any }) {
  const { t } = useTranslation();

  const { userOrders } = props;

  return <TableContainer component={Paper}>
      <Table aria-label="simple table">
      <TableHead>
          <TableRow>
            <TableCell width="10%" align="center">{ToFirstCapitalLetter(t(translations.checked))}</TableCell>
            <TableCell width="10%" align="center">{ToFirstCapitalLetter(t(translations.round))}</TableCell>
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.code))}</TableCell>
            <TableCell align="center">{ToFirstCapitalLetter(t(translations.amount))}</TableCell>
          </TableRow>
      </TableHead>
      <TableBody>
        {userOrders.map((userOrder: any) => <OrderRow userOrder={userOrder} />)}
      </TableBody>
      </Table>
  </TableContainer>
}

function OrderRow(props: {userOrder: any}) {
  const { userOrder } = props;

  return <TableRow key={userOrder.orderId}>
    <TableCell component="th" scope="row" />
    <TableCell align="center">{userOrder.round}</TableCell>
    <TableCell align="center">{userOrder.code}</TableCell>
    <TableCell align="center">{userOrder.amount}</TableCell>
  </TableRow>;
}


export default withTranslation('')(UserOrdersList);