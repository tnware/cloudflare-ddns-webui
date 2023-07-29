import { db } from '$lib/server/db';
import type { PageServerLoad } from '../$types';
import { getIPAddress, listRecord } from '$lib/server/api';

/**
 * This function loads various information from the server: a list of enabled records,
 * the total count of records, the count of enabled records, and the IP address of the server.
 *
 * It uses the 'listRecord', 'getIPAddress' functions from the '$lib/server/api' module,
 * and direct database queries to retrieve this information.
 *
 * @example
 * // How to access the response in the corresponding .svelte page
 * <script>
 * 	export let data: PageData;
 * 	let records = data.records;
 * 	let ipAddress = data.ipAddress;
 * 	let total_count = data.total_count;
 * 	let enabled_count = data.enabled_count;
 * </script>
 */
export const load: PageServerLoad = () => {
	const records = listRecord({ enabled: 1 });
	const total_count: number = db.prepare('SELECT COUNT(*) FROM record').pluck().get() as number;
	const enabled_count: number = db
		.prepare('SELECT COUNT(*) FROM record WHERE enabled = 1')
		.pluck()
		.get() as number;
	const ipAddress = getIPAddress(1);
	return { props: { records: records, ipAddress, total_count, enabled_count } };
};
