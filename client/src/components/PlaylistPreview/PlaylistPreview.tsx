import axios from "axios";
const { useState, useEffect } = require("react");
const { database } = require("../../utils/database");
var cookie = require("@boiseitguru/cookie-cutter");

export default function PlaylistPreview(props: any) {
	const setPlaylistReceived = props.setPlaylistReceived;
	const setRankingMode = props.setRankingMode;
	const sessionID = cookie.get("sessionID");
	const playlist = database[sessionID];

	const sortedTracks = props.sortedTracks; // array of track id's
	const [visibleTracks, setVisibleTracks] = useState([]);

	console.log("loop");

	const handleBack = () => {
		setPlaylistReceived(false);
	};

	const handleConfirm = () => {
		const config = {
			headers: { Authorization: `Bearer ${sessionID}` }
		};

		axios
			.get("/playlist/rank", config)
			.then(() => setRankingMode(true))
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		let tracks: any = [];

		if (sortedTracks.length == 0) {
			tracks = playlist.tracks.items;
		} else {
			sortedTracks.forEach((id: string) => {
				let track = playlist.tracks.items.find(
					(item: any) => item.track.id == id
				);

				if (track) tracks.push(track);
			});
		}

		setVisibleTracks(tracks);
	}, []);

	return (
		<div className="flex flex-col justify-center bg-slate-600 p-14 items-center gap-3">
			<div className="flex items-center gap-3">
				<img
					src={playlist.images[0].url}
					height="100px"
					width="100px"
					alt=""
					className="rounded"
				></img>
				<div className="flex flex-col">
					<h2 className="text-4xl">{playlist.name}</h2>
					<p className="text-lg text-slate-300 max-w-xs">
						{playlist.description}
					</p>
				</div>
			</div>
			{sortedTracks.length == 0 ? (
				<div className="flex m-8 gap-5 ">
					<button
						onClick={handleBack}
						className="rounded-full bg-red-400 hover:bg-red-700 py-3 px-7 transition-colors"
					>
						Go Back
					</button>
					<button
						onClick={handleConfirm}
						className="rounded-full bg-green-600 hover:bg-green-800 py-3 px-7 transition-colors"
					>
						Rank {playlist.tracks.items.length} Songs
					</button>
				</div>
			) : (
				<div className="my-4">
					<h2 className="text-xl">Here is your ranking:</h2>
				</div>
			)}
			<div className="flex flex-col gap-2 divide-y divide-slate-400">
				{visibleTracks.map((item: any, index: number) => (
					<div
						key={`${item.track.name}`}
						className="flex gap-3 pt-2 items-center"
					>
						{sortedTracks.length > 0 && (
							<p
								className={
									sortedTracks.length > 0
										? index == 0
											? "text-2xl"
											: index == 1
											? "text-xl"
											: index == 2
											? "text-lg"
											: "text-md"
										: "text-md"
								}
							>
								{index + 1}.
							</p>
						)}
						<img
							src={item.track.album.images?.[0].url}
							height={
								sortedTracks.length > 0
									? index == 0
										? "55px"
										: index == 1
										? "45px"
										: index == 2
										? "35px"
										: "30px"
									: "30px"
							}
							width={
								sortedTracks.length > 0
									? index == 0
										? "55px"
										: index == 1
										? "45px"
										: index == 2
										? "35px"
										: "30px"
									: "30px"
							}
							className="rounded"
						/>
						<h3
							className={
								"inline " +
								(sortedTracks.length > 0
									? index == 0
										? "text-3xl"
										: index == 1
										? "text-2xl"
										: index == 2
										? "text-xl"
										: "text-lg"
									: "text-lg")
							}
						>
							{item.track.name}
						</h3>
					</div>
				))}
			</div>
		</div>
	);
}
