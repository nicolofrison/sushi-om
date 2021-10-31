import { useState } from 'react';

import {useTranslation} from "react-i18next";

import Button from '@mui/material/Button';

import translations from '../Utils/TranslationKeys';
import { Grid } from '@mui/material';
import { OrdersType } from '../Utils/Enums';
import UserOrdersList from './UserOrdersList';
import GroupOrdersList from './GroupOrdersList';
import ConfirmedOrdersList from './ConfirmedOrdersList';

export default function Orders() {
  const { t } = useTranslation();
  const [ordersType, setOrdersType] = useState(OrdersType.user);

  let ordersList: JSX.Element = <UserOrdersList />;
  switch (ordersType) {
    case OrdersType.user:
      ordersList = <UserOrdersList />;
      break;
    case OrdersType.group:
      ordersList = <GroupOrdersList />;
      break;
    case OrdersType.all:
      ordersList = <ConfirmedOrdersList />;
      break;
  }

  return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType === OrdersType.user} variant={ordersType === OrdersType.user ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.user)}>{t(translations.userOrders)}</Button>
        </Grid>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType === OrdersType.group} variant={ordersType === OrdersType.group ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.group)}>{t(translations.groupOrders)}</Button>
        </Grid>
        <Grid item xs={4}>
          <Button size="large" disabled={ordersType === OrdersType.all} variant={ordersType === OrdersType.all ? "outlined" : "contained"} color="primary" onClick={() => setOrdersType(OrdersType.all)}>{t(translations.allConfirmedOrders)}</Button>
        </Grid>
        <Grid item xs={12}>
          {ordersList}
        </Grid>
      </Grid>
      );
}