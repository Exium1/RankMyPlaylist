import Image from "next/image";
import { PreviewButton } from "../PreviewButton/PreviewButton";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getTrack } from "@/services/track";
import { submitComparison } from "@/services/compare";
const { useState, useEffect } = require("react");

export default function CompareSongs({
	trackA,
	trackB
}: {
	trackA: string;
	trackB: string;
}) {
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();

	const [tracks, setTracks] = useState([]);

	const updateTracks = async () => {
		let trackAInfo = await getTrack(trackA);
		let trackBInfo = await getTrack(trackB);

		setTracks([trackAInfo, trackBInfo]);
	};

	useEffect(() => {
		updateTracks();
	}, [searchParams]);

	const handleResponse = (options: any) => {
		router.replace(
			`/playlist/${params.playlistId}/compare?trackA=${options[0]}&trackB=${options[1]}`
		);
	};

	const handleComplete = (response: any) => {
		router.push(`/playlist/${params.playlistId}?ranked=true`);
	};

	const selectTrack = (index: number) => {
		submitComparison(index, params.playlistId as string).then((data) => {
			if (data.options) handleResponse(data.options);
			else handleComplete(data);
		});
	};

	return (
		<div className="flex flex-col justify-center items-center gap-3">
			<h2 className="text-lg text-center my-8">Pick your favorite:</h2>
			<div className="flex flex-row no-wrap mb-16 justify-center w-8/12 gap-20">
				{tracks.length > 1 &&
					tracks.map((track: any, index: number) => (
						<div
							key={track.name}
							className="inline-flex flex-col gap-3 items-center cursor-pointer"
						>
							<div className="relative">
								<Image
									loader={() => track.imageURL}
									src={track.imageURL}
									height={250}
									width={250}
									alt=""
									className="rounded inline-block drop-shadow-lg"
									onClick={() => selectTrack(index)}
								/>
								{track.previewURL && (
									<PreviewButton url={track.previewURL} />
								)}
							</div>

							<div className="flex flex-col text-center inline-block">
								<h2 className="text-2xl max-w-xs">
									{track.name}
								</h2>
								<p className="text-xl text-slate-300 max-w-xs ">
									{track.artists}
								</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
