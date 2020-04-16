const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");

const app = express();

const api_key = "e2adc745b9b69d054d7cec20d6f1b0eb-us4";
const list_id = "ebc88ce686";

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/success.html"));
});

app.get("/failure", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/failure.html"));
});

app.post("/signup", (req, res) => {
  const { fname, lname, email } = req.body;

  // Make sure fields are filled
  if (!fname || !lname || !email) {
    res.redirect("/failure.html");
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  const options = {
    url: `https://us4.api.mailchimp.com/3.0/lists/${list_id}`,
    method: "POST",
    headers: {
      Authorization: `auth ${api_key}`,
    },
    body: postData,
  };

  request(options, (err, response, body) => {
    if (err) {
      console.log(err);
      res.redirect("/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        console.log(response.statusCode);
        res.redirect("/failure.html");
      }
    }
  });
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
