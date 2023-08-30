import { db } from "$lib/server/database";
import type { PageServerLoad } from "./$types";
import { getIPAddress, getSettings, listRecord } from "$lib/server/api";

/**
 * This function loads the data needed by the SvelteKit page on the server-side.
 * Specifically, it fetches the IP address and the count of enabled records using
 * the `getIPAddress` function from the '$lib/server/api' module and
 * SQLite query respectively. The fetched data is then returned in an object,
 * which is used by the SvelteKit page to render its server-side component. This function
 * satisfies the `PageServerLoad` type from SvelteKit's type definitions.
 *
 * @function load
 * @returns {Promise<{ ipAddress: string, enabled_count: number }>} An object containing the IP address
 * and the count of enabled records. These values are then accessible in the page script as
 * `let ipAddress = data.ipAddress;` and `let enabled_count = data.enabled_count;`
 *
 * @example
 * // In the SvelteKit page script
 * <script>
 *   export let data: PageData;
 *   let ipAddress: string = data.ipAddress;
 *   let enabled_count: number = data.enabled_count;
 * </script>
 */
export const load: PageServerLoad = async () => {
  const records = await listRecord({ enabled: 1 });
  const ipAddress = await getIPAddress(1);
  const enabled_count = await db("record")
    .where("enabled", 1)
    .count("* as count");
  const automaticRefresh_setting = await getSettings("automatic_ip_refresh");
  return { ipAddress, enabled_count, records, automaticRefresh_setting };
};
