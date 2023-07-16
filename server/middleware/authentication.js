const authentication = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	if (authHeader == null)
		return res
			.status(403)
			.send({ error: "Include sessionID authorization." });

	req.sessionID = authHeader.split(" ")[1];

	next();
};

module.exports = {
	authentication
};
