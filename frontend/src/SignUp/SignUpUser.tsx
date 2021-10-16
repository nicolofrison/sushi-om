import React from 'react';

import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import translations from '../Utils/TranslationKeys';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface IProps {
  SetFirstName: React.Dispatch<React.SetStateAction<string>>,
  SetLastName: React.Dispatch<React.SetStateAction<string>>,
  SetUsername: React.Dispatch<React.SetStateAction<string>>,
  SetStep: React.Dispatch<React.SetStateAction<string>>
}

export default function SignUpUser(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (target != null) {
      // const value = target.type === 'checkbox' ? target.checked : target.value;
      const value = target.value;
      const name = target.name;
      console.log(name);
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
    props.SetStep("group");
  }

  return (
    <div>
      <Typography component="h1" variant="h5">
        Sign up - user info
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
          className={classes.submit}
        >
          {t(translations.continue)}
        </Button>
      </form>
    </div>
  );
}