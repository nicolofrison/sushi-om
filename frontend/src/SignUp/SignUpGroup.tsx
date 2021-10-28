import React from 'react';

import {withTranslation, WithTranslation} from "react-i18next";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createStyles, withStyles } from '@mui/material/styles';

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

interface IProps extends WithTranslation {
  SetGroupName: React.Dispatch<React.SetStateAction<string>>,
  SetGroupPassword: React.Dispatch<React.SetStateAction<string>>,
  SetFormType: React.Dispatch<React.SetStateAction<SignUpFormType>>,
  SetStep: (step: SignUpStep) => void
}

interface IState {
  groupName: string,
  groupPassword: string,
  formType: SignUpFormType
}

class SignUpGroup extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      groupName: "",
      groupPassword: "",
      formType: SignUpFormType.create
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

  handleFormType(type: SignUpFormType) {

    this.props.SetGroupName(this.state.groupName);
    this.props.SetGroupPassword(this.state.groupPassword);
    this.props.SetFormType(type);
    this.props.SetStep(SignUpStep.submit);
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <Typography component="h1" variant="h5">
          Sign up - group info
        </Typography>
        <form noValidate>
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
                onChange={this.handleInputChange.bind(this)}
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
                onChange={this.handleInputChange.bind(this)}
              />
            </Grid>
            <Grid item xs={6}>
              <Button size="large" variant="contained" color="primary" onClick={this.handleFormType.bind(this, SignUpFormType.create)}>{t(translations.createGroup)}</Button>
            </Grid>
            <Grid item xs={6}>
              <Button size="large" variant="contained" color="primary" onClick={this.handleFormType.bind(this, SignUpFormType.join)}>{t(translations.joinGroup)}</Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default withTranslation('')(SignUpGroup);