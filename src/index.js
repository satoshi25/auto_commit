import cron from 'node-cron';
import * as dotenv from 'dotenv';
import { autoCommit } from './app.js';

dotenv.config();
const hour = process.env.HOUR;
const min = process.env.MIN;
console.log('auto commit action start..');
cron.schedule(`${min} ${hour} * * *`, () => {
	const today = new Date().toLocaleString();
	console.log(`${today} commit action start..`);
	autoCommit();
}, {
	scheduled: true,
	timezone: 'Asia/Seoul'
});
