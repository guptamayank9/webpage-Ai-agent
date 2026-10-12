import dotenv from 'dotenv'
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from "openai";
//jis bhi website ko scrape
//  krnea hai uske liye url de dena
const openai = new OpenAI();
dotenv.config();

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

async function generateVectorEmbeddings({ text}) {

    //we use openai vector emdedding
   
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: text,
  encoding_format: "float",
});

return embedding.data[0].embedding;

}
//yha m=pass maxt oke hai pura apn bahut bada pagae 
// load nhi kr skte hai -- wrong thing
//we split the pagebody

//ingest url lega or simple url ko scrape
//  krega emidbeeing karga or chromadb me store krga

async function ingest(url = '') {

    const {head, body, internalLinks } = await scrapeWebpage(url);
    const bodyChunks = chunkText(body, 2000);

    //embedding create
    const headEmbedding = await generateVectorEmbeddings({text: head});

    //body ke text itan bada nhi rkh skte isse solit krnge
    //chtagpt se puchenge
    // Write a JS FUNCTION to get text as string and chunk it in given sizze tokens

    //body ke chunks bna leta hu d
    for(const chunk of bodyChunks){
        
      const bodyEmbedding = await generateVectorEmbeddings({text: chunk});
    }
    //now store in chroma db



}


}
scrapeWebpage('https://gupta-mayank.netlify.app').then(console.log);


function chunkText(text, chunkSize) {

  if(!text || chunkSize <=0) return [];

  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(encoding.decode(words.slice(i, i + chunkSize)));
  }

  return chunks;
}