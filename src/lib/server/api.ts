import { db } from '$lib/server/database';
import type {
	RecordLog,
	IPAddress,
	Record,
	Log,
	IpProviders,
	Zones,
	Settings,
	LogFilter
} from '$lib/types/db';

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

export async function getSettings(name: string): Promise<Settings | undefined> {
	try {
		const setting = await db<Settings>('Settings').where('name', name).first();
		return setting;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to retrieve setting: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to retrieve setting.');
	}
}

export async function getActiveIpProviders(): Promise<IpProviders[]> {
	try {
		const providers = await db<IpProviders>('ipproviders').where('active', 1);
		return providers;
	} catch (error: unknown) {
		console.error('Error fetching active IP Providers: ', error);
		throw error;
	}
}

export async function upsertRecords(records: Record[]) {
	try {
		for (const record of records) {
			const existingRecord = await db<Record>('record').where('id', record.id).first();

			if (existingRecord) {
				await db<Record>('record').where('id', record.id).update({
					content: record.content,
					name: record.name,
					type: record.type,
					modified_on: record.modified_on,
					zone_id: record.zone_id,
					zone_name: record.zone_name
				});
			} else {
				await db<Record>('record').insert({
					id: record.id,
					content: record.content,
					name: record.name,
					type: record.type,
					modified_on: record.modified_on,
					zone_id: record.zone_id,
					zone_name: record.zone_name
				});
			}
		}

		console.log('Records upserted successfully');
	} catch (error: unknown) {
		console.error('Error upserting records: ', error);
		throw error;
	}
}

export async function updateRecordIPAddress(id: string, ipAddress: string): Promise<void> {
	try {
		await db<Record>('Record').where('id', id).update({ content: ipAddress });
	} catch (error: unknown) {
		console.error('Failed to update record IP address:', error);
		throw error;
	}
}

export async function listRecord(filter?: Partial<Record>): Promise<Record[]> {
	try {
		let query = db<Record>('Record');

		if (filter) {
			if (filter.enabled) {
				query = query.where('enabled', filter.enabled);
			}
		}

		const results = await query;
		return results;
	} catch (error: unknown) {
		console.error('Failed to list records:', error);
		throw error;
	}
}

export async function createLog(
	action: Log['action'],
	message: Log['message'],
	type: Log['type'] = 'INFO',
	related_object: Log['related_object'] = '',
	related_type: Log['related_type'] = ''
): Promise<void> {
	try {
		await db('log').insert({
			action,
			message,
			type,
			related_object,
			related_type
		});
	} catch (error: unknown) {
		console.error('Error creating log: ', error);
		throw error;
	}
}

export async function getIPAddress(id: number): Promise<IPAddress | undefined> {
	try {
		const result = await db<IPAddress>('IPAddress').where('id', id).first();
		return result;
	} catch (error: unknown) {
		console.error('Error fetching IP address:', error);
		throw error;
	}
}

export async function getIpProviders(id: IpProviders['id']): Promise<IpProviders | undefined> {
	try {
		const provider = await db<IpProviders>('IpProviders').where('id', id).first();
		return provider;
	} catch (error) {
		console.error('Error fetching IP Provider: ', error);
		throw error;
	}
}

export async function listLog(filter: LogFilter = {}): Promise<Log[]> {
	try {
		let query = db<Log>('log');

		Object.keys(filter).forEach((key) => {
			if (filter[key as keyof LogFilter]) {
				query = query.where(key, filter[key as keyof LogFilter]);
			}
		});

		query = query.orderBy('timestamp', 'desc');

		const logs = await query;
		return logs;
	} catch (error) {
		console.error('Error getting all logs: ', error);
		throw error;
	}
}

export async function updateRecordEnabled(id: string, enabled: number): Promise<void> {
	try {
		await db('Record').where('id', id).update({ enabled });
	} catch (error) {
		console.error('Failed to update record enabled status:', error);
		throw error;
	}
}

export async function getRecord(id: string): Promise<Record> {
	try {
		const result = await db<Record>('Record').where('id', id).first();
		if (!result) {
			throw new Error('No record found with the given ID');
		}
		return result;
	} catch (error) {
		console.error('Failed to get record:', error);
		throw error;
	}
}

export async function listZones(): Promise<{ response: Zones[] }> {
	try {
		const response: Zones[] = await db('zones');
		return { response };
	} catch (error: unknown) {
		console.error('Failed to list zones:', error);
		throw error;
	}
}

export async function createZone(name: Zones['name'], zone_id: Zones['zone_id']): Promise<void> {
  try {
    await db('Zones').insert({ name: name.toString(), zone_id: zone_id.toString() });
  } catch (error) {
    console.error('Failed to create zone:', error);
    throw error;
  }
}

export async function deleteZones(id: number): Promise<void> {
  try {
    await db('zones').where('id', id).del();
  } catch (error) {
    console.error('Failed to delete zone:', error);
    throw error;
  }
}
