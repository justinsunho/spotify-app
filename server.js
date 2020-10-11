let express = require("express");
let request = require("request");
let querystring = require("querystring");
let path = require("path");
require("dotenv").config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";
const FRONTEND_URI = process.env.FRONTEND_URI || "http://localhost:3000";

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/login", function (req, res) {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: "user-read-private user-read-email",
        redirect_uri: REDIRECT_URI,
      })
  );
});

app.get("/callback", function (req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
          "base64"
        ),
    },
    json: true,
  };
  request.post(authOptions, function (error, response, body) {
    var access_token = body.access_token;
    let uri = FRONTEND_URI;
    res.redirect(uri + "?access_token=" + access_token);
  });
});

app.listen(process.env.PORT || 8888);
