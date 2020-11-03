import React from "react";
import "./App.css";
import axios from "axios";

// authorization secrets
const client_id =process.env.REACT_APP_CLIENT_ID;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;

// authorization constants
const scope = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents";
const redirect_uri = "https://awesome-goldstine-486944.netlify.app";
const response_type = "code";

// application constants
const DOCS_FILE_ID = "10Ob_wgq4QEp8eNZwb_ei2sSTPrQgEHcnCsa4S4e4ndE";

// data/body for mailMerge call
const body = {
  "requests": [
    {
      replaceAllText: {
        containsText: {
          text: '{{MY_NAME}}',
          matchCase: true,
        },
        replaceText: "Ms. Lara Brown",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{MY_ADDRESS}}',
          matchCase: true,
        },
        replaceText: "360 South Maple Drive,\nBeverly Hills,\nCalifornia 90212",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{MY_PHONE}}',
          matchCase: true,
        },
        replaceText: "+1(234) 567-8910",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{MY_EMAIL}}',
          matchCase: true,
        },
        replaceText: "lara@borrowlabs.com",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{DATE}}',
          matchCase: true,
        },
        replaceText: "2020-11-11",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{TO_NAME}}',
          matchCase: true,
        },
        replaceText: "Ms. John Dow",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{TO_TITLE}}',
          matchCase: true,
        },
        replaceText: "Appraiser",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{TO_COMPANY}}',
          matchCase: true,
        },
        replaceText: "Best South Appraisal",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{TO_ADDRESS}}',
          matchCase: true,
        },
        replaceText: "939 Plam Drive,\nIrvine,\nCalifornia 80404",
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: '{{BODY}}',
          matchCase: true,
        },
        replaceText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
    },
  ]
}

const generateAuthCodeUrl = function () {
  var authURL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    "client_id=" + client_id +
    "&scope=" + scope +
    "&redirect_uri=" + redirect_uri +
    "&response_type=" + response_type;

  // use this url to redirect user to consent page
  return authURL;
};

// Get AuthToken from google
const getAccessToken = async (x) => {
      var postDataUrl = 'https://www.googleapis.com/oauth2/v4/token?' +
          'code=' + x +  //auth code received from the previous call
          '&client_id=' + client_id +
          '&client_secret=' + client_secret +
          '&redirect_uri=' + redirect_uri +
          "&grant_type=" + 
          "authorization_code";

      return await axios.post(postDataUrl)
      .then((response) =>  response.data.access_token)

  };

const copyGoogleDoc = async (token) => {
  var copyDocUrl = "https://www.googleapis.com/drive/v3/files/" + DOCS_FILE_ID + "/copy";

  return await axios.post(copyDocUrl,null,{
    headers:{
      "Content-type": "application/json",
      "Authorization": "Bearer " + token
    }
  })
  .then(response =>  response.data.id);
}

const batchUpdate = async (doc_id, token) => {
  var batchDocUrl = "https://docs.googleapis.com/v1/documents/" + doc_id + ":batchUpdate"
  
  return await axios.post(batchDocUrl, body,{
    headers:{
      "Content-type": "application/json",
      "Authorization": "Bearer " + token
    }
  })
  .then(response =>  response.status);
}

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
      console.log("Code Acquired");
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

        <button onClick={this.mailMerge}>Create new document from the template</button>
        {/* <button onClick={this.urlDisplay}>Display Url</button> */}
      </div>
    );
  }
}

export default App;
