import { api } from "./api";

export const getTrack = async (trackID: string) => {
	try {
		const res = await api().get(`/track/${trackID}`);
		return res.data;
	} catch (err) {
		throw new Error(`Couldn't get track ${trackID}.\n${err}`);
	}
};
