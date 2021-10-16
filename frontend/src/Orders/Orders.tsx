import React from 'react';

import {withTranslation, WithTranslation} from "react-i18next";

import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

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

function createData(code: string, amount: number, users: number, actions: number) {
  return { code, amount, users, actions };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24),
  createData('Ice cream sandwich', 237, 9.0, 37),
  createData('Eclair', 262, 16.0, 24),
  createData('Cupcake', 305, 3.7, 67),
  createData('Gingerbread', 356, 16.0, 49),
];

class Orders extends React.Component {

    componentDidMount() {

    }

    getOrders() {
        
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell align="center">Code</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Users</TableCell>
                    <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                    <TableRow key={row.code}>
                        <TableCell component="th" scope="row">
                        {row.code}
                        </TableCell>
                        <TableCell align="right">{row.code}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell align="right">{row.users}</TableCell>
                        <TableCell align="right">
                            <Button size="large" variant="contained" style={{backgroundColor: 'red', color: '#FFFFFF'}} >{"Remove"}</Button>{row.actions}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            );
    }
}

const translatedOrders = withTranslation('')(Orders);
export default withStyles(styles)(translatedOrders);