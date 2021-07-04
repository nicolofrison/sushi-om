import React from 'react';

import {useTranslation} from "react-i18next";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { InputLabel, Select, MenuItem, FormControl } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

export default function TranslationSelection()
{
    const classes = useStyles();
    const { i18n } = useTranslation('common');
    
    const availableLanguages = [
        {
            key: 'en',
            value: 'english'
        },
        {
            key: 'it',
            value: 'italian'
        },
    ];
    
    const [language, setLanguage] = React.useState(i18n.language);

    return <div>
        <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={language}
                onChange={(event) => {
                    const newLanguage = event.target.value as string;
                    i18n.changeLanguage(newLanguage);
                    setLanguage(newLanguage);
                }}
                >
                {availableLanguages.map(l => <MenuItem key={l.key} value={l.key}>{l.value}</MenuItem>)}
            </Select>
        </FormControl>
    </div>
}