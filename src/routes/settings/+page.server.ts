import type { PageServerLoad } from './$types';
import { db } from '$lib/server/sqlite-db';
import type { IpProviders } from '$lib/types/db';
import { getSettings } from '$lib/server/sqlite-api';

/**
 * This function loads the data needed by the SvelteKit page on the server-side.
 * Specifically, it fetches the list of all IP Providers from the 'IpProviders' table in the database 
 * and fetches the 'ip_update_interval' setting using the `getSettings` function
 * from the '$lib/server/api' module. 
 * The list of IP Providers and 'ip_update_interval' setting is then returned in an object,
 * which is used by the SvelteKit page to render its server-side component. This function
 * satisfies the `PageServerLoad` type from SvelteKit's type definitions.
 * 
 * @function load
 * @returns {Promise<{ ipProviders: IpProviders[], ipUpdateInterval_setting: Settings }>} An object containing the list of all IP Providers and 'ip_update_interval' setting. These
 * are then accessible in the page script as `let ipProviders = data.ipProviders;` and `let ipUpdateInterval_setting = data.ipUpdateInterval_setting;`
 * 
 * @example

 * // In the SvelteKit page.svelte
 * <script>
 *   export let data: PageData;
 *   let ipProviders: IpProviders[] = data.ipProviders;
 *   let ipUpdateInterval_setting: Settings = data.ipUpdateInterval_setting;
 * </script>
 */
export const load: PageServerLoad = async () => {
	const ipProviders: IpProviders[] = db.prepare('SELECT * FROM IpProviders').all() as IpProviders[];
	const ipUpdateInterval_setting = getSettings('ip_update_interval');
	const automaticRefresh_setting = getSettings('automatic_ip_refresh');
	return { ipProviders, ipUpdateInterval_setting, automaticRefresh_setting };
};
