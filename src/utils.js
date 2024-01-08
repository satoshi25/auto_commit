import fs from 'fs';
import path from 'path';
import process from 'process';


const cur = process.cwd();
const uploadFolder = path.join(cur, 'public', 'commit_files');


export function getTime() {
	const time = new Date();
	const year = time.getFullYear();
	let month = String(time.getMonth() + 1);
	if (month.length === 1) {
		month = '0' + month;
	}
	let day = String(time.getDate());
	if (day.length === 1) {
		day = '0' + day;
	}
	return [year, month, day];
}


export function findFiles(month, day) {
	const files = fs.readdirSync(uploadFolder);
	let findFile = files.filter((file) => {
		const name = file.split('.')[0];
		if (name === `${month}${day}`) {
			return file;
		}
	});
	return findFile.map((file) => {
		return file.split('.');
	});
}


export function openFile(files) {
	let dataObj = {};
	for (let i = 0; i < files.length; i++) {
		const data = fs.readFileSync(`${uploadFolder}/${files[i][0]}.${files[i][1]}`).toString();
		if (files[i][1] === 'py' || files[i][1] === 'js') {
			let lineData = data.split('\n');
			if (lineData.length > 3) {
				dataObj["message"] = lineData[3];
			} else {
				dataObj["message"] = undefined;
			}
			dataObj["question"] = data;
			dataObj["language"] = files[i][1];
		} else {
			dataObj["input"] = data;
		}
	}
	return dataObj;
}