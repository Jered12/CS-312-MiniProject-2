//imprt express.js
import express from "express";
//import axios
import axios from "axios";
//import body parser
import bodyParser from "body-parser";

//initilize the express application
const app = express();

//local host server
const port = 3512;

//set ejs as the emplating engine so that .ejs files render
app.set("view engine", "ejs");
//midleware which allows data to be parsed
app.use(bodyParser.urlencoded({ extended: true }));
//serve static files from the public diconary (the css files)
app.use(express.static("public"));

// use get for the home page  which is the index.ejs
app.get("/", (req, res) => 
{
  res.render("index", { error: null });
});

// when the post is submitted go to results
app.post("/results", async (req, res) => 
{
  // initialize coin to null
  let coin = null;

  // check if req.body.coin exists AND has length bigger thn 1
  if (req.body.coin && req.body.coin.length >= 1) 
  {
    // remove leading and trailing spaces with trim
    coin = req.body.coin.trim();
    
    // make the coin lowecase
    coin = coin.toLowerCase();
  }
  //if there was no coin given or its empty
  if (coin === null || coin === "") 
  {
    //go to results and 
    return res.render("results", 
    {
      //give error messg with no coin or proce diaplay
      error: "Enter a cryptocurrency",
      coin: null,
      price: null
    });
  }

  try 
  {
    //firtsly get a get request to the coinPaprika API
    const response = await axios.get(`https://api.coinpaprika.com/v1/tickers/${coin}`);
    //store the coin 
    const data = response.data;
    //get the price from the API
    const price = data.quotes.USD.price;
    // get metadata for the logo
    const metaResponse = await axios.get(`https://api.coinpaprika.com/v1/coins/${coin}`);
    //store the data into meta
    const meta = metaResponse.data;
    //put the lpgo in logo variable
    const logo = meta.logo; 


    //and give the results
    res.render("results", 
    {
      //with no error but with the name and price with 2 decimal points and logo
      error: null,
      coin: data.name,
      price: price.toFixed(2),
      logo: logo
    });
  } 
  catch (err) 
  {
    //anything else give an error msg with no coin or price
    console.error(err.message);
    res.render("results", 
    {
      error: "Enter a cryptocurrency",
      coin: null,
      price: null,
      logo: null

    });
  }

});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

