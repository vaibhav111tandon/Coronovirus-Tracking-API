const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

const url = 'https://www.worldometers.info/coronavirus/';

const fetchData = async () => {
    const result = await axios.default.get(url);
    return cheerio.load(result.data);
}

const covidData = [];

const getData = async () => {
    const $ = await fetchData();
    $('#main_table_countries > tbody > tr').each((index, element) => {
        // console.log($($(element).find('td')[0]).text());
        
        const head = $(element).find('td');

        const country = $(head[0]).text().trim();
        const totalCases = $(head[1]).text().trim();
        const newCases = $(head[2]).text().trim();
        const totalDeaths = $(head[3]).text().trim();
        const newDeaths = $(head[4]).text().trim();
        const totalRecovered = $(head[5]).text().trim();
        const activeCases = $(head[6]).text().trim();
        const critical = $(head[7]).text().trim();

        const caseRow = { country, totalCases, newCases, totalDeaths, newDeaths, totalRecovered, activeCases, critical };

        covidData.push(caseRow);
        
    });
}


app.listen(PORT, () => {
    console.log('LISTENING AT PORT : ', PORT);
});

app.get('/',async (req, res) => {
    await getData();
    console.log(covidData);
    res.send(covidData);
})