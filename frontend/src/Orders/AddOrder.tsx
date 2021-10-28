import React, { useState } from 'react';

import {WithTranslation, withTranslation, useTranslation} from "react-i18next";

import { withStyles, createStyles } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import translations from '../Utils/TranslationKeys';
import OrderService from '../services/order.service';
import { createMuiTheme, Grid, makeStyles, TextField, Theme, ThemeProvider } from '@mui/material';
import OrderPost from '../Interfaces/OrderPost.interface';
import User from '../Interfaces/User.interface';
import { OrdersType } from '../Utils/Enums';
import OrdersList from './OrdersList';
import UserUtils from '../Utils/UserUtils';

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
  
interface IProps extends WithTranslation {
    updateOrders: () => void
}

interface IState {
    code: string,
    amount: number
}
      
class AddOrder extends React.Component<IProps, IState> {

        constructor(props: IProps) {
          super(props);
          this.state = {
            code: "",
            amount: 0
          };
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
      
            const accessToken = UserUtils.getToken();
            if (accessToken == null) {
                return;
            }
      
            OrderService.addOrder(accessToken, orderPost)
            .then(res => {
              console.log(res.data);
      
              this.setState({code: "", amount: 0});
      
              this.props.updateOrders();
            });
          }
      
          render() {
            const { t } = this.props;
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
                    <Button size="large" variant="contained" color="primary" onClick={this.addOrder.bind(this)}>{t(translations.add)}</Button>
                </TableCell>
                </TableRow>
            );
          }
      }
      
export default withTranslation('')(AddOrder);
  