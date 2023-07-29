import { json } from '@sveltejs/kit';
import { updateRecordEnabled } from '$lib/server/api.js';

/**
 * This asynchronous function handles POST requests. It expects a JSON payload in the request with 'enabled' and 'id' keys.
 * It then uses the 'updateRecordEnabled' function from the '$lib/server/api.js' module to update the enabled status of a record.
 *
 * @function POST
 * @param {Object} request - The request object coming from the SvelteKit endpoint.
 * @returns {Promise<Response>} - The promise for the response to be sent back to the client, containing the result of the 'updateRecordEnabled' function call.
 *
 * @example
 * // Request JSON payload format
 * {
 *   "enabled": 1 | 0,  // 1 for enabling, 0 for disabling
 *   "id": number  // ID of the record to be updated
 * }
 *
 * @example
 * // Sending request from client-side
 * (async () => {
 *   const response = await fetch(`/records`, {
 *     method: 'POST',
 *     body: JSON.stringify({ enabled: true ? 1 : 0, id: 1 }),
 *     headers: {
 *       'content-type': 'application/json'
 *     }
 *   });
 *   const data = await response.json();
 *   console.log(data);
 * })();
 *
 */
export async function POST({ request }: { request: Request }) {
	const { enabled, id } = await request.json();
	const recordEnabled = updateRecordEnabled(id, enabled);
	return json(recordEnabled);
}
