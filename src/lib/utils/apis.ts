import axios from 'axios';
import { createLog, listRecord, upsertIPAddress } from '$lib/server/api';
import { SECRET_CLOUDFLARE_AUTH, SECRET_CLOUDFLARE_EMAIL } from '$env/static/private';
import { db } from '$lib/server/db';
import type { IPAddress, Record, IpProviders, Zones } from '$lib/types/db';
import { updateRecordIPAddress, upsertRecords, getActiveIpProviders } from '$lib/server/api';

/**
 * This async function checks each enabled DNS record against the current public IP.
 * If a record's content doesn't match the public IP, the function logs this event,
 * updates the DNS record with the new IP and logs the updated record.
 * If a record's content matches the public IP, the function logs that the IP hasn't changed.
 *
 * @param {string} publicIp - The current public IP address.
 *
 * @example
 * // Example usage
 * await checkRecordsAgainstIP('192.168.0.1');
 *
 * @returns {Promise<void>} No return value
 */
export async function checkRecordsAgainstIP(publicIp: string): Promise<void> {
	const results = await listRecord({ enabled: 1 });

	results.forEach((record: Record) => {
		if (record.content !== publicIp) {
			console.log('Public IP Changed! object: ' + record.name);
			updateDnsRecord(record, publicIp);
			console.log(record);
		} else {
			console.log("Public IP Hasn't changed for object " + record.name);
			createLog('public_ip_not_changed', record.name);
			createLog('query_public_ip', "Public IP Hasn't changed for object " + record.name);
		}
	});
}

/**
 * This async function retrieves the public IP address from a list of active IP providers.
 * Each provider's URL is used to make a GET request, and the IP address from the response is logged and added to a set.
 * If a request fails, the error is logged.
 * The function then determines the most common IP address in the responses and returns it.
 *
 * @example
 * // Example usage
 * const publicIp = await getPublicIPAddress();
 *
 * @returns {Promise<string | undefined>} The most common IP address in the responses, or undefined if all requests fail.
 */
export async function getPublicIPAddress(): Promise<string | undefined> {
	const providers_fromdb: IpProviders[] = await getActiveIpProviders(); // Add await here

	// Extract the URLs from the database response
	const providers = providers_fromdb.map((provider) => provider.url);

	console.log('Using providers: \n' + providers);

	const ipAddressSet = new Set<string>();
	const ipAddressMap: { [ipAddress: string]: number } = {};

	const responses = await Promise.all(
		providers.map(async (provider) => {
			try {
				const response = await axios.get(provider);
				const logMessage = provider + ':' + JSON.stringify(response.data);
				console.log(logMessage); // Log to console
				createLog('query_public_ip', logMessage, 'DEBUG');
				const ipAddress = response.data.ip || response.data.ip_address || response.data.ipAddress;
				if (ipAddress && !ipAddressSet.has(ipAddress)) {
					ipAddressSet.add(ipAddress);
					ipAddressMap[ipAddress] = (ipAddressMap[ipAddress] || 0) + 1;
				}
				return ipAddress;
			} catch (error: any) {
				const errorMessage = `Failed to retrieve IP address from ${provider}: ` + error.message;
				console.error(errorMessage); // Log to console
				createLog('query_public_ip', errorMessage, 'ERROR');
				return undefined;
			}
		})
	);

	let mostCommonIPAddress: string | undefined;
	let maxOccurrences = 0;

	for (const ipAddress of responses) {
		if (ipAddress) {
			const occurrences = (ipAddressMap[ipAddress] || 0) + 1;
			if (occurrences > maxOccurrences) {
				maxOccurrences = occurrences;
				mostCommonIPAddress = ipAddress;
			}
			ipAddressMap[ipAddress] = occurrences;
		}
	}

	return mostCommonIPAddress;
}

/**
 * This async function updates a DNS record on Cloudflare.
 * A PUT request is made to the Cloudflare API with the new IP address.
 * If the request is successful, the response is logged and the function updates the record's IP address.
 * If the request fails, an error message is logged.
 *
 * @param {Record} record - A record object containing the record's details.
 * @param {Record['content']} newIpAddress - The new IP address for the record.
 *
 * @example
 * // Example usage
 * const updatedRecordResponse = await updateDnsRecord(record, newIpAddress);
 *
 * @returns {Promise<Object>} An object containing the result of the update or an error message.
 */
export async function updateDnsRecord(record: Record, newIpAddress: Record['content']) {
	const url = `https://api.cloudflare.com/client/v4/zones/${record.zone_id}/dns_records/${record.id}`;
	const headers = {
		'Content-Type': 'application/json',
		Authorization: SECRET_CLOUDFLARE_AUTH,
		'X-Auth-Email': SECRET_CLOUDFLARE_EMAIL
	};

	const data = {
		content: newIpAddress,
		name: record.name,
		type: record.type
	};

	try {
		const response = await axios.put(url, data, { headers });
		const result = response.data.result;
		console.log('DNS record updated successfully:', result);
		createLog('record_updated', record.name + ' => ' + newIpAddress, 'INFO', record.id, 'Record');
		updateRecordIPAddress(record.id, newIpAddress);
		return {
			result: result
		};
	} catch (error: any) {
		console.error('Error updating DNS record:', error.message);
		createLog(
			'record_updated',
			'Error updating record with new IP address ' + newIpAddress + ': ' + error.message,
			'ERROR',
			record.id,
			'Record'
		);
		return {
			error: 'An error occurred while retrieving DNS records.'
		};
	}
}

/**
 * This async function retrieves DNS records from Cloudflare for a given zone.
 * A GET request is made to the Cloudflare API.
 * If the request is successful, the response is logged, the records are upserted, and a success message is returned.
 * If the request fails, an error message is logged and returned.
 *
 * @param {Zones['zone_id']} zone_id - The zone_id string identifier.
 *
 * @example
 * // Example usage
 * const recordsResponse = await getDnsRecords(zone_id);
 *
 * @returns {Promise<Object>} An object containing the records or an error message.
 */
export async function getDnsRecords(zone_id: Zones['zone_id']) {
	const zoneIdentifier = zone_id;
	const url = `https://api.cloudflare.com/client/v4/zones/${zoneIdentifier}/dns_records?type=A`;
	const headers = {
		'Content-Type': 'application/json',
		Authorization: SECRET_CLOUDFLARE_AUTH,
		'X-Auth-Email': SECRET_CLOUDFLARE_EMAIL
	};

	try {
		const response = await axios.get(url, { headers });
		const records = response.data.result;
		upsertRecords(records);
		createLog('query_dns_records', 'DNS records retrieved successfully');
		console.log('DNS records retrieved successfully.');
		return {
			records: records
		};
	} catch (error: any) {
		createLog('query_dns_records', 'Error retrieving DNS records: ' + error.message, 'ERROR');
		console.error('Error retrieving DNS records:', error.message);
		return {
			error: 'An error occurred while retrieving DNS records.'
		};
	}
}

/**
 * This async function retrieves the public IP address and updates it in the database.
 * If the 'runCheck' argument is true, it also checks the DNS records against the IP.
 *
 * @param {Boolean} runCheck - Indicates whether to check DNS records against the IP.
 *
 * @example
 * // Example usage
 * await fetchIPAddress(true);
 *
 * @returns {Promise<void>} A Promise that resolves when the function is finished.
 */
export const fetchIPAddress = async (runCheck: Boolean) => {
	const currentDate = new Date();
	const lastUpdated = currentDate.toISOString(); // Convert to ISO string format

	try {
		const result = await getPublicIPAddress();
		if (result === undefined) {
			createLog('public_ip_result', 'Failed to get public IP.', 'ERROR');
		} else {
			console.log('Determiend Public IP Address:', result);
			createLog('public_ip_result', result, 'DEBUG');
			upsertIPAddress(result, lastUpdated);
			if (runCheck) {
				checkRecordsAgainstIP(result);
			}
		}
	} catch (error) {
		console.error('Error retrieving public IP address:', error);
		createLog('public_ip_result', 'Error retrieving public IP address', 'ERROR');
	}
};
