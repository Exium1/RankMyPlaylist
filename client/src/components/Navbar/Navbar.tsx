import Image from "next/image";
import spotifyLogo from "../../../public/assets/SpotifyLogo.png";

export default function Navbar(props: any) {
	return (
		<div className="flex justify-center bg-slate-700 p-7 items-center gap-x-7">
			<Image src={spotifyLogo} height="50" width="50" alt=""></Image>
			<h1 className="text-3xl">Rank My Playlist</h1>
		</div>
	);
}
