import axios from "axios";
import crypto from "crypto";
import { useState } from "react";
const cookie = require("@boiseitguru/cookie-cutter");
const { database } = require("../../utils/database");

export default function ImportPlaylist(props: any) {
	const setPlaylistReceived = props.setPlaylistReceived;
	const [message, setMessage] = useState("");
	const playlistID = message.match(/playlist\/([\w\d]+)/)?.[1];

	const handleChange = (event: any) => {
		setMessage(event.target.value);
	};

	const handleImport = async () => {
		if (playlistID == null) return;

		cookie.set("sessionID", crypto.randomBytes(8).toString("hex"));

		const sessionID = cookie.get("sessionID") || 123;

		const config = {
			headers: { Authorization: `Bearer ${sessionID}` }
		};

		const response = await axios
			.get("/playlist/import/" + playlistID, config)
			.catch((err) => console.log(err));

		if (response) {
			database[sessionID] = response?.data;
			setPlaylistReceived(true);
		} else {
			console.log("no response");
		}
	};

	return (
		<div className="flex flex-col gap-y-5 justify-center bg-slate-600 p-14 items-center">
			<h2 className="text-2xl">Enter your playlist link:</h2>
			<input
				type="text"
				id="message"
				className="rounded text-black p-2 w-5/12"
				placeholder="Enter Spotify playlist link"
				onChange={handleChange}
			/>
			<button
				className="rounded-full bg-green-600 p-3"
				onClick={handleImport}
			>
				Import Playlist
			</button>
		</div>
	);
}
