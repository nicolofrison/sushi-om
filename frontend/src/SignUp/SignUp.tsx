import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/material/styles';
import Container from '@mui/material/Container';

import SignUpUser from './SignUpUser';
import SignUpGroup from './SignUpGroup';
import { SignUpFormType, SignUpStep } from '../Utils/Enums';
import AuthPost from '../Interfaces/AuthPost.interface';
import User from '../Interfaces/User.interface';
import UserService from '../services/user.service';
import UserUtils from '../Utils/UserUtils';

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

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const [formType, setFormType] = useState(SignUpFormType.create);
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
    UserUtils.removeUser();
    UserService.signUp(authPost)
      .then(res => {
        console.log(res.data);

        UserUtils.setUser(res.data as User);
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
      <div>
        <Avatar>
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