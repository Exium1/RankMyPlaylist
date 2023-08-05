const spotify = require("./spotify");
const sessions = {};
const playlists = {};

const getPlaylist = async (playlistID) => {
	if (!playlists[playlistID]) {
		const spotifyData = await spotify.getPlaylistByID(playlistID);

		if (!spotifyData) return null;
		else playlists[playlistID] = spotifyData;
	};

	return playlists[playlistID];
};


const getSessionPlaylistID = (sessionID) => {
	return sessions[sessionID];
};

const setSessionPlaylistID = (sessionID, playlistID) => {
	sessions[sessionID] = playlistID;
}

const getTrack = (trackID) => {
	let match = null;

	Object.keys(playlists).forEach((playlistId) => {
		playlists[playlistId].tracks.items.forEach((item) => {
			if (item.track.id == trackID) {
				match = {
					name: item.track.name,
					imageURL: item.track.album.images[0].url,
					previewURL: item.track.preview_url,
					artists: item.track.album.artists.map(
						(artist) =>
							artist.name +
							(item.track.album.artists.length > 1 ? ", " : "")
					)
				};
			}

			return;
		});

		if (match) return match;
	});

	if (match) return match;
	else
		return {
			name: "",
			imageURL: "",
			previewURL: "",
			artists: ""
		};
};

module.exports = {
	sessions,
	playlists,
	getPlaylist,
	getTrack,
	getSessionPlaylistID,
	setSessionPlaylistID
};
