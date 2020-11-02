import React, { Fragment } from "react";
import "./App.css";
import axios from "axios";

const client_id =
  "";
const client_secret = "";
const scope = "https://www.googleapis.com/auth/drive";
const redirect_uri = "http://localhost:3000";
const response_type = "code";

const generateAuthCodeUrl = function () {
  var authURL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    "client_id=" + client_id +
    "&scope=" + scope +
    "&redirect_uri=" + redirect_uri +
    "&response_type=" + response_type;

  //redirect to consent page
  return authURL;
};

const getAccessToken = function (x) {
      var postDataUrl = 'https://www.googleapis.com/oauth2/v4/token?' +
          'code=' + x +  //auth code received from the previous call
          '&client_id=' + client_id +
          '&client_secret=' + client_secret +
          '&redirect_uri=' + redirect_uri +
          '&grant_type=' + "authorization_code"

      axios.post(postDataUrl)
      .then((response) => {
        return response.data.access_token;
      }, (error) => {
        console.log(error);
      })
  };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to_name: "",
      to_title: "",
      to_company: "",
      to_address: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      to_name: event.target.to_name,
      to_title: event.target.to_title,
      to_company: event.target.to_company,
      to_address: event.target.to_address,
    });
  }

  handleSubmit(event) {
    alert("A name was submitted: " + this.state.to_name);
    event.preventDefault();
  }

  MailMerge() {
    const authURL = generateAuthCodeUrl();
    console.log(authURL);
    window.location.assign(authURL);
  }

  UrlDisplay() {
    console.log(window.location.search);
  }

  componentDidMount() {
    // const code =
    // console.log("Hello")
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code")
    if (code) {
      console.log("Gotcha");
      console.log(code);
      getAccessToken(code)
    } else {
      console.log("code not in query string");
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={this.state.to_name}
              onChange={this.handleChange}
              // placeholder="Name of the recipient"
            />
          </label>

          <label>
            Title:
            <input
              type="text"
              value={this.state.to_title}
              onChange={this.handleChange}
              // placeholder="Title of the recipient"
            />
          </label>

          <label>
            Title:
            <input
              type="text"
              value={this.state.to_company}
              onChange={this.handleChange}
              // placeholder="Company of the recipient"
            />
          </label>

          <label>
            Address:
            <input
              type="text"
              value={this.state.to_address}
              onChange={this.handleChange}
              // placeholder="Address of the recipient"
            />
          </label>

          <input type="submit" value="Submit" />
        </form>

        <button onClick={this.MailMerge}>Copy file</button>
        <button onClick={this.UrlDisplay}>display url</button>
      </div>
    );
  }
}

export default App;
