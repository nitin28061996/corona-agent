
const express = require('express');
const app = express();
const cors = require('cors');
const ngrok = require('ngrok');
// const puppeteer = require('puppeteer');
const axios = require('axios');
const jp = require('jsonpath');
app.use(cors());

let bingData;
let lastFetched;

app.get('/api/data/:place', async (req, res) => {
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
    const months = ["JANUARY", "FEB", "MARCH","APRIL", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];


    data = data.split('var data=')
    bingData = JSON.parse(data[1].replace(';</script></div></body></html>', ''));
    lastFetched = new Date();
    //filterdata= bingData.filter(id= "hyderabad_telangana_india")
    console.log("hi");
    var query='$..[?(@.displayName == '+JSON.stringify(req.params.place)+')]';
    var response_text=jp.query(bingData, query)
   
console.log(response_text[0].parentId)
    var death=response_text[0].totalDeaths===null?0:response_text[0].totalDeaths;
   
    var date=new Date(response_text[0].lastUpdated);
    //console.log(date.getDate()+" "+ months[date.getMonth()]+" "+date.getFullYear())
    res.json(response_text);
  } else {
      console.log("hi"+ req.params.place);
      
      var query='$..[?(@.displayName == '+JSON.stringify(req.params.place)+')]';
      var response_text=jp.query(bingData, query)
      res.json(response_text);
  }
});

app.listen(5000,()=>{
console.log(`Application listen on PORT 5000`);
(async function(){
    const endPoint=await ngrok.connect(5000);
    console.log("hello")
    console.log(endPoint)
})
})


/* 'use strict';

const dialogflow = require('dialogflow');

// Read in credentials from file. To get it, follow instructions here, but
// choose 'API Admin' instead of 'API Client':
// https://dialogflow.com/docs/reference/v2-auth-setup
const credentials = require('./corona-agent-1c2d2-79469dafb34f.json');

const entitiesClient = new dialogflow.EntityTypesClient({
 credentials: credentials,
});

const projectId = 'corona-agent-1c2d2';
const agentPath = entitiesClient.projectAgentPath(projectId);

const cityEntityType = {
  displayName: 'city',
  kind: 'KIND_MAP',
  entities: [
    {value: 'New York', synonyms: ['New York', 'NYC']},
    {value: 'Los Angeles', synonyms: ['Los Angeles', 'LA', 'L.A.']},
  ],
 };

 const cityRequest = {
  parent: agentPath,
  entityType: cityEntityType,
 };
 
entitiesClient
  .createEntityType(cityRequest)
  .then((responses) => {
    console.log('Created new entity type:', JSON.stringify(responses[0])) }); */

