import axios from "axios";
import crypto from "crypto";

let savedSessionID = "";

export const initSession = () => {
	if (savedSessionID == "") {
		savedSessionID = crypto.randomBytes(8).toString("hex");
	}

	return savedSessionID;
};

export const updateSession = (sessionID: string) => {
	if (savedSessionID == "") {
		savedSessionID = sessionID;
	}
};

export const api = () =>
	axios.create({
		baseURL: "http://localhost:4900/api/",
		headers: {
			Authorization: `Bearer ${savedSessionID}`
		}
	});

module.exports = {
	initSession,
	updateSession,
	api
};
