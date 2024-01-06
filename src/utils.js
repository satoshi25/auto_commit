
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