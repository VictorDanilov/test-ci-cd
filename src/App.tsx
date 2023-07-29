import React from 'react';
import logo from './logo.svg';
import './App.css';

class foo {}

function App() {
  const some = 'some';

  return (
    <div className="App">
      <header className="App-header">
        <>
          <div>Some</div>
        </>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div></div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
