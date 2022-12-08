import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import World from './World';
import Login from './Login';

function App() {
  const [token, setToken] = useState('');
  
  const updateToken = (data) =>{
    setToken(data);
  }
  return (
    <>
      {(token === '') ? <Login callBack={updateToken}/> : <World token={token}/>}
    </>
  );
}

export default App;
