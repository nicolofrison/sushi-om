import { Suspense } from 'react';

import './App.css';
import Orders from './Orders/Orders';
import SignUp from './SignUp/SignUp';
import TranslationSelection from './Utils/TranslationSelection';
import UserUtils from './Utils/UserUtils';
import TopAlert from './Utils/TopAlert';

function App() {
  return (
    <Suspense fallback="loading">
      <TopAlert />
      <div className="App">
        <header className="App-header">
          <TranslationSelection />
          <Content />
        </header>
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
