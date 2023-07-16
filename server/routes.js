const express = require("express");
const router = express.Router();
const spotify = require("./services/spotify");
const sorting = require("./utils/sorting");
const database = require("./services/database");

router.get("/playlist/import/:playlistID", async (req, res) => {
	const sessionID = req.sessionID;
	const playlistID = req.params.playlistID;
	let playlistData = database.getPlaylist(playlistID);

	database.setPlaylist(sessionID, playlistID);

	if (playlistData) {
		res.status(200).send(playlistData);
	} else {
		console.log("Fetching playlist " + playlistID + " from Spotify...");

		playlistData = await spotify.getPlaylistByID(playlistID);

		database.newPlaylist(playlistID, playlistData);
		res.status(200).send(playlistData);
	}
});

router.get("/playlist/rank", (req, res) => {
	const status = sorting.initSorting(req.sessionID);

	res.sendStatus(status);
});

router.get("/compare", (req, res) => {
	const sessionID = req.sessionID;
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

module.exports = { router };
