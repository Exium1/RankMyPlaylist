import Navbar from "@/components/Navbar/Navbar";
import ImportPlaylist from "@/components/ImportPlaylist/ImportPlaylist";

export default function Home() {
	return (
		<div>
			<Navbar />
			<ImportPlaylist />
			<div className="flex justify-center">
				<a href="https://open.spotify.com/playlist/03jv2meoIoU5vNqDqdjIh8?si=170f4cb525914cd3">
					https://open.spotify.com/playlist/03jv2meoIoU5vNqDqdjIh8?si=405fe4cbc34747fa
				</a>
			</div>
		</div>
	);
}
