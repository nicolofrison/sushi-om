import React from 'react';
import axios from 'axios';

import {withTranslation, WithTranslation} from "react-i18next";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

import translations from '../Utils/TranslationKeys';
import AuthPost from '../Interfaces/AuthPost.interface';
import { SignUpFormType, SignUpStep } from '../Utils/Enums';

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

interface IProps extends WithStyles<typeof styles>, WithTranslation {
  FirstName: string,
  LastName: string,
  Username: string
}

interface IState {
  formType: SignUpFormType,
  groupName: string,
  groupPassword: string
}

class SignUpGroup extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      formType: SignUpFormType.create,
      groupName: "",
      groupPassword: ""
    };

    this.handleInputChange = this.handleInputChange.bind(
      this
    );
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(this.props);
    const target = event.target;
    if (target != null) {
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      } as unknown as IState);
    }
  }

  handleFormType(type: SignUpFormType) {
    this.setState({
      formType: type
    });

    this.handleSubmit();
  }

  handleSubmit() {
    const authPost: AuthPost = {
      name: this.props.FirstName,
      surname: this.props.LastName,
      username: this.props.Username === "" ? undefined : this.props.Username,
      groupName: this.state.groupName,
      groupPassword: this.state.groupPassword,
      signType: this.state.formType === SignUpFormType.join ? "joinGroup" : "createGroup"
    }

    axios.post(`http://localhost:5000/auth/register`, authPost)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
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
                onChange={this.handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="groupPassword"
                label={t(translations.groupPassword)}
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Button size="large" variant="contained" color="primary" onClick={this.handleFormType.bind(this, SignUpFormType.create)} className={classes.submit}>{t(translations.createGroup)}</Button>
            </Grid>
            <Grid item xs={6}>
              <Button size="large" variant="contained" color="primary" onClick={this.handleFormType.bind(this, SignUpFormType.join)} className={classes.submit}>{t(translations.joinGroup)}</Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

const translatedSignUpGroup = withTranslation('')(SignUpGroup);
export default withStyles(styles)(translatedSignUpGroup);