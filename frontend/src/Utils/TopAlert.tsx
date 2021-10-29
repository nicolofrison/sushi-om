import { useState } from 'react';

import { Alert, AlertTitle, Collapse} from '@mui/material';

import AlertService from '../services/alert.service';
import { AlertType } from './Enums';
import { ToFirstCapitalLetter } from './Utils';



export default function TopAlert() {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState(AlertType.info);

  AlertService.init(setAlertVisible, setAlertText, setAlertType);

  return <Collapse in={isAlertVisible} sx={{position: 'fixed', top: 0, left: 0, right: 0}}>
    <Alert severity={alertType}>
      <AlertTitle>{ToFirstCapitalLetter(alertType)}</AlertTitle>
      {alertText}
    </Alert>
  </Collapse>;
}