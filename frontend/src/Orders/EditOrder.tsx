import React from 'react';

import {Grid, IconButton, TextField} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

import { withTranslation, WithTranslation } from 'react-i18next';

import translations from '../Utils/TranslationKeys';
import OrderService from '../services/order.service';
import UserUtils from '../Utils/UserUtils';
import { handleError } from '../Utils/Utils';
import alertService from '../services/alert.service';
import { AlertType } from '../Utils/Enums';

interface IProps extends WithTranslation {
    amount: number,
    orderId: number,
    updateOrders: () => void
}

interface IState {
    amount: number,
    updateTimeoutId: number | null
}

class EditOrder extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            amount: props.amount,
            updateTimeoutId: null
        };
    }

    updateOrder() {
        if (this.state.updateTimeoutId !== null) {
            window.clearTimeout(this.state.updateTimeoutId);
        }

        if (this.props.amount === this.state.amount) {
            return;
        }

        const orderId = this.props.orderId;
        const newAmount = this.state.amount;
        console.debug("newAmount", this.state.amount);

        const token = UserUtils.getToken();
        if (token == null) {
            window.location.reload();
            return;
        }

        OrderService.updateOrderAmount(token, orderId, newAmount)
        .then(res => {
          console.debug(res.data);
          alertService.showAlert(translations.orderEditedSuccessfully, AlertType.success);

          this.props.updateOrders();
        })
        .catch(handleError);
    }

    updateAmount(amountDiff: number) {
        if (this.state.updateTimeoutId !== null) {
            window.clearTimeout(this.state.updateTimeoutId);
        }

        this.setState({
            amount: this.state.amount+amountDiff,
            updateTimeoutId: window.setTimeout(this.updateOrder.bind(this), 3000)
        });
    }

    handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        if (target != null) {
          this.setState({
            amount: +target.value
          } as unknown as IState);
        }
      }

    render() {
        const { t } = this.props;

        return <Grid container spacing={2}>
        <Grid xs-item={2}>
        <IconButton xs-item={2} aria-label={t(translations.subtract)} onClick={this.updateAmount.bind(this, -1)}>
          <RemoveCircle color="primary" />
        </IconButton>
        </Grid>
        <Grid xs-item={6}>
            <TextField
                autoComplete="amount"
                name={"amount"+this.props.orderId}
                required
                id={"amount"+this.props.orderId}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'center' } }}
                label={t(translations.amount)}
                autoFocus
                onBlur={(e) => {
                    console.debug("blur");
                    this.updateOrder();
                }}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        console.debug("enter");
                        (e.target as HTMLInputElement).blur();
                    }
                }}
                onChange={this.handleAmountChange.bind(this)}
                value={this.state.amount}
                variant="standard"
                />
        </Grid>
        <Grid xs-item={2}>
        <IconButton xs-item={2} aria-label={t(translations.add)} onClick={this.updateAmount.bind(this, 1)}>
          <AddCircle color="primary" />
        </IconButton>
        </Grid>
      </Grid>;
    }
}

export default withTranslation('')(EditOrder);