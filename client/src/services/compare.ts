import { api } from "./api";

export const getNextComparison = async (playlistID: string) => {
	try {
		const res = await api().get(`/compare`);
		return res.data.options;
	} catch (err) {
		throw new Error(
			`Couldn't get next comparison for ${playlistID}\n${err}`
		);
	}
};

export const submitComparison = async (index: number) => {
	try {
		const res = await api().post(`/compare`, { selectedIndex: index });
		return res.data;
	} catch (err) {
		throw new Error(`Couldn't post the comparison.\n${err}`);
	}
};
