import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SignUp from './SignUp';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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

type DOMEvent = keyof GlobalEventHandlersEventMap;

enum FormType {
  create,
  join
}

interface IProps extends WithStyles<typeof styles> {}

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
    const { classes } = this.props;
    return (
      <div>
        <Typography component="h1" variant="h5">
          Sign up - group info
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                <Button color={this.state.formType === FormType.create ? "primary" : "default"} onClick={this.handleFormType.bind(this, FormType.create)}>Create new group</Button>
                <Button color={this.state.formType === FormType.join ? "primary" : "default"} onClick={this.handleFormType.bind(this, FormType.join)}>Join group</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="gname"
                name="groupName"
                variant="outlined"
                required
                fullWidth
                id="groupName"
                label="Group Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
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
            {this.state.formType === FormType.create ? "Create group" : "Join group"}
          </Button>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(SignUpGroup);