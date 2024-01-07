import fs from 'fs';
import path from 'path';
import process from 'process';

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
	const cur = process.cwd();
	const uploadFolder = path.join(cur, 'public', 'commit_files');
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