import React from 'react';

import {useTranslation} from "react-i18next";

import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import translations from './TranslationKeys';
import { ToFirstCapitalLetter } from './Utils';

export default function TranslationSelection()
{
    const { i18n, t } = useTranslation();
    
    const availableLanguages = [
        {
            key: 'en',
            value: 'English'
        },
        {
            key: 'it',
            value: 'Italiano'
        },
    ];
    
    const [language, setLanguage] = React.useState(i18n.language);

    return <div>
        <FormControl variant="filled">
            <InputLabel id="translationsSelectLabel">{ToFirstCapitalLetter(t(translations.language))}</InputLabel>
            <Select
                labelId="translationsSelectLabel"
                id="translationsSelect"
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