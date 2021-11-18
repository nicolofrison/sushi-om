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
      this.setState({orders: (res.data as any[]).filter(o => o.round), isLoading: false});

      console.debug(res.data);
    })
    .catch((error: Error | AxiosError) => {
      handleError(error);

      this.setState({isLoading: false});
    });
  }

  codesTable() {
    const { t } = this.props;

    if (this.state.orders.length === 0) {
      return ToFirstCapitalLetter(t(translations.ordersEmpty));
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
    <TableCell align="center">{userOrder.checked && <CheckCircleIcon color="success" />}</TableCell>
    <TableCell align="center" component="th" scope="row">{userOrder.round}</TableCell>
    <TableCell align="center">{username}</TableCell>
    <TableCell align="center">{userOrder.amount}</TableCell>
  </TableRow>;
}

export default withTranslation('')(ConfirmedOrdersList);