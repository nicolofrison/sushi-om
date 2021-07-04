import React from 'react';

import {withTranslation, WithTranslation} from "react-i18next";

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

import translations from '../Utils/TranslationKeys';

const styles = (theme: any) => createStyles({
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
});

enum FormType {
  create,
  join
}

interface IProps extends WithStyles<typeof styles>, WithTranslation {}

interface IState {
  formType: FormType,
  groupName: string,
  groupPassword: string
}

class SignUpGroup extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      formType: FormType.create,
      groupName: "",
      groupPassword: ""
    };

    this.handleInputChange = this.handleInputChange.bind(
      this
    );
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

  handleFormType(type: FormType) {
    this.setState({
      formType: type
    });
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <Typography component="h1" variant="h5">
          Sign up - group info
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="gname"
                name="groupName"
                variant="outlined"
                required
                fullWidth
                id="groupName"
                label={t(translations.groupName)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label={t(translations.groupPassword)}
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={6}>
              <Button type="submit" size="large" variant="contained" color="primary" onClick={this.handleFormType.bind(this, FormType.create)} className={classes.submit}>{t(translations.createGroup)}</Button>
            </Grid>
            <Grid item xs={6}>
              <Button type="submit" size="large" variant="contained" color="primary" onClick={this.handleFormType.bind(this, FormType.join)} className={classes.submit}>{t(translations.joinGroup)}</Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

const translatedSignUpGroup = withTranslation('')(SignUpGroup);
export default withStyles(styles)(translatedSignUpGroup);