import { Cron } from 'croner';
import { createLog } from '$lib/server/sqlite-api';
import { fetchIPAddress } from '$lib/utils/apis';
import { getSettings } from '$lib/server/sqlite-api';
import type { IPAddress } from '$lib/types/db';
import { db } from './database';

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

/**
 * This function initializes the server, creating logs, fetching the IP address, and starting a scheduled task for IP address updates.
 *
 * @example
 * // Example usage
 * serverStart();
 *
 * @returns {void} No return value
 */
export function serverStart() {
	// Notify the console and create a log that the server has started
	console.log('Server started.');
	createLog('server', 'Server started');
	db<IPAddress>('IPAddress')
		.where('id', 1)
		.first()
		.then((console_id) => {
			console.log(console_id);
		});
	// Fetch IP update interval setting from the database
	const ipUpdateInterval_setting = getSettings('ip_update_interval');

	// Fetch the current IP address and log the action
	console.log('Initial run task - Update Public IP');
	fetchIPAddress(false);

	// Check if the IP update interval setting exists
	if (ipUpdateInterval_setting) {
		const ipUpdateInterval = ipUpdateInterval_setting.value;

		// Create a debug log with the IP update interval
		createLog('server', 'scheduled task interval: ' + ipUpdateInterval, 'DEBUG');

		// Notify the console that the scheduled task for IP address updates is starting
		console.log('Starting scheduled task - Update Public IP @ ', ipUpdateInterval);

		// Start the scheduled task using the cron module
		const job = Cron(ipUpdateInterval, () => {
			const minutesToAdd = parseCronInterval(ipUpdateInterval); // parse the cron string
			const currentDate = new Date();
			const nextUpdateDate = new Date(currentDate.getTime() + minutesToAdd * 60000); // Add the interval minutes
			let nextUpdate = nextUpdateDate.toISOString(); // Set the nextUpdate field

			fetchIPAddress(true).then(() => {
				// Save the nextUpdate back to the database
				return db<IPAddress>('IPAddress').where('id', 1).update({
					nextUpdate: nextUpdate
				});
			});
		});

		// Create a log to confirm the start of the scheduled task
		createLog('scheduled_task', 'Started scheduled task - Update Public IP');
	} else {
		// If the IP update interval setting doesn't exist, notify the console and create an error log
		console.log('Setting not found');
		createLog('scheduled_task', 'scheduled task creation failed, check your settings', 'ERROR');
	}
}
