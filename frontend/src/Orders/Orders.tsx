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

export default function Orders() {
  const { t, i18n } = useTranslation();
  const [ordersType, setOrdersType] = useState(OrdersType.user);

  return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType == OrdersType.user} variant={ordersType == OrdersType.user ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.user)}>{t(translations.usersOrders)}</Button>
        </Grid>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType == OrdersType.group} variant={ordersType == OrdersType.group ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.group)}>{t(translations.groupOrders)}</Button>
        </Grid>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType == OrdersType.all} variant={ordersType == OrdersType.all ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.all)}>{t(translations.allConfirmedOrders)}</Button>
        </Grid>
        <Grid item xs={12}>
          <OrdersList OrdersType={ordersType} />
        </Grid>
      </Grid>
      );
}