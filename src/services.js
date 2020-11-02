exports.generateAuthCodeUrl = function (client_id, scope, redirect_uri, response_type) {

    var authURL = "https://accounts.google.com/o/oauth2/v2/auth?" +
        "client_id=" + client_id +
        "&scope=" + scope +
        "&redirect_uri=" + redirect_uri +
        "&response_type=" + response_type;

    //redirect to consent page
    return authURL;  
};

// exports.getAccessToken = function (x) {
//     var postDataUrl = 'https://www.googleapis.com/oauth2/v4/token?' +
//         'code=' + x +  //auth code received from the previous call
//         '&client_id=' + client_id +
//         '&client_secret=' + client_secret +
//         '&redirect_uri=' + redirect_uri +
//         '&grant_type=' + "authorization_code"

//     var options = {
//         uri: postDataUrl,
//         method: 'POST'
//     };

//     request(options, function (err, res, body) {
//         return body; //returns an object with an access token!!!
//     });
// };