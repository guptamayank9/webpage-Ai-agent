import axios from 'axios';
import * as cheerio from 'cheerio';

//jis bhi website ko scrape
//  krnea hai uske liye url de dena

async function scrapeWebpage(url = '') {
    //html aa gya 
    const {data} = await axios.get(url);

    const $ = cheerio.load(data);
   //for page head
    const pageHead = $('head').html();
    //for page body
    const pageBody = $('body').html();

    //for links ke laane ke liye we use this
    const  internalLinks = []
    const externalLinks = []

    $('a').each((_, el)=>{

        const link = $(el).attr('href');
        if(link === '/') return;
        if(link.startsWith('http') || link.startsWith('http')){
            externalLinks.push(link);
        }else{
            internalLinks.push(link);
        }
    });

    return {head:pageHead, body:pageBody, internalLinks, externalLinks };


f//vectors conevert by useing head data

async function generateVectorEmbeddings({url, head, body}) {

    //we use openai vector emdedding
    
}





}
scrapeWebpage('https://gupta-mayank.netlify.app').then(console.log);