import React from 'react';

function Login(props) {
    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <img alt="Spotify logo" className='spotify-logo' src={require('./assets/spotify_logo_white.png')}/>
                    <h2>VR</h2>
                </div>
            </header>
            <div className='main'>
                <button onClick={() => 
                    {
                        props.callBack("Token")
                    }}>Login with Spotify </button>
            </div>
        </div>
    );
}

export default Login;