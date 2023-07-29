import type { PageServerLoad } from './$types';
import { listLog } from '$lib/server/api';

/**
 * This function loads logs from the server that have the 'action' set to 'record_updated'.
 * It uses the 'listLog' function from the '$lib/server/api' module to retrieve the logs.
 *
 * @example
 * // How to access the response in the corresponding .svelte page
 * <script>
 * 	export let data: PageData;
 * 	let logs = data.logs;
 * </script>
 */
export const load: PageServerLoad = async () => {
	const logs = listLog({ action: 'record_updated' });
	return { props: { logs } };
};
