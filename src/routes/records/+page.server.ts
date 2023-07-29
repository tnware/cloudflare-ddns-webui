import { db } from '$lib/server/db';
import type { PageServerLoad } from '../$types';
import { getIPAddress, listRecord } from '$lib/server/api';

/**
 * This function is responsible for loading the data needed by a SvelteKit page on the server-side.
 * It fetches a list of records using the `listRecord` function from the '$lib/server/api' module,
 * counts the total number of records and the number of enabled records using SQLite queries, and
 * retrieves the IP address using the `getIPAddress` function. The results are returned in an object,
 * which can be used by the SvelteKit page to render its server-side component. This function
 * satisfies the `PageServerLoad` type from SvelteKit's type definitions.
 *
 * @function load
 * @returns {Promise<{ records: Record[], ipAddress: string, total_count: number, enabled_count: number }>}
 * An object containing the list of records, IP address, total count of records, and count of enabled records.
 * These values can be accessed in the page script as
 * - `let records = data.records;`
 * - `let ipAddress = data.ipAddress;`
 * - `let total_count = data.total_count;`
 * - `let enabled_count = data.enabled_count;`
 *
 * @example
 * // In the SvelteKit page.svelte
 * <script>
 *   export let data: PageData;
 *   let records: Record[] = data.records;
 *   let ipAddress: string = data.ipAddress;
 *   let total_count: number = data.total_count;
 *   let enabled_count: number = data.enabled_count;
 * </script>
 */
export const load: PageServerLoad = () => {
	const records = listRecord();
	const total_count: number = db.prepare('SELECT COUNT(*) FROM record').pluck().get() as number;
	const enabled_count: number = db
		.prepare('SELECT COUNT(*) FROM record WHERE enabled = 1')
		.pluck()
		.get() as number;
	const ipAddress = getIPAddress(1);
	return { records: records, ipAddress, total_count, enabled_count };
};
