import { json } from '@sveltejs/kit';
import { updateRecordEnabled } from '$lib/server/api';

/**
 * This function is a SvelteKit server route handler for POST requests to '/records'.
 * The JSON payload should contain an 'enabled' property and an 'id' property.
 *
 * @param {Object} request - The Request object.
 * @property {Object} request.json - An async function that returns the body parsed as JSON.
 *
 * @returns {Object} - Returns a response with the updated record enabled status.
 *
 * @example
 * // This is how you can send a request from the client side:
 * const response = await fetch(`/records`, {
 *	method: 'POST',
 *	body: JSON.stringify({ enabled: enabled ? 1 : 0, id: id }),
 *	headers: {
 *		'content-type': 'application/json'
 *	}
 * });
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }: { request: Request }) {
	const { enabled, id } = await request.json();
	const recordEnabled = updateRecordEnabled(id, enabled);
	return json(recordEnabled);
}
