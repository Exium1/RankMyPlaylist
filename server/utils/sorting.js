const database = require("../services/database");

let sortingData = {
	1234567890: {
		mergeSort: {
			temp: [
				[["Juban District"], ["Harvey"]],
				[["Weather"]["That's Life"]],
				[["hey girl"]["wachito rico"]],
				[["Everytime"]]
			],
			currentRow: 0
		}
	},
	111: {
		mergeSort: {
			temp: [
				[["9"], ["2"]],
				[["7"], ["6"]],
				[["5"], ["1"]],
				[["3"], ["8"]],
				[["4"], ["10"]]
			],
			currentRow: 0
		}
	}
};

const initSorting = (sessionID) => {
	const playlistData = database.getCurrentPlaylist(sessionID);

	if (playlistData == null) return 401;
	if (sortingData[sessionID] != null) return 401;

	const tracks = playlistData.tracks.items.map((item) => item.track.id);

	sortingData[sessionID] = {
		mergeSort: {
			temp: [],
			currentRow: 0
		}
	};

	while (tracks.length > 0) {
		if (tracks.length >= 2) {
			sortingData[sessionID].mergeSort.temp.push([
				[tracks[0]],
				[tracks[1]]
			]);
			tracks.splice(0, 2);
		} else {
			sortingData[sessionID].mergeSort.temp.push([tracks[0]]);
			tracks.splice(0, 1);
		}
	}

	return 200;
};

const getNextComparison = (sessionID) => {
	if (sortingData[sessionID] == null) return null;

	let mergeSort = sortingData[sessionID].mergeSort;
	let currentRow = mergeSort.currentRow;
	let first;
	let second;

	while (!needsComparison(sessionID, currentRow)) {
		console.log(`index ${currentRow} needs no comp`);

		currentRow++;

		if (currentRow >= mergeSort.temp.length) {
			if (readyToMerge(sessionID)) {
				console.log("\nno comps found in this format");
				console.log(mergeSort.temp);
				return "no comps found in this format";
			}

			currentRow = 0;
		}
	}

	mergeSort.currentRow = currentRow;

	first = mergeSort.temp[currentRow][0][0];
	second = mergeSort.temp[currentRow][1][0];

	return {
		options: [first, second]
	};
};

const submitComparison = (sessionID, index) => {
	if (index != "0" && index != "1") return null;

	if (isSorted(sessionID)) {
		console.log("ALREADY SORTED");
		return;
	}

	const mergeSort = sortingData[sessionID].mergeSort;
	let currentRow = mergeSort.currentRow;

	updateRow(mergeSort, index);

	currentRow++;
	mergeSort.currentRow = currentRow;

	// Skip row if single array
	if (
		currentRow < mergeSort.temp.length &&
		mergeSort.temp[currentRow].length == 1
	) {
		currentRow++;
		mergeSort.currentRow = currentRow;
	}

	console.log("\n");
	console.log(mergeSort.temp);
	console.log(mergeSort.currentRow);

	if (readyToMerge(sessionID)) {
		mergePairs(sessionID);
		mergeSort.currentRow = 0;

		if (isSorted(sessionID)) {
			mergeSort.sorted = mergeSort.temp[0];
			return mergeSort.sorted;
		}
	} else if (currentRow >= mergeSort.temp.length) {
		mergeSort.currentRow = 0;
	}

	return false;
};

const needsComparison = (sessionID, index) => {
	let mergeSort = sortingData[sessionID].mergeSort;

	// console.log("needsComparison");
	// console.log(mergeSort.temp);
	// console.log(mergeSort.currentRow);

	if (mergeSort.temp[index].length >= 2) {
		if (Array.isArray(mergeSort.temp[index][0])) {
			return true;
		}
	}

	return false;
};

const updateRow = (mergeSort, index) => {
	let row = mergeSort.temp[mergeSort.currentRow];

	if (row.length === 3) {
		row[2].push(row[index][0]);
	} else {
		row.push([row[index][0]]);
	}

	row[index].splice(0, 1);

	if (row[0].length == 0 || row[1].length == 0) {
		if (row.length < 3) row[2] = [];

		row[2] = row[2].concat(row[0]);
		row = row[2].concat(row[1]);
	}

	mergeSort.temp[mergeSort.currentRow] = row;
};

const readyToMerge = (sessionID) => {
	const mergeSort = sortingData[sessionID].mergeSort;
	let ready = true;

	for (var r = 0; r < mergeSort.temp.length; r++) {
		if (Array.isArray(mergeSort.temp[r][0])) {
			ready = false;
			break;
		}
	}

	return ready;
};

const isSorted = (sessionID) => {
	const mergeSort = sortingData[sessionID].mergeSort;

	if (mergeSort.temp.length == 1) {
		return !Array.isArray(mergeSort.temp[0][0]);
	}

	return false;
};

const mergePairs = (sessionID) => {
	console.log("\nmergePairs");

	let mergeSort = sortingData[sessionID].mergeSort;
	mergeSort.currentRow = 0;

	for (var i = 0; i < mergeSort.temp.length - 1; i++) {
		let clone = Object.assign([], mergeSort.temp[i]);

		mergeSort.temp[i] = [clone, mergeSort.temp[i + 1]];
		mergeSort.temp.splice(i + 1, 1);
	}

	console.log(mergeSort.temp);
};

module.exports = {
	initSorting,
	getNextComparison,
	submitComparison
};
