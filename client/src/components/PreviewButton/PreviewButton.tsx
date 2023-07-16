import React, { useEffect, useState } from "react";
import Image from "next/image";

const useAudio = (url: string) => {
	const [audio] = useState(new Audio(url));
	const [playing, setPlaying] = useState(false);

	audio.volume = 0.1;

	const toggle = () => setPlaying(!playing);

	useEffect(() => {
		playing ? audio.play() : audio.pause();
	}, [playing]);

	useEffect(() => {
		audio.addEventListener("ended", () => setPlaying(false));
		return () => {
			audio.removeEventListener("ended", () => setPlaying(false));
		};
	}, []);

	return [playing, toggle] as const;
};

export const PreviewButton = (props: any) => {
	const url = props.url;
	const [playing, toggle] = useAudio(url);

	return (
		<Image
			src={
				playing ? "./assets/icons/pause.svg" : "./assets/icons/play.svg"
			}
			height={35}
			width={35}
			alt=""
			className="rounded inline-block absolute right-2 bottom-2 drop-shadow-xl"
			onClick={toggle}
		/>
	);
};
