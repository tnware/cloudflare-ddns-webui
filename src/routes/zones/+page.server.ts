import type { PageServerLoad } from './$types';
import { listZones } from '$lib/server/sqlite-api';

/**
 * This function loads the data needed by the SvelteKit page on the server-side.
 * Specifically, it fetches the list of all DNS zones using the `listZones` function
 * from the '$lib/server/api' module. The list of zones is then returned in an object,
 * which is used by the SvelteKit page to render its server-side component.
 * This function satisfies the `PageServerLoad` type from SvelteKit's type definitions.
 *
 * @function load
 * @returns {Promise<{ zones: Zones[] }>} An object containing the list of all DNS zones.
 *
 * @example
 * // In the SvelteKit page.svelte
 * <script>
 *   export let data: PageData;
 *   let zones = data.zones;
 * </script>
 */
export const load: PageServerLoad = async () => {
	const zones = await listZones();
	return { zones: zones.response };
};
