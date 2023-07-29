import { Cron } from 'croner';
import { createLog } from '$lib/server/api';
import { fetchIPAddress } from '$lib/utils/apis';
import { getSettings } from '$lib/server/api';

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
			fetchIPAddress(true);
		});

		// Create a log to confirm the start of the scheduled task
		createLog('scheduled_task', 'Started scheduled task - Update Public IP');
	} else {
		// If the IP update interval setting doesn't exist, notify the console and create an error log
		console.log('Setting not found');
		createLog('scheduled_task', 'scheduled task creation failed, check your settings', 'ERROR');
	}
}
