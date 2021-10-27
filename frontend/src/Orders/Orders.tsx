import React, { useState } from 'react';

import {WithTranslation, withTranslation, useTranslation} from "react-i18next";

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
import { createMuiTheme, Grid, makeStyles, TextField, Theme, ThemeProvider, WithStyles } from '@material-ui/core';
import OrderPost from '../Interfaces/OrderPost.interface';
import User from '../Interfaces/User.interface';
import { OrdersType } from '../Utils/Enums';
import OrdersList from './OrdersList';

const useStyles = makeStyles((theme: Theme) => ({
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
}));

export default function Orders() {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [ordersType, setOrdersType] = useState(OrdersType.user);

  return (
      <Grid container spacing={2} className={classes.form}>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType == OrdersType.user} variant={ordersType == OrdersType.user ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.user)} className={classes.submit}>{t(translations.usersOrders)}</Button>
        </Grid>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType == OrdersType.group} variant={ordersType == OrdersType.group ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.group)} className={classes.submit}>{t(translations.groupOrders)}</Button>
        </Grid>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType == OrdersType.all} variant={ordersType == OrdersType.all ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.all)} className={classes.submit}>{t(translations.allConfirmedOrders)}</Button>
        </Grid>
        <Grid item xs={12}>
          <OrdersList OrdersType={ordersType} />
        </Grid>
      </Grid>
      );
}