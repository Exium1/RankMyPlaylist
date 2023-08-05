const express = require("express");
const router = express.Router();
const sorting = require("./utils/sorting");
const database = require("./services/database");

// Get playlist info for displaying and used for comparisons in the future...
router.get("/playlist/:playlistID", async (req, res) => {
	const playlistID = req.params.playlistID;
	const sessionID = req.sessionID;

	let playlistData = await database.getPlaylist(playlistID);

	if (!playlistData) {
		res.sendStatus(400);
		return;
	}

	if (req.query.ranked) {
		const rankedTracks = sorting.getSortedTracks(sessionID);

		if (rankedTracks == null) {

			res.status(400).send(`You haven't ranked playlist ${playlistID}`);
		} else {
			
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
	} else {

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
	}
})

// Get next comparison for a specific playlist through sessionID
router.get("/playlist/:playlistID/compare", async (req, res) => {
	const playlistID = req.params.playlistID;
	const sessionID = req.sessionID;

	if (database.getSessionPlaylistID(sessionID) != playlistID || !sorting.isInitialized(sessionID)) {
		await sorting.initSorting(sessionID, playlistID);
	}

	const nextComparison = sorting.getNextComparison(sessionID);

	res.status(200).send(nextComparison);
})

// Post a comparison for a specific playlist through sessionID
router.post("/playlist/:playlistID/compare", async (req, res) => {
	const playlistID = req.params.playlistID;
	const sessionID = req.sessionID;
	const selectedIndex = req.body.selectedIndex;

	if (database.getSessionPlaylistID(sessionID) != playlistID) return res.status(400).send("Import and confirm a playlist first.")

	if (selectedIndex == null) return res.status(400).send("No selected index");

	const isSorted = sorting.submitComparison(sessionID, selectedIndex);

	if (isSorted) {
		res.status(200).send({
			message: "This playlist is now sorted!",
			array: isSorted
		});
	} else {
		const nextComparison = sorting.getNextComparison(sessionID);

		res.status(200).send(nextComparison);
	}
})

// Get track information
router.get("/track/:trackID", (req, res) => {
	const trackID = req.params.trackID;
	let trackData = database.getTrack(trackID);

	res.status(200).send(trackData);
});

module.exports = { router };
