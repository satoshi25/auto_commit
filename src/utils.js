import fs from 'fs';
import path from 'path';
import process from 'process';
import os from 'os';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';


dotenv.config();
const cur = process.cwd();
const uploadFolder = path.join(cur, process.env.UPLOAD_FOLDER);
const repoFolder = path.join(os.homedir(), process.env.REPO_FOLDER);
const completeFolder = path.join(cur, process.env.COMPLETE_FOLDER);


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


export async function commitMessage(message) {
	let env = process.env;
	env.MESSAGE = message;
	return new Promise((resolve, reject) => {
		exec(`sh git_command.sh`, { env: env }, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);
			resolve(stdout)
		});
	});
}


export async function moveFile(month, day) {
	const fileNames = findFiles(month, day);
	for (let i = 0; i < fileNames.length; i++) {
		let filePath = fileNames[i].join('.');
		fs.rename(path.join(uploadFolder, filePath), path.join(completeFolder, filePath), (error, data) => {
			if (error) {
				console.error(error);
			}
		});
	}
}
