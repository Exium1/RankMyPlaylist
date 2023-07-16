const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const { authentication } = require("./middleware/authentication");
const app = express();
const endpoint = "/api";
const port = 4900;

app.use(cors());
app.use(bodyParser.json());
app.use(authentication);

app.use(endpoint, routes.router);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
