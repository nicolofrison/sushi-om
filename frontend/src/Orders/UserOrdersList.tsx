import { withTranslation } from "react-i18next";

import Paper from '@mui/material/Paper';

import UserService from '../services/user.service';

import UserUtils from '../Utils/UserUtils';
import { handleError } from '../Utils/Utils';
import User from '../Interfaces/User.interface';
import { IOrdersListProps, IOrdersListState, OrdersList } from './OrdersList';
import CartOrdersList from './UserCart/CartOrdersList';
import UserConfirmedOrdersList from './UserOrders/UserConfirmedOrdersList';

interface IGenericOrdersListProps extends IOrdersListProps { }

interface IGenericOrdersListState extends IOrdersListState {
  confirmed: boolean
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
      confirmed: user.confirmed
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
    return (
      <Paper square>
        <CartOrdersList isLoading={this.state.isLoading} orders={this.state.orders.filter(o => !o.round)} setIsLoading={this.setIsLoading.bind(this)} updateOrders={this.updateOrders.bind(this)} />
        <UserConfirmedOrdersList isLoading={this.state.isLoading} orders={this.state.orders.filter(o => o.round)} setIsLoading={this.setIsLoading.bind(this)} updateOrders={this.updateOrders.bind(this)} />
      </Paper>
    );
  }
}

export default withTranslation('')(UserOrdersList);