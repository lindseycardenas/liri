
//Requiring all node packages...
const dotenv = require("dotenv").config();
const fs = require("fs");
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const request = require("request");
const moment = require("moment");


//Storing Spotify keys
const spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//Creating a divider for log.txt file to follow appends
const divider = "\n------------------------------------------------------------\n\n";


//Storing values from command line into a command and value
var command = process.argv[2];
var value = process.argv.slice(3).join(" ");


//Switch Case for Commands
switch (command) {
    case "concert-this":
        concertCall();
        break;

    case "spotify-this-song":
        songCall();
        break;

    case "movie-this":
        movieCall();
        break;

    case "do-what-it-says":
        randomCall();
        break;
}


//concertCall function
function concertCall() {

    const queryURL = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";

    request(queryURL, function (err, response, body) {
        if (err) {
            throw err;
        }

        response = JSON.parse(body)[0];

        concertInfo = `Venue name: ${response.venue.name}\n
                       Venue location: ${response.venue.city}, ${response.venue.country}\n
                       Date of Event: ${moment(response.datetime).format("MM/DD/YYYY")}\n
                       ${divider}`;

        if (response.venue == "undefined") {
            console.log("Looks like this band isn't playing any time soon. 😕")
        }

        console.log(concertInfo, "Concert Information");

        fs.appendFile('log.txt', concertInfo, function (err) {
            if (err) throw err;
            console.log('File appended');

        })
    });
}

//Spotify call
function songCall() {

    if (value == undefined) {
        return value = "The sign by Ace of Base";
    }

    spotify.search({ type: 'track', query: value }, (err, data) => {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
        var response = data.tracks.items[0];

        songInfo =
            `Artist: ${response.album.artists[0].name}\n
            Album Name: ${response.album.name}\n
            Song Name: ${response.name}\n
            Preview URL: ${response.preview_url}\n`

        fs.appendFile('log.txt', songInfo, (err) => {
            if (err) throw err;
            console.log('File appended');
        });

        // spotify
        //     .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
        //     .then(function (data) {
        //         console.log(data);
        //         })
        //     })
        //     .catch(function (err) {
        //         console.error('Error occurred: ' + err);
        //     });
    })
}

//omdb call
function movieCall() {

    if (value == undefined) {
        return value = "Shrek";
    }

    request('http://www.omdbapi.com/?i=tt3896198&apikey=55e8eecb&t=' + value, (err, response, body) => {
        if (err) throw err;

        response = JSON.parse(body);

        movieInfo = `Title: ${response.Title}\n
                    Year: ${response.Released}\n
                    IMDB Rating: ${response.imdbRating}\n
                    Rotten Tomatoes: ${response.Ratings[1].Value}\n
                    Country: ${response.Country}\n
                    Language: ${response.Language}\n
                    Movie Plot: ${response.Plot}\n
                    Actors: ${response.Actors}\n${divider}`;

        console.log(movieInfo, "Movie Information");

        fs.appendFile('log.txt', movieInfo, (err) => {
            if (err) throw err;
            console.log('File appended');

        })
    })
}


//random Call
function randomCall() {

    console.log('do what it says')
    //read the random.txt file to take in do-what-it says
    fs.readFile('random.txt', "utf8", (err, data) => {
        if (err) throw err;

        var data = data.split(", ");

        command = data[0];
        value = data[1];

        //Switch Case for Commands
        switch (command) {
            case "concert-this":
                concertCall();
                break;

            case "spotify-this-song":
                songCall();
                break;

            case "movie-this":
                movieCall();
                break;

            case "do-what-it-says":
                randomCall();
                break;
        }

    });

}





