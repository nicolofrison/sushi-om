import React, {Suspense} from 'react';

import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';

import './App.css';
import Orders from './Orders/Orders';
import SignUp from './SignUp/SignUp';
import TranslationSelection from './Utils/TranslationSelection';
import UserUtils from './Utils/UserUtils';

const theme = createMuiTheme();

const useStyles = makeStyles((theme) => {
  root: {
    // some css that access to theme
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback="loading">
        <div className="App">
          <header className="App-header">
            <TranslationSelection />
            <Content />
          </header>
        </div>
      </Suspense>
    </ThemeProvider>
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
