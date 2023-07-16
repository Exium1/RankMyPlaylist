import axios from "axios";
import Image from "next/image";
import useSound from "use-sound";
import { PreviewButton } from "../PreviewButton/PreviewButton";
const { useState, useEffect } = require("react");
const { database } = require("../../utils/database");
var cookie = require("@boiseitguru/cookie-cutter");

export default function CompareSongs(props: any) {
	const sessionID = cookie.get("sessionID");
	const playlist = database[sessionID];
	const config = {
		headers: { Authorization: `Bearer ${sessionID}` }
	};

	const [tracks, setTracks] = useState([]);

	useEffect(() => {
		axios
			.get("/compare/", config)
			.then((res) => handleResponse(res?.data?.options))
			.catch((err) => console.log(err));
	}, []);

	const handleResponse = (options: any) => {
		let first = playlist.tracks.items.find(
			(item: any) => item.track.id == options[0]
		);

		let second = playlist.tracks.items.find(
			(item: any) => item.track.id == options[1]
		);

		setTracks([first, second]);
	};

	const handleComplete = (response: any) => {
		setTracks([]);
		props.setRankingMode(false);
		props.setSortedTracks(response.array);
	};

	const selectTrack = (index: number) => {
		axios
			.post("/compare/", { selectedIndex: index }, config)
			.then((res) => {
				if (!res.data.options) {
					handleComplete(res?.data);
				} else handleResponse(res?.data?.options);
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="flex flex-col justify-center bg-slate-600 pt-10 items-center gap-3">
			<div className="flex items-center gap-3">
				<img
					src={playlist.images[0].url}
					height="70px"
					width="70px"
					alt=""
					className="rounded"
				/>
				<div className="flex flex-col">
					<h2 className="text-xl">{playlist.name}</h2>
					<p className="text-sm text-slate-300 max-w-xs">
						{playlist.description}
					</p>
				</div>
			</div>
			<h2 className="text-lg text-center my-8">Pick your favorite:</h2>
			<div className="flex flex-row no-wrap mb-16 justify-center w-8/12 gap-20">
				{tracks.length > 1 &&
					tracks.map((item: any, index: number) => (
						<div
							key={item.track.name}
							className="inline-flex flex-col gap-3 items-center cursor-pointer"
						>
							<div className="relative">
								<Image
									loader={() =>
										item.track.album.images?.[0].url
									}
									src={item.track.album.images?.[0].url}
									height={250}
									width={250}
									alt=""
									className="rounded inline-block drop-shadow-lg"
									onClick={(event) => selectTrack(index)}
								/>
								{item.track.preview_url && (
									<PreviewButton
										url={item.track.preview_url}
									/>
								)}
							</div>

							<div className="flex flex-col text-center inline-block">
								<h2 className="text-2xl max-w-xs">
									{item.track.name}
								</h2>
								<p className="text-xl text-slate-300 max-w-xs ">
									{item.track.album.artists.map(
										(artist: any) =>
											artist.name +
											(item.track.album.artists.length > 1
												? ", "
												: "")
									)}
								</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
