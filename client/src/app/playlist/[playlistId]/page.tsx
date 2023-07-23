"use client";

import Navbar from "@/components/Navbar/Navbar";
import PlaylistPreview from "@/components/PlaylistPreview/PlaylistPreview";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
	const params = useParams();
	const searchParams = useSearchParams();

	let playlistId: string = "";

	if (Array.isArray(params.playlistId)) playlistId = params.playlistId[0];
	else playlistId = params.playlistId;

	return (
		<div>
			<Navbar />
			<Suspense fallback={<p>Loading</p>}>
				<PlaylistPreview
					playlistId={playlistId}
					ranked={searchParams.get("ranked") == "true"}
				/>
			</Suspense>
		</div>
	);
}
