import React from 'react';

import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import translations from '../Utils/TranslationKeys';
import { SignUpStep } from '../Utils/Enums';

interface IProps {
  SetFirstName: React.Dispatch<React.SetStateAction<string>>,
  SetLastName: React.Dispatch<React.SetStateAction<string>>,
  SetUsername: React.Dispatch<React.SetStateAction<string>>,
  SetStep: React.Dispatch<React.SetStateAction<SignUpStep>>
}

export default function SignUpUser(props: IProps) {
  const { t } = useTranslation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (target != null) {
      // const value = target.type === 'checkbox' ? target.checked : target.value;
      const value = target.value;
      const name = target.name;
      
      switch(name) {
        case "firstName":
          props.SetFirstName(value);
          break;
        case "lastName":
          props.SetLastName(value);
          break;
        case "username":
          props.SetUsername(value);
          break;
        default:
          console.error("The input is not managed")
          break;
      }
    }
  };

  const handleSubmit = () =>
  {
    props.SetStep(SignUpStep.group);
  }

  return (
    <div>
      <Typography component="h1" variant="h5">
        Sign up - user info
      </Typography>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label={t(translations.firstName)}
              autoFocus
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label={t(translations.lastName)}
              name="lastName"
              autoComplete="lname"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete={t(translations.username)}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          {t(translations.continue)}
        </Button>
      </form>
    </div>
  );
}