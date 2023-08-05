import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getPlaylistPreview, getPlaylistRanked } from "../../services/playlist";
import { getNextComparison } from "../../services/compare";

export default function PlaylistPreview({
	playlistId,
	ranked
}: {
	playlistId: string;
	ranked: boolean;
}) {
	const router = useRouter();
	const [ tracks, setTracks ] = useState([]);
	const [ playlistInfo, setPlaylistInfo ] = useState({
		name: "",
		description: "",
		imageURL: ""
	});

	useEffect(() => {
		if (ranked) {
			getPlaylistRanked(playlistId).then((res) => {
				setTracks(res.tracks);
				setPlaylistInfo({
					name: res.name,
					description: res.description,
					imageURL: res.imageURL
				});
			});
		} else {
			getPlaylistPreview(playlistId).then((res) => {
				setTracks(res.tracks);
				setPlaylistInfo({
					name: res.name,
					description: res.description,
					imageURL: res.imageURL
				});
			});
		}
	}, []);

	const handleBack = () => {
		router.push("/");
	};

	const handleConfirm = () => {
		getNextComparison(playlistId).then((options) => {
			router.push(
				`/playlist/${playlistId}/compare?trackA=${options[0]}&trackB=${options[1]}`
			);
		});
	};

	return (
		<div className="flex flex-col justify-center bg-slate-600 p-14 items-center gap-3">
			<div className="flex items-center gap-3">
				<img
					src={playlistInfo.imageURL}
					height="100px"
					width="100px"
					alt=""
					className="rounded"
				></img>
				<div className="flex flex-col">
					<h2 className="text-4xl">{playlistInfo.name}</h2>
					<p className="text-lg text-slate-300 max-w-xs">
						{playlistInfo.description}
					</p>
				</div>
			</div>
			{!ranked ? (
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
						Rank {tracks.length} Songs (~
						{Math.round(tracks.length * Math.log2(tracks.length))}{" "}
						Comparisons)
					</button>
				</div>
			) : (
				<div className="flex flex-col my-4 gap-5">
					<button
						onClick={handleBack}
						className="rounded-full bg-green-600 hover:bg-green-800 py-3 px-7 transition-colors"
					>
						Try another playlist
					</button>
					<h2 className="text-xl">Here is your ranking:</h2>
				</div>
			)}
			<div className="flex flex-col gap-2 divide-y divide-slate-400">
				{tracks.map((track: any, index: number) => (
					<div
						key={`${track.name}`}
						className="flex gap-3 pt-2 items-center"
					>
						{ranked && (
							<p
								className={
									ranked
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
							src={track.imageURL}
							height={
								ranked
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
								ranked
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
								(ranked
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
							{track.name}
						</h3>
					</div>
				))}
			</div>
		</div>
	);
}
