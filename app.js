/* var express = require('express'); 
var app = express();
const fetch = require("node-fetch");
const url = "https://www.trackcorona.live/api/countries/in";  //fetch
const getData = async url => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json.data[0].location)
         return json
    } catch(e){
        console.log("error")
    }  
}

// 'https://www.trackcorona.live/api/countries/in' 

app.get('/', async (req, res)=> {
data= await getData(url)
console.log(data.code)
res.send(data);

  
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
}); 
 */
const express = require('express');
const app = express();
const cors = require('cors');
// const puppeteer = require('puppeteer');
const axios = require('axios');

app.use(cors());

let bingData;
let lastFetched;

app.get('/api/data', async (req, res) => {
  const hr = 1000 * 60 * 60;
  if (!bingData || (lastFetched && new Date(lastFetched.getTime() + hr) < (new Date()))) {
    // const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    // const page = await browser.newPage();
    // await page.goto('https://bing.com/covid');
    // const [response] = await Promise.all([
    //   page.waitForResponse(response => response.url().includes('/covid/data')),
    // ]);
    // const dataObj = await response.json();
    let { data } = await axios.get('https://bing.com/covid');
    data = data.split('var data=')
    bingData = JSON.parse(data[1].replace(';</script></div></body></html>', ''));
    lastFetched = new Date();
    filterdata= bingData.filter(d=> d.id== "hyderabad_telangana_india")
    res.json(bingData);
  } else {
    res.json(bingData)
  }
});

app.listen(process.env.PORT || 5000);