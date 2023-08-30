import { json } from '@sveltejs/kit';
import { getDnsRecords } from '$lib/utils/apis.js';
import { createZone, deleteZones } from '$lib/server/api';

/**
 * This function serves as the POST request handler. It receives a JSON payload,
 * determines the requested action from the payload's 'action' field, and
 * then performs one of several operations based on that action.
 *
 * The possible actions are:
 * - 'createZone': creates a new zone with a provided name and id.
 * - 'updateRecords': triggers an update of the DNS records for a provided zone_id.
 * - 'deleteZone': deletes a zone with a provided id.
 *
 * The JSON payload should have the following format:
 * ```json
 * {
 *   "action": "createZone" | "updateRecords" | "deleteZone",
 *   "name": string,  // required for 'createZone' action
 *   "id": number,    // required for 'createZone' and 'deleteZone' actions
 *   "zone_id": number  // required for 'updateRecords' action
 * }
 * ```
 *
 * @function POST
 * @param {Object} request - The HTTP request object.
 * @returns {Promise<Object>} The response object to be sent to the client.
 *
 * @example
 * // In the client code
 * fetch("/api/endpoint", {
 *   method: "POST",
 *   body: JSON.stringify({
 *     action: "createZone",
 *     name: "example.com",
 *     id: 123
 *   })
 * });
 */
export async function POST({ request }: { request: Request }) {
	const payload = await request.json();

	if (payload.action === 'createZone') {
		const { name, id } = payload;
		let row = await createZone(name, id);
		console.log('Wrote zone to the database');
		return json(row);
	} else if (payload.action === 'updateRecords') {
		const { zone_id } = payload;
		getDnsRecords(zone_id);
		return json({ success: true, message: 'Triggered DNS record update successfully.' });
	} else if (payload.action === 'deleteZone') {
		const { id } = payload;
		let row = await deleteZones(id);
		console.log('Deleted zone from the database');
		return json(row);
	}

	return json({ success: false, message: 'Invalid action' });
}
