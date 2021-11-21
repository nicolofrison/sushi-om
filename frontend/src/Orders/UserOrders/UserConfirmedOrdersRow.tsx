import { Checkbox, TableCell, TableRow } from "@mui/material";

import alertService from "../../services/alert.service";
import OrderService from "../../services/order.service";
import { AlertType } from "../../Utils/Enums";
import translations from "../../Utils/TranslationKeys";
import UserUtils from "../../Utils/UserUtils";
import { handleError } from "../../Utils/Utils";


interface IProps {
    orderRow: any,
    updateOrders: () => void,
    setIsLoading: (isLoading: boolean) => void
}

export default function UserConfirmedOrdersRow(props: IProps) {
    const { orderRow, setIsLoading, updateOrders } = props;

    const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        if (target != null) {
          const value = target.type === 'checkbox' ? target.checked : target.value;
    
          const accessToken = UserUtils.getToken();
          if (accessToken == null) {
            window.location.reload();
            return;
          }
    
          setIsLoading(true);
          OrderService.updateOrderChecked(accessToken, orderRow.orderId, value as boolean)
            .then(res => {
              console.debug(res.data);
              alertService.showAlert(translations.orderCheckedSuccessfully, AlertType.success);
    
              updateOrders();
            })
            .catch((error: Error) => {
              handleError(error);
    
              setIsLoading(false);
            });
        }
      }

    return <TableRow key={orderRow.orderId}>
      <TableCell>
        <Checkbox name={"check-" + orderRow.orderId} checked={orderRow.checked} onChange={handleCheckChange} />
      </TableCell>
      <TableCell align="center" component="th" scope="row">{orderRow.round}</TableCell>
      <TableCell align="center">{orderRow.code}</TableCell>
      <TableCell align="center">{orderRow.amount}</TableCell>
    </TableRow>;
  }