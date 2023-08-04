import { db } from '$lib/server/sqlite-db.js';
import { json } from '@sveltejs/kit';
import { getIpProviders } from '$lib/server/sqlite-api.js';

/**
 * This function serves as the POST request handler. It receives a JSON payload,
 * determines the requested action from the payload's 'action' field, and
 * then performs one of several operations based on that action.
 *
 * The possible actions are:
 * - 'updateIpProviderStatus': updates the status of an IP provider with the provided ID.
 * - 'updateIpRefreshInterval': updates the refresh interval for IP updates.
 *
 * The JSON payload should have the following format:
 * ```json
 * {
 *   "action": "updateIpProviderStatus" | "updateIpRefreshInterval",
 *   "id": number, // required for 'updateIpProviderStatus' action
 *   "active": boolean, // required for 'updateIpProviderStatus' action
 *   "interval": number  // required for 'updateIpRefreshInterval' action
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
 *     action: "updateIpProviderStatus",
 *     id: 123,
 *     active: true
 *   })
 * });
 */
export async function POST({ request }: { request: Request }) {
	const payload = await request.json();

	if (payload.action === 'updateIpProviderStatus') {
		const { id, active } = payload;
		const ipProvider = getIpProviders(id);

		if (!ipProvider) {
			return json({
				status: 404,
				body: {
					error: 'IpProvider not found'
				}
			});
		}

		const newStatus = active ? 1 : 0;
		db.prepare('UPDATE IpProviders SET active = ? WHERE id = ?').run(newStatus, id);

		return json({
			status: 200,
			body: {
				success: true,
				message: 'IpProvider status updated successfully'
			}
		});
	} else if (payload.action === 'automaticIpRefreshToggle') {
		const { automaticIpRefresh } = payload;
		const newValue = automaticIpRefresh ? 'true' : 'false';
		db.prepare('UPDATE Settings SET value = ? WHERE name = ?').run(
			newValue,
			'automatic_ip_refresh'
		);

		return json({
			status: 200,
			body: {
				success: true,
				message: 'Automatic IP Refresh status updated successfully'
			}
		});
	} else if (payload.action === 'updateIpRefreshInterval') {
		const { interval } = payload;
		db.prepare('UPDATE Settings SET value = ? WHERE name = ?').run(interval, 'ip_update_interval');
		return json({ success: true, message: 'IP refresh interval updated successfully' });
	}
	return json({
		status: 400,
		body: {
			error: 'Invalid action'
		}
	});
}
