import React from 'react';

import {WithTranslation, withTranslation} from "react-i18next";

import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import AddBoxIcon from '@mui/icons-material/AddBox';

import translations from '../../Utils/TranslationKeys';
import OrderService from '../../services/order.service';
import { TextField } from '@mui/material';
import OrderPost from '../../Interfaces/OrderPost.interface';
import UserUtils from '../../Utils/UserUtils';
import { handleError } from '../../Utils/Utils';
import alertService from '../../services/alert.service';
import { AlertType } from '../../Utils/Enums';

interface IProps extends WithTranslation {
    updateOrders: () => void,
    ordersConfirmed: boolean
}

interface IState {
    code: string,
    amount: number | ""
}
      
class AddOrder extends React.Component<IProps, IState> {

        constructor(props: IProps) {
          super(props);
          this.state = {
            code: "",
            amount: ""
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
            if (this.state.code === "" || this.state.amount === "" || this.state.amount < 1) {
              return;
            }

            const orderPost: OrderPost = {
              code: this.state.code,
              amount: +this.state.amount
            };
      
            console.debug(this.state.amount);
      
            const accessToken = UserUtils.getToken();
            if (accessToken == null) {
                return;
            }
      
            OrderService.addOrder(accessToken, orderPost)
            .then(res => {
              console.debug(res.data);
              alertService.showAlert(translations.orderAddedSuccessfully, AlertType.success);
      
              this.setState({code: "", amount: 0});
      
              this.props.updateOrders();
            })
            .catch(handleError);
          }
      
          render() {
            const { t } = this.props;
            return (
                <TableRow key="add">
                <TableCell align="center">
                    <TextField
                        autoComplete="code"
                        name="code"
                        variant="outlined"
                        required
                        disabled={this.props.ordersConfirmed}
                        id="code"
                        label={t(translations.code)}
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
                            disabled={this.props.ordersConfirmed}
                            fullWidth
                            id="amount"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            label={t(translations.amount)}
                            onChange={this.handleInputChange.bind(this)}
                            value={this.state.amount}
                            />
                </TableCell>
                <TableCell align="center">
                  <IconButton disabled={this.props.ordersConfirmed} aria-label={t(translations.add)} size="large" onClick={this.addOrder.bind(this)}>
                    <AddBoxIcon fontSize="inherit" color="success" />
                  </IconButton>
                </TableCell>
                </TableRow>
            );
          }
      }
      
export default withTranslation('')(AddOrder);
  