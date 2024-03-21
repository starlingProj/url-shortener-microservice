require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const URL = require("url").URL;
const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const originalUrls = [];
const shortUrls = [];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const foundIndex = originalUrls.indexOf(url);
  if (!stringIsAValidUrl(url)) {
    return res.json({ error: "invalid url" });
  }
  if (foundIndex < 0) {
    originalUrls.push(url);
    shortUrls.push(shortUrls.length);
    console.log(shortUrls, originalUrls);

    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1,
    });
  }

  return res.json({
    original_url: url,
    short_url: shortUrls[foundIndex],
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundIndex = shortUrls.indexOf(id);
  if (foundIndex < 0) {
    return res.json({
      error: "No short URL found for the given input",
    });
  }
  res.redirect(originalUrls[foundIndex]);
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
