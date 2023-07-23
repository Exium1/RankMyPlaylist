"use client";

import axios from "axios";
import CompareSongs from "@/components/CompareSongs/CompareSongs";
import Navbar from "@/components/Navbar/Navbar";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPlaylistPreview } from "@/services/playlist";

export default function Page() {
	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();

	const playlistId = Array.isArray(params.playlistId)
		? params.playlistId[0]
		: params.playlistId;

	const trackA = searchParams.get("trackA");
	const trackB = searchParams.get("trackB");

	const [playlist, setPlaylist] = useState({
		name: "",
		description: "",
		imageURL: ""
	});

	if (!trackA && !trackB) {
		router.push("/");
		return;
	}

	useEffect(() => {
		getPlaylistPreview(playlistId).then((data) => {
			setPlaylist({
				name: data.name,
				description: data.description,
				imageURL: data.imageURL
			});
		});
	}, []);

	return (
		<div>
			<Navbar />
			<div className="flex flex-col justify-center pt-10 items-center gap-3">
				<div className="flex items-center gap-3">
					<img
						src={playlist.imageURL}
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
			</div>
			<CompareSongs trackA={trackA as string} trackB={trackB as string} />
		</div>
	);
}
