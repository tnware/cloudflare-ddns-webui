import { db } from '$lib/server/database';
import type { RecordLog, IPAddress } from '$lib/types/db';

export async function logRecordUpdate(record_id: string, old_ip: string, new_ip: string) {
	// Create a new record_log
	await db<RecordLog>('RecordLog').insert({
		timestamp: new Date().toISOString(),
		action: 'update',
		result: 'success',
		message: `Changed from ${old_ip} to ${new_ip}.`,
		old_ip: old_ip,
		new_ip: new_ip,
		record_id: record_id
	});
}

export async function logRecordUpdateError(
	record_id: string,
	old_ip: string,
	new_ip: string,
	error: string
) {
	// Create a new record_log
	await db<RecordLog>('RecordLog').insert({
		timestamp: new Date().toISOString(),
		action: 'update',
		result: 'error',
		message: `Couldn't update from ${old_ip} to ${new_ip}: ${error}`,
		old_ip: old_ip,
		new_ip: new_ip,
		record_id: record_id
	});
}

export async function updateStoredIPAddress(ipAddress: string, lastUpdated: string): Promise<void> {
	try {
		// Load the IPAddress with id 1
		let ipRecord = await db<IPAddress>('IPAddress').where('id', 1).first();

		// Check if the record exists, if not create a new one
		if (!ipRecord) {
			await db<IPAddress>('IPAddress').insert({
				id: 1,
				ipAddress: ipAddress,
				lastUpdated: lastUpdated
			});
		} else {
			// Update the values
			await db<IPAddress>('IPAddress')
				.where('id', 1)
				.update({ ipAddress: ipAddress, lastUpdated: lastUpdated });
		}
	} catch (error) {
		console.error('Error updating IP Address record: ', error);
		throw error;
	}
}
