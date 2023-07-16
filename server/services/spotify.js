var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
	clientId: "a46db2e9c33047ad889273ab94407199",
	clientSecret: "367a0f84c077490dbf363f5b0ba432c3",
	redirectUri: "http://localhost:3000"
});

spotifyApi.setAccessToken(
	"BQARoyCOocpg1kRmcSYuQlo1a4RVo3dFz9NqlppZCNGIdUt9QtXm1w2oY1poUmCxZwVTtrRXwHEUw70yr7TmGQi6mxWCqwo83bCzUEcrXOMV7Ik4j0M"
);

const getPlaylistByID = async (playlistID) =>
	spotifyApi
		.getPlaylist(playlistID, {
			fields: "external_urls,name,description,owner(display_name),images,href,tracks.items(track(name,id,href,preview_url,album(images,artists(name,href))))"
		})
		.then(
			function (data) {
				console.log(JSON.stringify(data.body));
				return data.body;
			},
			function (err) {
				return err;
			}
		);

module.exports = {
	getPlaylistByID
};
