import { Cron } from 'croner';
import { fetchIPAddress } from '$lib/utils/apis';
import type { IPAddress } from '$lib/types/db';
import { db } from './database';
import { getSettings, createLog } from './api';
function parseCronInterval(cronString) {
	const [minuteField] = cronString.split(' ');

	if (minuteField === '*') {
		return 1;
	}

	if (minuteField.includes('*/')) {
		// If the field includes "*/", it means "every x minutes", so return x
		return Number(minuteField.split('*/')[1]);
	}

	if (minuteField.includes(',')) {
		// If the field includes ",", it means specific minutes of the hour are specified
		const minutes = minuteField.split(',').map(Number);
		// We assume the minutes are evenly spaced and return the difference between the first two
		return minutes[1] - minutes[0];
	}

	// If we don't understand the minute field, return null
	return null;
}

export async function serverStart() {
	console.log('Server started.');
	createLog('server', 'Server started');

	try {
		const console_id = await db<IPAddress>('IPAddress').where('id', 1).first();
		console.log(console_id);
	} catch (error) {
		console.error('Failed to fetch console_id from database:', error);
	}

	console.log('Initial run task - Update Public IP');
	fetchIPAddress(false);

	const ipUpdateInterval_setting = await getSettings('ip_update_interval');

	if (ipUpdateInterval_setting) {
		const ipUpdateInterval = ipUpdateInterval_setting.value;

		createLog('server', `scheduled task interval: ${ipUpdateInterval}`, 'DEBUG');

		console.log(`Starting scheduled task - Update Public IP @ ${ipUpdateInterval}`);

		const job = Cron(ipUpdateInterval, () => updateIPAddress());

		createLog('scheduled_task', 'Started scheduled task - Update Public IP');
	} else {
		console.log('Setting not found');
		createLog('scheduled_task', 'scheduled task creation failed, check your settings', 'ERROR');
	}
}

async function updateIPAddress() {
	const automaticRefresh_setting = await getSettings('automatic_ip_refresh');
	const autoRefreshEnabled = automaticRefresh_setting?.value === 'true';

	if (autoRefreshEnabled) {
		const ipUpdateInterval_setting = await getSettings('ip_update_interval');
		const ipUpdateInterval = ipUpdateInterval_setting?.value;
		const minutesToAdd = parseCronInterval(ipUpdateInterval);
		const currentDate = new Date();
		const nextUpdateDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
		const nextUpdate = nextUpdateDate.toISOString();

		try {
			await fetchIPAddress(true);
			await db<IPAddress>('IPAddress').where('id', 1).update({ nextUpdate });
		} catch (error) {
			console.error('Failed to fetch IP address or update database:', error);
		}
	} else {
		console.log(
			'Automatic updating is disabled in the settings. Enable it again to receive more updates.'
		);
	}
}
