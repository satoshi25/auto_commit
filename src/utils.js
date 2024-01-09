import fs from 'fs';
import path from 'path';
import process from 'process';
import os from 'os';


const cur = process.cwd();
const uploadFolder = path.join(cur, 'public', 'commit_files');
const repoFolder = path.join(os.homedir(), 'Desktop', 'Algorithm', 'Algorithm');


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


export function makeFile(dataObj, year, month, day) {
	const monthDir = path.join(repoFolder, `${year}-${month}`);
	const workingDir = path.join(monthDir, `${month}${day}-Baekjoon`);
	const questionDir = path.join(workingDir, `${month}${day}_${dataObj['message'].split(' ')[0]}.${dataObj["language"]}`);
	const inputDir = path.join(workingDir, `input.txt`);
	let result = [true, dataObj["message"]];

	if (!fs.existsSync(monthDir)) {
		fs.mkdirSync(monthDir);
	}

	if (!fs.existsSync(workingDir) && result) {
		fs.mkdirSync(workingDir);
	} else {
		result[0] = false;
		console.log(`${month}${day}-Baekjoon 폴더가 이미 존재합니다.`);
	}

	if (!fs.existsSync(questionDir) && result) {
		fs.writeFileSync(questionDir, dataObj["question"]);
	} else {
		result[0] = false;
		console.log(`문제파일이 이미 존재합니다.`);
	}

	if (!fs.existsSync(inputDir) && result) {
		fs.writeFileSync(inputDir, dataObj["input"]);
	} else {
		result[0] = false;
		console.log(`입력파일이 이미 존재합니다.`);
	}
	return result;
}