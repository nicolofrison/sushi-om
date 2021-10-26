import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import SignUpUser from './SignUpUser';
import SignUpGroup from './SignUpGroup';
import { SignUpFormType, SignUpStep } from '../Utils/Enums';
import AuthPost from '../Interfaces/AuthPost.interface';
import User from '../Interfaces/User.interface';
import UserService from '../services/user.service';

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

export default function SignUp() {
  const classes = useStyles();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const [formType, setFormType] = useState(SignUpFormType.create,);
  const [step, setStep] = useState(SignUpStep.user);
  
  const handleSubmit = () => {
    const authPost: AuthPost = {
      name: firstName,
      surname: lastName,
      username: username === "" ? undefined : username,
      groupName,
      groupPassword,
      signType: formType === SignUpFormType.join ? "joinGroup" : "createGroup"
    }
    localStorage.removeItem("user");
    UserService.signUp(authPost)
      .then(res => {
        console.log(res.data);

        const user = res.data as User;
        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.reload();
      });
  };

  useEffect(() => {
      if (step == SignUpStep.submit) {
        handleSubmit();
      }
  }, [step]);
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        {JSON.stringify({firstName, lastName, username})}
        {step === SignUpStep.user ?
          <SignUpUser SetFirstName={setFirstName} SetLastName={setLastName} SetUsername={setUsername} SetStep={setStep} />
        :
          <SignUpGroup SetGroupName={setGroupName} SetGroupPassword={setGroupPassword} SetFormType={setFormType} SetStep={setStep} />
        }
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}