const sessions = {};
const playlists = {};

const getPlaylist = (playlistID) => {
	if (!playlists[playlistID]) return null;

	return playlists[playlistID];
};

const getCurrentPlaylist = (sessionID) => {
	if (!sessions[sessionID]) return null;
	return getPlaylist(sessions[sessionID].currentPlaylist);
};

const newPlaylist = (playlistID, playlistData) => {
	playlists[playlistID] = playlistData;
};

const setPlaylist = (sessionID, playlistID) => {
	if (!sessions[sessionID]) sessions[sessionID] = {};

	sessions[sessionID].currentPlaylist = playlistID;
};

const getTrack = (trackId) => {
	let match = null;

	Object.keys(playlists).forEach((playlistId) => {
		playlists[playlistId].tracks.items.forEach((item) => {
			if (item.track.id == trackId) {
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
	newPlaylist,
	setPlaylist,
	getCurrentPlaylist,
	getTrack
};
