import React, {Suspense} from 'react';
import './App.css';
import Orders from './Orders/Orders';
import SignUp from './SignUp/SignUp';
import TranslationSelection from './Utils/TranslationSelection';

function App() {
  let loggedIn = false;
  if (localStorage.getItem("userId")) {
    loggedIn = true;
  }

  return (
    <Suspense fallback="loading">
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
  if (localStorage.getItem("user")) {
    return <Orders />;
  } else {
    return <SignUp />;
  }
}

export default App;
