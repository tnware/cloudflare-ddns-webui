import type { PageServerLoad } from './$types';
import { listLog } from '$lib/server/sqlite-api';

/**
 * This function loads the data needed by the SvelteKit page on the server-side.
 * Specifically, it fetches the logs with type 'INFO' using the `listLog` function
 * from the '$lib/server/api' module. The logs are then returned in an object,
 * which is used by the SvelteKit page to render its server-side component. This function
 * satisfies the `PageServerLoad` type from SvelteKit's type definitions.
 *
 * @function load
 * @returns {Promise<{ logs: Log[] }>} An object containing the logs with type 'INFO'. These logs are
 * then accessible in the page script as `let logs = data.logs;`
 *
 * @example
 * // In the SvelteKit page.svelte
 * <script>
 *   export let data: PageData;
 *   let logs: Log[] = data.logs;
 * </script>
 */
export const load: PageServerLoad = async () => {
	let logs = listLog();
	return { logs };
};
