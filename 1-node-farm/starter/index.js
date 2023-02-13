//file system
const fs = require('fs');

//http: required to create a server
const http = require('http');

const path = require('path');

//url; required to parse and access the url properties
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate')



//reading files outside the server loop so that files are only loaded once
//only the code inside the server is run again and again on each request
const tmpOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tmpProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tmpCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
//dataOnj is an array of objects containing the data about our project
const dataObj = JSON.parse(data);


//this is the server, which keeps running and listening to the requests from client
const server = http.createServer((req,res) => {
    //destructuring query and pathname from url after parsing the url.
    const { query, pathname } = url.parse(req.url, true);
    
    //'/' or '/overview' endpoint renders the homepage of the app
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});
        
        //map function runs the replaceTemplate function for each dataObj which is the data about our products
        const cardsHtml = dataObj.map(el => replaceTemplate(tmpCard,el)).join('');
        const output = tmpOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        
        res.end(output);
    }
    //renders the product page containing the information of each product
    else if(pathname === '/product'){
        const product = dataObj[query.id]
        const productHtml = replaceTemplate(tmpProduct,product)
        
        //writeHead is used to provide the headers for our page
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(productHtml);
    }
    else if(pathname === '/api'){
        console.log(data)
        res.end(dataObj);
    }
})


//the server is lisetning on port 5000. port is a virtual point where a network connection starts and end.
server.listen(5000);