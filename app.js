const express = require('express');
const bodyParser = require('body-parser');
const validURL = require('valid-url');
const SearchTerm = require('./models/SearchTerm');

const request = require('request-promise')
const jsdom = require('jsdom');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/app/index.html');
});


app.get("/api/latest/imagesearch", (req, res) => {
  SearchTerm.getSearchTerms((err, terms) => {
    if(err){
      res.json('An error has occurrrrrrrrred..d..d..dd');
    }
    else{
      res.json(terms.map(term => { return { term: term.term, when: term.when } }).reverse());
    }
  })
});


const youtubeApiReq = ( term, pageToken ) => {
  console.log(pageToken);
  return `https://content.googleapis.com/youtube/v3/search?q=${term}${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=10&part=snippet&key=${process.env.API_KEY}`;
}


/** This function is the result of trying to paginate based on only getting the 
    'nextPageToken' from each request to youtube's search api 
    ....(i.e youtube search doesn't support pagination in the way the project specifies). 
    We basically have to keep making calls until we get to the page we want i.e the offset 
**/
const makeCalls = async ( i, pageToken, req) => {
    if( i < 2 ) {
      console.log('Final:', pageToken);
      return request(youtubeApiReq(req.params.term, pageToken ));
    }
    console.log(pageToken);
    return await request(youtubeApiReq(req.params.term, pageToken))
       .then(vids => JSON.parse(vids))
       .then(vids => makeCalls(i-1, vids.nextPageToken, req));
}

app.get('/api/imagesearch/:term', (req, res) => {
   if(req.query.offset && (req.query.offset < 1 || req.query.offset > 30)) {
     res.json('Invalid offset, has to be greater than 0 and less than 30.')  
   }
   let dbSearchTerm = new SearchTerm();
   dbSearchTerm.term = req.params.term;
   dbSearchTerm.save();
   makeCalls(req.query.offset, '', req).then(videos => JSON.parse(videos).items.map(video => { 
       console.log(video);
       return {
         url: video.snippet.thumbnails.high.url,
         snippet: video.snippet.title,
         context: `https://youtube.com/watch?v=${video.id.videoId}`
       }; 
     }))
    .then(vids => res.json(vids));
  
 /** This was the old way involving, page scraping..
         I stopped with this when I wasn't sure how to paginate a scrapped page so i just went with using the youtube api. **/
  
 /**request(`https://www.youtube.com/results?search_query=${req.params.term}`).then(html => {
         const virtualConsole = new jsdom.VirtualConsole();
         const dom = new jsdom.JSDOM(html, {
           virtualConsole
         });
         const $ = require('jquery')(dom.window);
         const vids = $('.yt-lockup.yt-lockup-tile.yt-lockup-video.vve-check.clearfix')

         res.json($.makeArray(vids.map((i, item) => { 
           return {
             url: $(item).find('img').attr('src'),
             snippet: $(item).find('a[title]').html(),
             context: 'https://youtube.com'+$(item).find('a[href]').attr('href')
           }
        }).slice(1)));
   }); **/
})

module.exports = app;