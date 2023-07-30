import type {
	IPAddress,
	Record,
	Log,
	IpProviders,
	Zones,
	Settings,
	LogFilter
} from '$lib/types/db';
import type { RunResult } from 'better-sqlite3';
import { db } from '$lib/server/db';

// CRUD operations for IPAddress
/**
 * Creates a new IPAddress in the database.
 *
 * @param ipAddress - An object representing the IP address to be created.
 * @returns A promise that resolves when the IP address is created.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * createIPAddress({ ipAddress: '192.168.1.1', lastUpdated: '2023-07-28' })
 *     .then(() => console.log('IP address created'))
 *     .catch((error) => console.error('Failed to create IP address', error));
 */
export async function createIPAddress(ipAddress: IPAddress): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			const { ipAddress: ipAddressValue, lastUpdated } = ipAddress;
			db.prepare('INSERT INTO IPAddress (ipAddress, lastUpdated) VALUES (?, ?)').run(
				ipAddressValue,
				lastUpdated
			);
			resolve();
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Retrieves an IPAddress from the database by its ID.
 *
 * @param id - The ID of the IP address to retrieve.
 * @returns A promise that resolves to the IP address object if found, or undefined if not found.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * getIPAddress(1)
 *     .then((ipAddress) => {
 *         if (ipAddress) {
 *             console.log('IP address:', ipAddress);
 *         } else {
 *             console.log('IP address not found');
 *         }
 *     })
 *     .catch((error) => console.error('Failed to retrieve IP address', error));
 */
export async function getIPAddress(id: number): Promise<IPAddress | undefined> {
	return new Promise<IPAddress | undefined>((resolve, reject) => {
		try {
			const result = db.prepare('SELECT * FROM IPAddress WHERE id = ?').get(id);
			resolve(result as IPAddress);
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Inserts a new IPAddress into the database, or updates an existing one if it already exists.
 *
 * @param ipAddress - The IP address to be inserted or updated.
 * @param lastUpdated - The date when the IP address was last updated.
 * @returns A promise that resolves to the result of the database operation.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * upsertIPAddress('192.168.1.1', '2023-07-28')
 *     .then((result) => console.log('Upsert result:', result))
 *     .catch((error) => console.error('Failed to upsert IP address', error));
 */
export async function upsertIPAddress(
	ipAddress: IPAddress['ipAddress'],
	lastUpdated: IPAddress['lastUpdated']
): Promise<RunResult> {
	try {
		const existingRecord = db
			.prepare('SELECT * FROM IPAddress WHERE ipAddress = ?')
			.get(ipAddress) as IPAddress;

		if (existingRecord) {
			const updatedRecord = db
				.prepare(
					`
			UPDATE IPAddress
			SET ipAddress = ?,
				lastUpdated = ?
			WHERE id = ?
		  `
				)
				.run(ipAddress, new Date(lastUpdated).toISOString(), existingRecord.id);

			return updatedRecord;
		} else {
			const newRecord = db
				.prepare(
					`
			INSERT INTO IPAddress (ipAddress, lastUpdated)
			VALUES (?, ?)
		  `
				)
				.run(ipAddress, new Date(lastUpdated).toISOString());

			return newRecord;
		}
	} catch (error) {
		console.error('Error creating or updating IP Address record: ', error);
		throw error;
	}
}

/**
 * Updates an existing IPAddress in the database.
 *
 * @param id - The ID of the IP address to update.
 * @param updatedIPAddress - An object with the updated values for the IP address.
 * @returns A promise that resolves when the IP address is updated.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * updateIPAddress(1, { ipAddress: '192.168.1.2', lastUpdated: '2023-07-29' })
 *     .then(() => console.log('IP address updated'))
 *     .catch((error) => console.error('Failed to update IP address', error));
 */
export async function updateIPAddress(
	id: number,
	updatedIPAddress: Partial<IPAddress>
): Promise<void> {
	const { ipAddress: updatedIPAddressValue, lastUpdated: updatedLastUpdated } = updatedIPAddress;
	return new Promise<void>((resolve, reject) => {
		try {
			db.prepare('UPDATE IPAddress SET ipAddress = ?, lastUpdated = ? WHERE id = ?').run(
				updatedIPAddressValue,
				updatedLastUpdated,
				id
			);
			resolve();
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Deletes an IPAddress from the database.
 *
 * @param id - The ID of the IP address to delete.
 * @returns A promise that resolves when the IP address is deleted.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * deleteIPAddress(1)
 *     .then(() => console.log('IP address deleted'))
 *     .catch((error) => console.error('Failed to delete IP address', error));
 */
export async function deleteIPAddress(id: number): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			db.prepare('DELETE FROM IPAddress WHERE id = ?').run(id);
			resolve();
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Retrieves all IPAddresses from the database.
 *
 * @returns A promise that resolves to an array of all the IP addresses.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * listIPAddress()
 *     .then((ipAddresses) => console.log('All IP addresses:', ipAddresses))
 *     .catch((error) => console.error('Failed to retrieve IP addresses', error));
 */
export async function listIPAddress(): Promise<IPAddress[]> {
	return new Promise<IPAddress[]>((resolve, reject) => {
		try {
			const results = db.prepare('SELECT * FROM IPAddress').all() as IPAddress[];
			resolve(results);
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * This function creates a new Record in the database.
 *
 * @param record - An object containing the details of the record to be created.
 * @returns A promise that resolves when the record is created.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * createRecord({ id: 1, content: '127.0.0.1', name: 'localhost', type: 'A', modified_on: '2023-07-29', zone_name: 'example.com', zone_id: 1, enabled: true })
 *     .then(() => console.log('Record created'))
 *     .catch((error) => console.error('Failed to create record', error));
 */
export async function createRecord(record: Record): Promise<void> {
	try {
		db.prepare(
			'INSERT INTO Record (id, content, name, type, modified_on, zone_name, zone_id, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
		).run(
			record.id,
			record.content,
			record.name,
			record.type,
			record.modified_on,
			record.zone_name,
			record.zone_id,
			record.enabled
		);
	} catch (error) {
		console.error('Failed to create record:', error);
		throw error;
	}
}

/**
 * This function retrieves a Record from the database based on its ID.
 *
 * @param id - The ID of the record to retrieve.
 * @returns A promise that resolves to the record with the given ID.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * getRecord("1")
 *     .then((record) => console.log('Retrieved record:', record))
 *     .catch((error) => console.error('Failed to retrieve record', error));
 */
export async function getRecord(id: string): Promise<Record> {
	try {
		const result = db.prepare('SELECT * FROM Record WHERE id = ?').get(id) as Record;
		if (result === undefined) {
			throw new Error('No record found with the given ID');
		}
		return result;
	} catch (error) {
		console.error('Failed to get record:', error);
		throw error;
	}
}

/**
 * This function updates existing records in the database or inserts new records if they don't already exist.
 *
 * @param records - An array of records to upsert.
 * @returns A promise that resolves when all records have been upserted.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * upsertRecords([
 *     { id: '1', content: '127.0.0.1', name: 'localhost', type: 'A', modified_on: '2023-07-29', zone_name: 'example.com', zone_id: 1, enabled: true },
 *     { id: '2', content: '127.0.0.2', name: 'localhost', type: 'A', modified_on: '2023-07-29', zone_name: 'example.com', zone_id: 1, enabled: true },
 * ])
 *     .then(() => console.log('Records upserted'))
 *     .catch((error) => console.error('Failed to upsert records', error));
 */
export async function upsertRecords(records: Record[]) {
	try {
		for (const record of records) {
			const existingRecord = db.prepare('SELECT * FROM record WHERE id = ?').get(record.id);

			if (existingRecord) {
				db.prepare(
					`
            UPDATE record
            SET content = ?,
                name = ?,
                type = ?,
                modified_on = ?,
                zone_id = ?,
                zone_name = ?
            WHERE id = ?
          `
				).run(
					record.content,
					record.name,
					record.type,
					record.modified_on,
					record.zone_id,
					record.zone_name,
					record.id
				);
			} else {
				db.prepare(
					`
            INSERT INTO record (id, content, name, type, modified_on, zone_id, zone_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `
				).run(
					record.id,
					record.content,
					record.name,
					record.type,
					record.modified_on,
					record.zone_id,
					record.zone_name
				);
			}
		}

		console.log('Records upserted successfully');
	} catch (error) {
		console.error('Error upserting records: ', error);
		throw error;
	}
}

/**
 * Updates a specific record in the database using its `id` and an object with the updated values.
 *
 * @param id - The `id` of the record to update.
 * @param updatedRecord - An object containing the updated values for the record.
 * @returns A promise that resolves when the record has been updated.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * updateRecord('1', { content: '127.0.0.2', name: 'localhost', type: 'A', modified_on: '2023-07-30', zone_name: 'example.com', zone_id: 1, enabled: true })
 *     .then(() => console.log('Record updated'))
 *     .catch((error) => console.error('Failed to update record', error));
 */
export async function updateRecord(id: string, updatedRecord: Partial<Record>): Promise<void> {
	try {
		db.prepare(
			'UPDATE Record SET content = ?, name = ?, type = ?, modified_on = ?, zone_name = ?, zone_id = ?, enabled = ? WHERE id = ?'
		).run(
			updatedRecord.content,
			updatedRecord.name,
			updatedRecord.type,
			updatedRecord.modified_on,
			updatedRecord.zone_name,
			updatedRecord.zone_id,
			updatedRecord.enabled,
			id
		);
	} catch (error) {
		console.error('Failed to update record:', error);
		throw error;
	}
}

/**
 * Toggles the enabled status of a specific record in the database using its `id`.
 *
 * @param id - The `id` of the record to update.
 * @param enabled - The new enabled status (1 for enabled, 0 for disabled).
 * @returns A promise that resolves when the record's enabled status has been updated.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * updateRecordEnabled('1', 0)
 *     .then(() => console.log('Record enabled status updated'))
 *     .catch((error) => console.error('Failed to update record enabled status', error));
 */
export async function updateRecordEnabled(id: string, enabled: number): Promise<void> {
	try {
		db.prepare('UPDATE Record SET enabled = ? WHERE id = ?').run(enabled, id);
	} catch (error) {
		console.error('Failed to update record enabled status:', error);
		throw error;
	}
}

/**
 * Updates the `ipAddress` property of a specific record in the database using its `id`.
 *
 * @param id - The `id` of the record to update.
 * @param ipAddress - The new IP address to set for the record.
 * @returns A promise that resolves when the record's IP address has been updated.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * updateRecordIPAddress('1', '192.0.2.0')
 *     .then(() => console.log('Record IP address updated'))
 *     .catch((error) => console.error('Failed to update record IP address', error));
 */
export async function updateRecordIPAddress(id: string, ipAddress: string): Promise<void> {
	try {
		db.prepare('UPDATE Record SET content = ? WHERE id = ?').run(ipAddress, id);
	} catch (error) {
		console.error('Failed to update record IP address:', error);
		throw error;
	}
}

/**
 * Deletes a specific record from the database using its `id`.
 *
 * @param id - The `id` of the record to delete.
 * @returns A promise that resolves when the record has been deleted.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * deleteRecord('1')
 *     .then(() => console.log('Record deleted'))
 *     .catch((error) => console.error('Failed to delete record', error));
 */
export async function deleteRecord(id: string): Promise<void> {
	try {
		db.prepare('DELETE FROM Record WHERE id = ?').run(id);
	} catch (error) {
		console.error('Failed to delete record:', error);
		throw error;
	}
}

/**
 * Lists all records from the database optionally filtered by specific conditions.
 *
 * @param filter - An optional filter to apply to the listing operation. Each property of the filter corresponds to a field in the `Record` type.
 * @returns A promise that resolves to an array of records. If a filter is provided, only records matching the filter will be returned.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * listRecord({ enabled: true })
 *     .then((records) => console.log('Enabled records: ', records))
 *     .catch((error) => console.error('Failed to list records', error));
 */
export async function listRecord(filter?: Partial<Record>): Promise<Record[]> {
	try {
		let query = 'SELECT * FROM Record';
		const params: any[] = [];

		if (filter) {
			const conditions: string[] = [];

			if (filter.enabled) {
				conditions.push('enabled = ?');
				params.push(filter.enabled);
			}

			if (conditions.length > 0) {
				query += ' WHERE ' + conditions.join(' AND ');
			}
		}

		const results = db.prepare(query).all(...params) as Record[];
		return results;
	} catch (error) {
		console.error('Failed to list records:', error);
		throw error;
	}
}

// CRUD operations for Log
/**
 * Creates a new log in the database.
 *
 * @param action - The action associated with the log.
 * @param message - The message of the log.
 * @param type - The type of the log. Default value is 'INFO'.
 * @returns The result of the SQLite run operation which includes last insert rowid, number of rows changed etc.
 *
 * @example
 * createLog('RECORD_CREATED', 'A new record was created', 'INFO');
 *
 * @throws {Error} When there is an error performing the database operation.
 */
export function createLog(
	action: Log['action'],
	message: Log['message'],
	type: Log['type'] = 'INFO',
	related_object: Log['related_object'] = '',
	related_type: Log['related_type'] = ''
): RunResult {
	try {
		const insertQuery = db.prepare(`
		INSERT INTO log (action, message, type, related_object, related_type)
		VALUES (?, ?, ?, ?, ?)
	  `);

		const log = insertQuery.run(action, message, type, related_object, related_type);
		return log;
	} catch (error) {
		console.error('Error creating log: ', error);
		throw error;
	}
}

/**
 * Retrieves a log from the database by its id.
 *
 * @param id - The id of the log to be retrieved.
 * @returns The log object or undefined if no log is found.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * const log = getLog(1);
 */
export function getLog(id: number): Log | undefined {
	try {
		const log = db.prepare('SELECT * FROM log WHERE id = ?').get(id) as Log;
		return log;
	} catch (error) {
		console.error('Error retrieving log: ', error);
		throw error;
	}
}

/**
 * Updates a log in the database.
 *
 * @param id - The id of the log to be updated.
 * @param updatedLog - An object containing the updated fields of the log.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * updateLog(1, { message: 'Updated message' });
 */
export function updateLog(id: number, updatedLog: Partial<Log>): void {
	try {
		const { action, message, type } = updatedLog;
		db.prepare('UPDATE log SET action = ?, message = ?, type = ? WHERE id = ?').run(
			action,
			message,
			type,
			id
		);
	} catch (error) {
		console.error('Error updating log: ', error);
		throw error;
	}
}

/**
 * Deletes a log from the database.
 *
 * @param id - The id of the log to be deleted.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * deleteLog(1);
 */
export function deleteLog(id: number): void {
	try {
		db.prepare('DELETE FROM log WHERE id = ?').run(id);
	} catch (error) {
		console.error('Error deleting log: ', error);
		throw error;
	}
}

/**
 * Deletes all logs from the database.
 *
 * This function does not have any parameters or return anything.
 *
 * It will log a message to the console if the operation is successful, or throw an error if something goes wrong.
 *
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * purgeLog();
 */
export function purgeLog(): void {
	try {
		const deleteQuery = db.prepare('DELETE FROM log');
		deleteQuery.run();

		console.log('All logs deleted successfully');
	} catch (error) {
		console.error('Error deleting all logs: ', error);
		throw error;
	}
}

/**
 * Lists logs from the database based on the given filter.
 *
 * @param {LogFilter} filter - An optional filter to apply on the logs.
 *
 * @returns {Log[]} - An array of log objects.
 * @throws {Error} When there is an error performing the database operation.
 *
 * @example
 * const logs = listLog({type: 'INFO'});
 */
export function listLog(filter: LogFilter = {}): Log[] {
	try {
		let query = 'SELECT * FROM log';
		const values: (string | number)[] = [];
		const conditions: string[] = [];

		Object.keys(filter).forEach((key, index) => {
			if (filter[key as keyof LogFilter]) {
				conditions.push(`${key} = ?`);
				values.push(filter[key as keyof LogFilter] as string | number);
			}
		});

		if (conditions.length) {
			query += ' WHERE ' + conditions.join(' AND ');
		}

		query += ' ORDER BY timestamp DESC';

		const selectQuery = db.prepare(query);

		const logs = selectQuery.all(...values) as Log[]; // Use type assertion (as Log[])
		return logs;
	} catch (error) {
		console.error('Error getting all logs: ', error);
		throw error;
	}
}

// CRUD operations for IpProviders

/**
 * Creates a new IP Provider in the database.
 *
 * @param ipProviders - The IP Provider data to insert into the database.
 *
 * @returns A promise that resolves when the IP Provider has been created.
 *
 * @example
 * ```typescript
 * createIpProviders({ name: 'provider1', url: 'http://provider1.com', active: true })
 *     .then(() => console.log('IP Provider created'))
 *     .catch((error) => console.error('Failed to create IP Provider', error));
 * ```
 */
export async function createIpProviders(ipProviders: IpProviders): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			const insertQuery = db.prepare(
				'INSERT INTO IpProviders (name, url, active) VALUES (?, ?, ?)'
			);
			insertQuery.run(ipProviders.name, ipProviders.url, ipProviders.active);
			resolve();
		} catch (error) {
			console.error('Error creating IP Provider: ', error);
			reject(error);
		}
	});
}

/**
 * Retrieves an IP Provider from the database by its ID.
 *
 * @param id - The ID of the IP Provider to fetch from the database.
 * @returns A promise that resolves to the fetched IP Provider or rejects with an error if the operation fails.
 *
 * @example
 * ```typescript
 * try {
 *   const provider = await getIpProviders(1);
 *   console.log(provider);
 * } catch (error) {
 *   console.error('Error fetching IP Provider: ', error);
 * }
 * ```
 *
 * @throws Will throw an error if the fetching operation fails.
 */
export async function getIpProviders(id: IpProviders['id']): Promise<IpProviders> {
	try {
		const provider = db.prepare('SELECT * FROM IpProviders WHERE id = ?').get(id) as IpProviders;
		return provider;
	} catch (error) {
		console.error('Error fetching IP Provider: ', error);
		throw error;
	}
}

/**
 * Fetches all active IP Providers from the database.
 *
 * @returns A promise that resolves to an array of active IP Provider objects or rejects with an error if the operation fails.
 *
 * @example
 * ```typescript
 * try {
 *   const activeProviders = await getActiveIpProviders();
 *   console.log(activeProviders);
 * } catch (error) {
 *   console.error('Error fetching active IP Providers: ', error);
 * }
 * ```
 *
 * @throws Will throw an error if the fetching operation fails.
 */
export async function getActiveIpProviders(): Promise<IpProviders[]> {
	try {
		const query = db.prepare('SELECT * FROM ipproviders WHERE active = 1');
		const providers = query.all() as IpProviders[];
		return providers;
	} catch (error) {
		console.error('Error fetching active IP Providers: ', error);
		throw error;
	}
}

/**
 * Updates a specific IP Provider in the database using its `id` and an object with the updated values.
 *
 * @param id - The `id` of the IP Provider to update.
 * @param updatedIpProviders - An object containing the updated values for the IP Provider.
 *
 * @returns A promise that resolves when the IP Provider has been updated.
 *
 * @example
 * ```typescript
 * updateIpProviders(1, { name: 'newProviderName', url: 'http://newprovider.com', active: false })
 *     .then(() => console.log('IP Provider updated'))
 *     .catch((error) => console.error('Failed to update IP Provider', error));
 * ```
 */
export async function updateIpProviders(
	id: number,
	updatedIpProviders: Partial<IpProviders>
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			const updateQuery = db.prepare(
				'UPDATE IpProviders SET name = ?, url = ?, active = ? WHERE id = ?'
			);
			updateQuery.run(
				updatedIpProviders.name,
				updatedIpProviders.url,
				updatedIpProviders.active,
				id
			);
			resolve();
		} catch (error) {
			console.error('Error updating IP Provider: ', error);
			reject(error);
		}
	});
}

/**
 * Deletes a specific IP Provider from the database using its `id`.
 *
 * @param id - The `id` of the IP Provider to delete.
 *
 * @returns A promise that resolves when the IP Provider has been deleted.
 *
 * @example
 * ```typescript
 * deleteIpProviders(1)
 *     .then(() => console.log('IP Provider deleted'))
 *     .catch((error) => console.error('Failed to delete IP Provider', error));
 * ```
 */
export async function deleteIpProviders(id: number): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			const deleteQuery = db.prepare('DELETE FROM IpProviders WHERE id = ?');
			deleteQuery.run(id);
			resolve();
		} catch (error) {
			console.error('Error deleting IP Provider: ', error);
			reject(error);
		}
	});
}

/**
 * Lists all IP Providers from the database.
 *
 * @returns A promise that resolves to an array of IP Providers.
 *
 * @example
 * ```typescript
 * listIpProviders()
 *     .then((ipProviders) => console.log('IP Providers: ', ipProviders))
 *     .catch((error) => console.error('Failed to list IP Providers', error));
 * ```
 */
export async function listIpProviders(): Promise<IpProviders[]> {
	return new Promise<IpProviders[]>((resolve, reject) => {
		try {
			const selectQuery = db.prepare('SELECT * FROM IpProviders');
			const ipProviders = selectQuery.all() as IpProviders[];
			resolve(ipProviders);
		} catch (error) {
			console.error('Error listing IP Providers: ', error);
			reject(error);
		}
	});
}

/**
 * Creates a new Zone in the database.
 *
 * @param {Zones['name']} name - The name of the Zone to create.
 * @param {Zones['zone_id']} zone_id - The zone ID of the Zone to create.
 *
 * @returns {Promise<void>} - A promise that resolves when the Zone creation is complete.
 *
 * @throws {Error} - Throws an error if there was a problem with the database operation.
 *
 * @example
 * ```typescript
 * try {
 *   await createZone("example.com", "zone123");
 *   console.log("Zone created successfully.");
 * } catch (error) {
 *   console.error("Failed to create Zone:", error);
 * }
 * ```
 */
export async function createZone(name: Zones['name'], zone_id: Zones['zone_id']): Promise<void> {
	try {
		db.prepare('INSERT INTO Zones (name, zone_id) VALUES (?, ?)').run(
			name.toString(),
			zone_id.toString()
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to create zone: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to create zone.');
	}
}

/**
 * Retrieves a Zone from the database by its ID.
 *
 * @param {number} id - The ID of the Zone to retrieve.
 *
 * @returns {Zones | undefined} - The retrieved Zone, or undefined if the Zone does not exist.
 *
 * @throws {Error} - Throws an error if there was a problem with the database operation.
 */
export function getZones(id: number): Zones | undefined {
	try {
		const zone: Zones | undefined = db.prepare('SELECT * FROM zones WHERE id = ?').get(id) as
			| Zones
			| undefined;
		return zone;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to retrieve zone: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to retrieve zone.');
	}
}

/**
 * Updates a Zone in the database.
 *
 * @param {number} id - The ID of the Zone to update.
 * @param {Partial<Zones>} updatedZones - An object containing the fields to update.
 *
 * @throws {Error} - Throws an error if there was a problem with the database operation.
 */
export function updateZones(id: number, updatedZones: Partial<Zones>): void {
	try {
		// Construct an UPDATE query
		let query = 'UPDATE zones SET ';
		let params: (string | number)[] = [];
		for (let [key, value] of Object.entries(updatedZones)) {
			query += `${key} = ?, `;
			params.push(value);
		}
		query = query.slice(0, -2); // remove last comma and space
		query += ' WHERE id = ?';
		params.push(id);

		db.prepare(query).run(params);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to update zone: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to update zone.');
	}
}

/**
 * Deletes a Zone from the database.
 *
 * @param {number} id - The ID of the Zone to delete.
 *
 * @returns {Promise<void>} - A promise that resolves when the Zone deletion is complete.
 *
 * @throws {Error} - Throws an error if there was a problem with the database operation.
 *
 * @example
 * ```typescript
 * try {
 *   await deleteZones(1);
 *   console.log("Zone deleted successfully.");
 * } catch (error) {
 *   console.error("Failed to delete Zone:", error);
 * }
 * ```
 */
export async function deleteZones(id: number): Promise<void> {
	try {
		db.prepare('DELETE FROM zones WHERE id = ?').run(id);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to delete zone: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to delete zone.');
	}
}
/**
 * Lists all Zones from the database.
 *
 * @returns {Promise<{response: Zones[]}>} - A promise that resolves to an object containing an array of Zones.
 *
 * @throws {Error} - Throws an error if there was a problem with the database operation.
 *
 * @example
 * ```typescript
 * try {
 *   const { response: zones } = await listZones();
 *   console.log("Zones retrieved successfully:", zones);
 * } catch (error) {
 *   console.error("Failed to list Zones:", error);
 * }
 * ```
 */
export async function listZones(): Promise<{ response: Zones[] }> {
	try {
		const response: Zones[] = db.prepare('SELECT * FROM zones').all() as Zones[];
		return { response };
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to list zones: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to list zones.');
	}
}

// CRUD operations for Settings
/**
 * Creates a new setting in the database.
 *
 * @param settings - The settings object to be created.
 * @returns void
 *
 * @example
 * ```typescript
 * try {
 *   createSettings({name: 'SETTING_NAME', description: 'Setting description', value: 'Setting value'});
 *   console.log('Setting created successfully');
 * } catch (error) {
 *   console.error(`Failed to create settings: ${error}`);
 * }
 * ```
 *
 * @throws Will throw an error if the insertion operation fails.
 */
export function createSettings(settings: Settings): void {
	try {
		db.prepare('INSERT INTO Settings (name, description, value) VALUES (?, ?, ?)').run(
			settings.name,
			settings.description,
			settings.value
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to create setting: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to create setting.');
	}
}

/**
 * Fetches the settings for the provided name from the database.
 * If the settings with the provided name exist, it returns the settings object.
 * Otherwise, it returns undefined.
 *
 * @param {string} name - The name of the setting to be fetched.
 *
 * @returns {Settings | undefined} - The settings object for the provided name, or undefined if no settings are found.
 *
 * @throws {Error} - Throws an error if there was a problem with the database operation.
 *
 * @example
 * ```typescript
 * try {
 *   const setting = getSettings("mySettingName");
 *   if (setting) {
 *     console.log(`Setting Value: ${setting.value}`);
 *   } else {
 *     console.log('Setting not found');
 *   }
 * } catch (error) {
 *   console.error(`Failed to get settings: ${error}`);
 * }
 * ```
 */
export function getSettings(name: string): Settings | undefined {
	try {
		const setting = db.prepare('SELECT * FROM Settings WHERE name = ?').get(name) as
			| Settings
			| undefined;
		return setting;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to retrieve setting: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to retrieve setting.');
	}
}

/**
 * Updates a specific setting in the database.
 *
 * @param id - The ID of the setting to be updated.
 * @param updatedSettings - An object containing the updated fields of the setting.
 * @returns void
 *
 * @example
 * ```typescript
 * try {
 *   updateSettings(1, {name: 'UPDATED_SETTING_NAME'});
 *   console.log('Setting updated successfully');
 * } catch (error) {
 *   console.error(`Failed to update settings: ${error}`);
 * }
 * ```
 *
 * @throws Will throw an error if the update operation fails.
 */
export function updateSettings(id: number, updatedSettings: Partial<Settings>): void {
	try {
		db.prepare('UPDATE Settings SET name = ?, description = ?, value = ? WHERE id = ?').run(
			updatedSettings.name,
			updatedSettings.description,
			updatedSettings.value,
			id
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to update setting: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to update setting.');
	}
}

/**
 * Deletes a specific setting from the database.
 *
 * @param id - The ID of the setting to be deleted.
 * @returns void
 *
 * @example
 * ```typescript
 * try {
 *   deleteSettings(1);
 *   console.log('Setting deleted successfully');
 * } catch (error) {
 *   console.error(`Failed to delete settings: ${error}`);
 * }
 * ```
 *
 * @throws Will throw an error if the deletion operation fails.
 */
export function deleteSettings(id: number): void {
	try {
		db.prepare('DELETE FROM Settings WHERE id = ?').run(id);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to delete setting: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to delete setting.');
	}
}

/**
 * Retrieves all settings from the database.
 *
 * @returns An array of all settings in the database.
 *
 * @example
 * ```typescript
 * try {
 *   const settings = listSettings();
 *   console.log('List of settings:', settings);
 * } catch (error) {
 *   console.error(`Failed to list settings: ${error}`);
 * }
 * ```
 *
 * @throws Will throw an error if the retrieval operation fails.
 */
export function listSettings(): Settings[] {
	try {
		const settings: Settings[] = db.prepare('SELECT * FROM Settings').all() as Settings[];
		return settings;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Failed to list settings: ' + error.message);
		}
		throw new Error('An unexpected error occurred while trying to list settings.');
	}
}
