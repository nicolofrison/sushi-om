import { IconButton, TableCell, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";

import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

import alertService from "../../services/alert.service";
import OrderService from "../../services/order.service";
import { AlertType } from "../../Utils/Enums";
import translations from "../../Utils/TranslationKeys";
import UserUtils from "../../Utils/UserUtils";
import { handleError, isNullOrUndefined } from "../../Utils/Utils";
import EditOrder from "./EditOrder";


interface IProps {
    confirmed: boolean,
    orderRow: any,
    updateOrders: () => void
}

export default function CartOrdersRow(props: IProps) {
    const { confirmed, orderRow, updateOrders } = props;
    const { t } = useTranslation();

    const deleteOrder = () => {
        const accessToken = UserUtils.getToken();
        if (accessToken == null) {
          window.location.reload();
          return;
        }
  
        OrderService.deleteOrder(accessToken, orderRow.orderId)
        .then(res => {
          console.debug(res.data);
          alertService.showAlert(translations.orderRemovedSuccessfully, AlertType.success);
  
          updateOrders();
        })
        .catch((e: Error) => {
            handleError(e);
        });
      }

    const notConfirmedUsersOrders = isNullOrUndefined(orderRow.round)
        && !confirmed;

    return <TableRow key={orderRow.orderId}>
        <TableCell align="center">{orderRow.code}</TableCell>
        <TableCell align="center">
            {notConfirmedUsersOrders
                ? <EditOrder orderId={orderRow.orderId} amount={orderRow.amount} updateOrders={updateOrders} />
                : orderRow.amount
            }
        </TableCell>
        <TableCell align="center">
            {notConfirmedUsersOrders
                && <IconButton aria-label={t(translations.remove)} size="large" onClick={() => deleteOrder()}>
                <IndeterminateCheckBoxIcon fontSize="inherit" color="error" />
              </IconButton>
            }
        </TableCell>
    </TableRow>;
}