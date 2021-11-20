import { useState } from 'react';
import { useTranslation } from "react-i18next";

import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import UserOrdersList from './UserOrdersList';
import GroupOrdersList from './GroupOrdersList';
import ConfirmedOrdersList from './ConfirmedOrdersList';
import { OrdersType } from '../Utils/Enums';
import translations from '../Utils/TranslationKeys';
import { ToFirstCapitalLetter } from '../Utils/Utils';

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
        <Grid item xs={12}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="ordersListTypeLabel">Orders list type</InputLabel>
            <Select
              labelId="ordersListTypeLabel"
              id="ordersListType"
              value={ordersType.toString()}
              label="Orders list type"
              onChange={(event: SelectChangeEvent) => {
                const value = event.target.value;
                setOrdersType(parseInt(value, 10));
              }}
            >
              <MenuItem value={OrdersType.user}>{ToFirstCapitalLetter(t(translations.userOrders))}</MenuItem>
              <MenuItem value={OrdersType.group}>{ToFirstCapitalLetter(t(translations.groupOrders))}</MenuItem>
              <MenuItem value={OrdersType.all}>{ToFirstCapitalLetter(t(translations.allConfirmedOrders))}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          {ordersList}
        </Grid>
      </Grid>
      );
}