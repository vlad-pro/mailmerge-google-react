import React, {useState, useEffect} from "react";
import "./App.css";
import { 
  generateAuthCodeUrl, 
  getAccessToken, 
  copyGoogleDoc, 
  batchUpdate
} from "./services";


export function App2() {
  const [to_name, setTo_name] = useState("");
  const [to_title, setTo_title] = useState("");
  const [to_company, setTo_company] = useState("");
  const [to_address, setTo_address] = useState("");

  useEffect(()=> {
    function handleSubmit(event) {
      alert("The following was submitted: " + this.state.to_title);
      event.preventDefault();
    }
  })

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="to_name"
              onChange={setTo_name}
              // placeholder="Name of the recipient"
            />
          </label>

          <label>
            Title:
            <input
              type="text"
              name="to_title"
              onChange={setTo_title}
              // placeholder="Title of the recipient"
            />
          </label>

          <label>
            Title:
            <input
              type="text"
              name="to_company"
              onChange={setTo_company}
              // placeholder="Company of the recipient"
            />
          </label>

          <label>
            Address:
            <input
              type="text"
              name="to_address"
              onChange={setTo_address}
              // placeholder="Address of the recipient"
            />
          </label>

          <input type="submit" value="Submit" />
        </form>

        <button onClick={this.mailMerge}>Create Document From Template</button>
        <button onClick={this.urlDisplay}>display url</button>
      </div>
    );
}


export class App extends React.Component {
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
    this.setState({ [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    alert("The following was submitted: " + this.state.to_title);
    event.preventDefault();
  }

  mailMerge() {
    const authURL = generateAuthCodeUrl();
    console.log(authURL);
    window.location.assign(authURL);
  }

  urlDisplay() {
    console.log(window.location.search);
  }

  async componentDidMount() {
    // const code =
    // console.log("Hello")
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code")
    if (code) {
      console.log("Gotcha");
      console.log(code);
      const access_token = await getAccessToken(code)
      console.log("access token: " + access_token)    
      if (access_token) {
        const copy_id = await copyGoogleDoc(access_token)
        console.log("copy id: " + copy_id)
        if (copy_id){
          const status = await batchUpdate(copy_id, access_token)
          console.log("Merged document status: " + status)
          if (status === 200) {
            window.open(
              "https://docs.google.com/document/d/" + copy_id + "/edit",
               "_blank")
          }
        } else {
            console.log("copy does not work")
        }
      } else {
          console.log("no access_token")
      }    
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
              name="to_name"
              onChange={this.handleChange}
              // placeholder="Name of the recipient"
            />
          </label>

          <label>
            Title:
            <input
              type="text"
              name="to_title"
              onChange={this.handleChange}
              // placeholder="Title of the recipient"
            />
          </label>

          <label>
            Title:
            <input
              type="text"
              name="to_company"
              onChange={this.handleChange}
              // placeholder="Company of the recipient"
            />
          </label>

          <label>
            Address:
            <input
              type="text"
              name="to_address"
              onChange={this.handleChange}
              // placeholder="Address of the recipient"
            />
          </label>

          <input type="submit" value="Submit" />
        </form>

        <button onClick={this.mailMerge}>Create Document From Template</button>
        <button onClick={this.urlDisplay}>display url</button>
      </div>
    );
  }
}
