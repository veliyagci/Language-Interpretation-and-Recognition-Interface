// requirements npm etc.
require("dotenv").config();

var keys = require("./keys.js"); 
var axios = require('axios');
var Spotify = require('node-spotify-api');
var moment = require("moment")
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

// commands of main liri.js app
var runLiriCommand = function(command, query='') {
switch (command) {
    case 'spotify-this-song': 
        searchSongs(query);
        break;
    case 'concert-this':
        searchConcerts(query);
        break;
    case 'movie-this':
        searchMovies(query);
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
        console.log("Unsupported command: please enter `spotify-this-song`, `concert-this, ...")  // add rest of the commands here
    }
};

// function for searching songs (spotify-this-song)
function searchSongs(songName) {
    // make a request to spotify API
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error connecting to spotify: ' + err);
            return;
        }
        var nameOfTheArtist = function(artist) {
            return artist.name;
     };
         
        // formatting the data properly
       
        var songs = data.tracks.items;
        var data = [];

        for (var i = 0; i < songs.length; i++) {
          songs = [
          "Artist(s): " + songs[i].artists.map(nameOfTheArtist),
          "Name of the Song: " + songs[i].name,
          "Preview of the Song: " + songs[i].preview_url,
          "Album: " + songs[i].album.name,
          "*****"]

          //write `command,query` into file anytime you call 'spotify-this', 'concert-this', ...
        fs.appendFile("log.txt", JSON.stringify(songs[i]) + "\n" , function(err){
            console.log(songs)
            if(err) throw err; 
          });
        }
    });
}

// function for searching concerts (concert-this)
function searchConcerts(artist) {
    // make a resquest to search for concerts using this URL
    var urlBands = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    // add
    axios.get(urlBands).then(function(res) {
        
        jsonData = res.data;
         
        var date = moment(jsonData[0].datetime),
        // formatting the data
        data = [
        "Artist :" + jsonData[0].lineup,
        "Country: " + jsonData[0].venue.country,
        "Date: " + date.format("YYYY-MM-DD HH:mm"),
        "City: " + jsonData[0].venue.city]
        
        //write `command,query` into file anytime you call 'spotify-this', 'concert-this', ...
        for (var i = 0; i < data.length; i++) {
            console.log(data[i])
            fs.appendFile("log.txt", JSON.stringify(data[i]) + "\n---------------------------\n" , function(err) {
                if(err) throw err; 
            });
        }
    });
}

//function for searching movies (movie-this)
function searchMovies(movieName) {
    // make a resquest to search for concerts using this URL
    var urlOmdb = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    //add
    axios.get(urlOmdb).then(function(res) {
        
    var jsonData = res.data
    
    // formatting the data 
    data = [
      "Title: " + jsonData.Title,
      "Year: " + jsonData.Year,
      "Rated: " + jsonData.Rated,
      "IMDB Rating: " + jsonData.imdbRating,
      "Country: " + jsonData.Country,
      "Language: " + jsonData.Language,
      "Plot: " + jsonData.Plot,
      "Actors: " + jsonData.Actors,
      "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value]
    
      //write `command,query` into file anytime you call 'spotify-this', 'concert-this', ...
      for (var i = 0; i < data.length; i++) {
          console.log(data[i])
          fs.appendFile("log.txt", JSON.stringify(data[i]) + "\n------------------------\n" , function(err){
              if(err) throw err; 
          });
      }
  });
}

//function for supporting `do-what-it-says`
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);

      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        runLiriCommand(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        runLiriCommand(dataArr[0]);
        
    fs.appendFile("log.txt", JSON.stringify(dataArr) + "\n" , function(err){
            if(err) throw err; 
        });
    }
  });
};

const liriCommand = process.argv[2];
const userQuery = process.argv.slice(3).join("+");
runLiriCommand(liriCommand, userQuery);
