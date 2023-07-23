"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportPlaylist(props: any) {
	const [message, setMessage] = useState("");
	const router = useRouter();

	const handleChange = (event: any) => {
		setMessage(event.target.value);
	};

	const handleImport = async () => {
		const playlistID = message.match(/playlist\/([\w\d]+)/)?.[1];

		if (playlistID == null) return;

		router.push(`/playlist/${playlistID}`);
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
