import React, { Fragment } from "react";
import "./App.css";


class App extends React.Component {

  insertGapiScript() {
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      this.initializeGoogleSignIn()
    }
    document.body.appendChild(script)
  }

  initializeGoogleSignIn() {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: '684724213484-72gd2862k8e6c2r73eshl3771j68u5a2.apps.googleusercontent.com'
      })
      console.log('Api inited')

      window.gapi.load('signin2', () => {
        const params = {
          onsuccess: () => {
            console.log('User has finished signing in!')
          }
        }
        window.gapi.signin2.render('loginButton', params)
      })
    })
  }

  componentDidMount() {
    console.log('Loading')

    this.insertGapiScript();
  }

  signOut(){


  }


  render() {
    return (
      <div className="App">
        <h1>Google Login Demo</h1>
        <a id="loginButton" on>Sign in with Google</a>
        <button onClick="signOut()"/>
      </div>
    );
  }
}

export default App;