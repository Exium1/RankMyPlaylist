"use client";

import Image from "next/image";
import spotifyLogo from "../../public/assets/SpotifyLogo.png";
import ImportPlaylist from "@/components/ImportPlaylist/ImportPlaylist";
import PlaylistPreview from "@/components/PlaylistPreview/PlaylistPreview";
import CompareSongs from "@/components/CompareSongs/CompareSongs";
import axios from "axios";
const { useState } = require("react");

export default function Home() {
	axios.defaults.baseURL = "http://localhost:4900/api/";

	const [playlistReceived, setPlaylistReceived] = useState(false);
	const [rankingMode, setRankingMode] = useState(false);
	const [sortedTracks, setSortedTracks] = useState([]);

	return (
		<div>
			<div className="flex justify-center bg-slate-700 p-7 items-center gap-x-7">
				<Image src={spotifyLogo} height="50" width="50" alt=""></Image>
				<h1 className="text-3xl">Rank My Playlist</h1>
			</div>

			{!playlistReceived ? (
				<ImportPlaylist setPlaylistReceived={setPlaylistReceived} />
			) : !rankingMode ? (
				<PlaylistPreview
					setPlaylistReceived={setPlaylistReceived}
					setRankingMode={setRankingMode}
					sortedTracks={sortedTracks}
				/>
			) : (
				<CompareSongs
					setRankingMode={setRankingMode}
					setSortedTracks={setSortedTracks}
				/>
			)}
		</div>
	);
}
