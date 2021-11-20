import { Suspense } from 'react';

import './App.css';
import Orders from './Orders/Orders';
import SignUp from './SignUp/SignUp';
import TranslationSelection from './Utils/TranslationSelection';
import UserUtils from './Utils/UserUtils';
import TopAlert from './Utils/TopAlert';
import { Grid } from '@mui/material';

function App() {
  return (
    <Suspense fallback="loading">
      <TopAlert />
      <div className="App">
        <Grid container alignItems="flex-start" rowSpacing={1} sx={{ margin: "5px" }}>
          <Grid item xs={12} container justifyContent="flex-end">
            <TranslationSelection />
          </Grid>
          <Grid item xs={12}>
            <Content />
          </Grid>
        </Grid>
      </div>
    </Suspense>
  );
}

function Content() {
  if (UserUtils.IsLoggedIn()) {
    return <Orders />;
  } else {
    return <SignUp />;
  }
}

export default App;
