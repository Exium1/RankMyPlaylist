import { api } from "./api";

export const getPlaylistPreview = async (playlistID: string) => {
	try {
		const res = await api().get(`/playlist/${playlistID}`);
		return res.data;
	} catch (err) {
		throw new Error(
			`Couldn't get playlist preview for ${playlistID}.\n${err}`
		);
	}
};

export const getPlaylistRanked = async (playlistID: string) => {
	try {
		const res = await api().get(`/playlist/${playlistID}?ranked=true`);
		return res.data;
	} catch (err) {
		throw err;
	}
};
