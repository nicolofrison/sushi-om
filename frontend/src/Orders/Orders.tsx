import React from 'react';

import {WithTranslation, withTranslation} from "react-i18next";

import { withStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import translations from '../Utils/TranslationKeys';
import OrderService from '../services/order.service';
import { TextField, WithStyles } from '@material-ui/core';
import OrderPost from '../Interfaces/OrderPost.interface';
import User from '../Interfaces/User.interface';

const styles = (theme: any) => createStyles({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

function createData(code: string, amount: number, users: number, actions: number) {
  return { code, amount, users, actions };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24),
  createData('Ice cream sandwich', 237, 9.0, 37),
  createData('Eclair', 262, 16.0, 24),
  createData('Cupcake', 305, 3.7, 67),
  createData('Gingerbread', 356, 16.0, 49),
];

interface IProps extends WithStyles<typeof styles>, WithTranslation {}

interface IState {
  orders: any[],
  code: string,
  amount: number
}

class Orders extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      orders: [],
      code: "",
      amount: 0
    };
  }

  getUser() {
    const jsonUser = localStorage.getItem("user");
    if (!jsonUser) {
      window.location.reload();
      return;
    }
    const user = JSON.parse(jsonUser);
    console.log(user);
    if (!user.accessToken) {
      localStorage.removeItem("user");
      window.location.reload();
      return;
    }

    return user;
  }

    componentDidMount() {
      this.getOrders();
    }

    getOrders() {
      const user = this.getUser();

      OrderService.getOrders(user.accessToken)
      .then(res => {
        this.setState({orders: res.data as any[]});

        console.log(res.data);
      });
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

      const user: User = this.getUser();

      OrderService.addOrder(user.accessToken, orderPost)
      .then(res => {
        console.log(res.data);

        this.setState({code: "", amount: 0});

        this.getOrders();
      });
    }

    getEditRow() {
      const { t, classes } = this.props;
      return (
        <TableRow key="add">
        <TableCell />
          <TableCell align="center">
            <TextField
                  autoComplete="code"
                  name="code"
                  variant="outlined"
                  required
                  id="code"
                  label={t(translations.code)}
                  autoFocus
                  fullWidth
                  onChange={this.handleInputChange.bind(this)}
                  value={this.state.code}
                />
          </TableCell>
          <TableCell align="center">
                <TextField
                      autoComplete="amount"
                      name="amount"
                      variant="outlined"
                      required
                      fullWidth
                      id="amount"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      label={t(translations.amount)}
                      autoFocus
                      onChange={this.handleInputChange.bind(this)}
                      value={this.state.amount}
                    />
          </TableCell>
        <TableCell />
          <TableCell align="center">
              <Button size="large" variant="contained" color="primary" onClick={this.addOrder.bind(this)} className={classes.submit}>{t(translations.add)}</Button>
          </TableCell>
        </TableRow>
      )
    }

    render() {
      const { t, classes } = this.props;
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
                    {this.getEditRow()}
                    {this.state.orders.map((row) => (
                    <TableRow key={row.code}>
                        <TableCell component="th" scope="row">
                        
                        </TableCell>
                        <TableCell align="center">{row.code}</TableCell>
                        <TableCell align="center">{row.amount}</TableCell>
                        <TableCell align="center">{row.round}</TableCell>
                        <TableCell align="center">
                            <Button size="large" variant="contained" style={{backgroundColor: 'red', color: '#FFFFFF'}} >{"Remove"}</Button>{row.actions}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            );
    }
}

const translatedOrders = withTranslation('')(Orders);
export default withStyles(styles)(translatedOrders);