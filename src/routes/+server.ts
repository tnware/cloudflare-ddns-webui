import { fetchIPAddress } from '$lib/utils/apis';

/**
 * This function serves as the POST request handler. It triggers fetching of IP address and
 * returns an empty HTTP response. The POST request doesn't require any JSON payload currently.
 *
 * @function POST
 * @param {Object} request - The HTTP request object.
 * @returns {Promise<Response>} An empty HTTP response.
 *
 * @example
 * // In the client code
 * fetch("/", { method: "POST" });
 */
export async function POST({ request }: { request: Request }) {
	const payload = await request.json();
	fetchIPAddress(true);
	return new Response();
}
