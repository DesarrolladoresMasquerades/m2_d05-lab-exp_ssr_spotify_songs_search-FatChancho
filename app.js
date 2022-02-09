require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
    

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/artist-search',(req,res)=>{
    const search = req.query.searchArtist;   
    
spotifyApi
  .searchArtists(search)
  .then(data => {
    res.render('artist-search-results',{artist:data.body.artists.items});    
    //console.log(data.body.artists.items);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id',(req,res)=>{
    const id = req.params.id;
   
    spotifyApi
    .getArtistAlbums(id)
    .then((data)=>{
        res.render('albums',{albums:data.body.items})
    })
})

app.get('/tracks/:id',(req,res)=>{
    const idTrack=req.params.id;

    spotifyApi
    .getAlbumTracks(idTrack)
    .then((tracks)=>{
        res.render('tracks',{tracks: tracks.body.items})
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
