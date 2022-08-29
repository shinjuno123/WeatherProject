const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const cityName = req.body.cityName;
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${}`;
  https.get(geoUrl, function (geoResponse) {
    geoResponse.on("data", function (geoData) {
      const parsedData = JSON.parse(geoData)[0];
      const lat = parsedData.lat;
      const lon = parsedData.lon;
      const unit = "metric";

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${}&units=${unit}`;

      https.get(url, function (response) {
        response.on("data", function (data) {
          const weatherData = JSON.parse(data);
          const temp = weatherData.main.temp;
          const weatherDescription = weatherData.weather[0].description;
          const icon = weatherData.weather[0].icon;
          const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

          res.write(`<img src="${imageURL}" alt="weather image">\n`);
          res.write(`<p>The weather is currently ${weatherDescription} </p>\n`);
          res.write(
            `<h1>The temperature in ${cityName} is ${temp} degrees Celcius</h1>`
          );
          res.send();
        });
      });
    });
  });
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
