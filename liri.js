
require("dotenv").config();
const fs = require("fs");
const keys = require("./keys");

const Spotify = require("node-spotify-api");
const request = require("request");
const moment = require("moment");
const divider = "\n------------------------------------------------------------\n\n";

const spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});


//bands in town call
if (process.argv[2] == 'concert-this') {

    const artist = process.argv.slice(3).join(" ")
    console.log(artist);

    const queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body) {
        if (error) console.log(error);
        const result = JSON.parse(body)[0];
        concertInfo = `Venue name: ${result.venue.name}\nVenue location: ${result.venue.city}\nDate of Event: ${moment(result.datetime).format("MM/DD/YYYY")}\n${divider}`;

        console.log(concertInfo, "Concert Information");

        fs.appendFile('log.txt', concertInfo, function (err) {
            if (err) throw err;
            console.log('File appended');

        })

    });
    //Spotify call
} else if (process.argv[2] == 'spotify-this-song') {

    const songName = process.argv.slice(3).join(" ");

    if (songName == undefined) {
        songName = "The sign by Ace of Base";
    }
    spotify.search({ type: 'track', query: songName, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var result = data.track.items[0];

        console.log(
            `Artist: ${result.album.artists[0].name}/n
            album_name: ${result.album.name}/n
            song_name: ${result.name}/n
            preview_url: ${result.preview_url}`
        )

    });

    //omdb call

} else if (process.argv[2] == 'movie-this') {
    const movieName = process.argv.slice(3).join(" ");

    if (movieName == undefined) {
        movieName = "Shrek";
    }

    request('http://www.omdbapi.com/?i=tt3896198&apikey=55e8eecb&t=' + process.argv[3], function (error, response, body) {

        const result = JSON.parse(body);
        movieInfo = `Title: ${result.Title} \nYear: ${result.Released}\nIMDB Rating: ${result.imdbRating}\nRotten Tomatoes: ${result.Ratings[1].Value}\nCountry: ${result.Country}\nLanguage: ${result.Language}\nMovie Plot: ${result.Plot}\nActors: ${result.Actors}\n${divider}`;

        console.log(movieInfo, "Movie Information");

        fs.appendFile('log.txt', movieInfo, function (err) {
            if (err) throw err;
            console.log('File appended');

        })
    })
}
else if (process.argv[2] == 'do-what-it-says') {
    console.log('do what it says')
    //read the random.txt file to take in do-what-it says
}





