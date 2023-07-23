require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: "http://localhost:3000"
});

const getPlaylistByID = async (playlistID) => {
	return new Promise((resolve, reject) => {
		spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
		spotifyApi
			.getPlaylist(playlistID, {
				fields: "external_urls,name,description,owner(display_name),images,href,tracks.items(track(name,id,href,preview_url,album(images,artists(name,href))))"
			})
			.then(
				function (data) {
					resolve(data.body);
				},
				function (err) {
					throw err;
				}
			);
	});
};
module.exports = {
	getPlaylistByID
};
