import { withTranslation } from "react-i18next";

import Paper from '@mui/material/Paper';

import UserService from '../services/user.service';

import UserUtils from '../Utils/UserUtils';
import { handleError, ToFirstCapitalLetter } from '../Utils/Utils';
import User from '../Interfaces/User.interface';
import { IOrdersListProps, IOrdersListState, OrdersList } from './OrdersList';
import CartOrdersList from './UserCart/CartOrdersList';
import UserConfirmedOrdersList from './UserOrders/UserConfirmedOrdersList';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import translations from "../Utils/TranslationKeys";

enum RoundType {
  cart = -1,
  allConfirmed = 0
}

interface IGenericOrdersListProps extends IOrdersListProps { }

interface IGenericOrdersListState extends IOrdersListState {
  confirmed: boolean,
  round: number
}

class UserOrdersList extends OrdersList<IGenericOrdersListProps, IGenericOrdersListState> {

  constructor(props: IGenericOrdersListProps) {
    super(props);

    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    this.state = {
      orders: [],
      isLoading: false,
      confirmed: user.confirmed,
      round: RoundType.cart
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

    super.updateOrders(user.userId);
    this.updateConfirmed();
  }

  updateConfirmed() {
    const user = UserUtils.getUser();
    if (user == null) {
      window.location.reload();
      return;
    }

    UserService.getUser(user.accessToken, user.userId)
      .then(res => {
        console.debug(res.data);

        const newUser = res.data as User;
        this.setUserConfirmation(user, newUser.confirmed);
      })
      .catch(handleError);
  }

  setUserConfirmation(user: User, confirmed: boolean) {
    user.confirmed = confirmed;
    UserUtils.setUser(user);

    this.setState({ confirmed: confirmed });
  }

  setIsLoading(isLoading: boolean) {
    this.setState({ isLoading });
  }

  render() {
    const { t } = this.props;

    return (
      <Paper square>
        <FormControl variant="filled" fullWidth>
            <InputLabel id="ordersToShowSelectLabel">{ToFirstCapitalLetter(t(translations.ordersToShow))}</InputLabel>
          <Select
            id="ordersToShowSelect"
            labelId="ordersToShowSelectLabel"
            value={this.state.round.toString()}
            onChange={(event) => {
              const round = parseInt(event.target.value as string, 10);
              this.setState({ round });
            }}
          >
            <MenuItem key={RoundType.cart} value={RoundType.cart}>{ToFirstCapitalLetter(t(translations.cart))}</MenuItem>
            <MenuItem key={RoundType.allConfirmed} value={RoundType.allConfirmed}>{ToFirstCapitalLetter(t(translations.allConfirmedOrders))}</MenuItem>
            {this.state.orders.map(o => o.round)
              .filter((value: any, index: number, array: any[]) => value && array.indexOf(value) === index)
              .map(r => <MenuItem key={r} value={r}>{ToFirstCapitalLetter(t(translations.round)) + " " + r}</MenuItem>)}
          </Select>
        </FormControl>
        {this.state.round === RoundType.cart && 
          <CartOrdersList isLoading={this.state.isLoading} orders={this.state.orders.filter(o => !o.round)} setIsLoading={this.setIsLoading.bind(this)} updateOrders={this.updateOrders.bind(this)} />}
        {this.state.round !== RoundType.cart &&
          <UserConfirmedOrdersList isLoading={this.state.isLoading} orders={this.state.orders.filter(o => o.round && (this.state.round === RoundType.allConfirmed || o.round === this.state.round))} setIsLoading={this.setIsLoading.bind(this)} updateOrders={this.updateOrders.bind(this)} />}
      </Paper>
    );
  }
}

export default withTranslation('')(UserOrdersList);