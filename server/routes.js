const express = require("express");
const router = express.Router();
const spotify = require("./services/spotify");
const sorting = require("./utils/sorting");
const database = require("./services/database");

router.get("/playlist/:playlistID", async (req, res) => {
	const sessionID = req.sessionID;
	const playlistID = req.params.playlistID;
	let playlistData = database.getPlaylist(playlistID);

	database.setPlaylist(sessionID, playlistID);

	if (req.query.ranked) {
		const rankedTracks = sorting.getSortedTracks(sessionID);

		if (rankedTracks == null) {
			res.status(400).send(`You haven't ranked playlist ${playlistID}`);
		} else {
			if (!playlistID) {
				playlistData = await spotify.getPlaylistByID(playlistID);
			}

			const rankedTracksInfo = [];

			for (var i = 0; i < rankedTracks.length; i++) {
				rankedTracksInfo.push(database.getTrack(rankedTracks[i]));
			}

			res.status(200).send({
				tracks: rankedTracksInfo,
				name: playlistData.name,
				description: playlistData.description,
				imageURL: playlistData.images[0].url
			});
		}

		return;
	}

	if (playlistData) {
		const parsedPlaylistData = {
			tracks: [],
			name: playlistData.name,
			description: playlistData.description,
			imageURL: playlistData.images[0].url
		};

		playlistData.tracks.items.forEach((item) => {
			parsedPlaylistData.tracks.push({
				name: item.track.name,
				imageURL: item.track.album.images[0].url
			});
		});

		res.status(200).send(parsedPlaylistData);
	} else {
		console.log("Fetching playlist " + playlistID + " from Spotify...");

		playlistData = await spotify.getPlaylistByID(playlistID);

		const parsedPlaylistData = {
			tracks: [],
			name: playlistData.name,
			description: playlistData.description,
			imageURL: playlistData.images[0].url
		};

		playlistData.tracks.items.forEach((item) => {
			parsedPlaylistData.tracks.push({
				name: item.track.name,
				imageURL: item.track.album.images[0].url
			});
		});

		database.newPlaylist(playlistID, playlistData);
		res.status(200).send(parsedPlaylistData);
	}
});

router.get("/compare", (req, res) => {
	const sessionID = req.sessionID;

	if (!sorting.isInitialized(sessionID)) sorting.initSorting(sessionID);

	const nextComparison = sorting.getNextComparison(sessionID);

	res.status(200).send(nextComparison);
});

router.post("/compare", (req, res) => {
	const sessionID = req.sessionID;
	const selectedIndex = req.body.selectedIndex;

	if (selectedIndex == null) return res.status(400).send("No selected index");

	const isSorted = sorting.submitComparison(sessionID, selectedIndex);

	if (isSorted != false) {
		res.status(200).send({
			message: "This playlist is now sorted!",
			array: isSorted
		});
	} else {
		const nextComparison = sorting.getNextComparison(sessionID);

		res.status(200).send(nextComparison);
	}
});

router.get("/track/:trackId", (req, res) => {
	const trackId = req.params.trackId;
	let trackData = database.getTrack(trackId);

	res.status(200).send(trackData);
});

module.exports = { router };
