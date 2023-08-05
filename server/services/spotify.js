const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: "http://localhost:3000"
});

var accessToken = "";

async function getAccessToken() {
	return new Promise((resolve, reject) => {
		if (accessToken != "") return accessToken;

		const headers = {
			Authorization:
				"Basic " +
				new Buffer.from(
					process.env.SPOTIFY_CLIENT_ID +
						":" +
						process.env.SPOTIFY_CLIENT_SECRET
				).toString("base64")
		};

		axios
			.post(
				"https://accounts.spotify.com/api/token",
				`grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
				headers
			)
			.then((res) => {
				accessToken = res.data.access_token;
				setTimeout(() => (accessToken = ""), res.data.expires_in);
				resolve(accessToken);
			})
			.catch((err) => console.log(err));
	});
}

const getPlaylistByID = async (playlistID) => {
	return new Promise(async (resolve, reject) => {
		console.log(`Fetching playlist ${playlistID} from Spotify...`);
		var retrievedToken = await getAccessToken();

		spotifyApi.setAccessToken(retrievedToken);
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
			)
			.catch((err) => {
				console.log(err);
				reject(null);
			});
	});
};

module.exports = {
	getPlaylistByID
};
