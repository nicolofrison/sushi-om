import React, {Suspense} from 'react';
import './App.css';
import SignUp from './SignUp/SignUp';
import TranslationSelection from './Utils/TranslationSelection';

function App() {
  return (
    <Suspense fallback="loading">
      <div className="App">
        <header className="App-header">
          <TranslationSelection />
          <SignUp />
        </header>
      </div>
    </Suspense>
  );
}

export default App;
