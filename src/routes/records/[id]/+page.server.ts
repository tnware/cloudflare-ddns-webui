import { error } from '@sveltejs/kit';
import { getRecord } from '$lib/server/api.js';

/**
 * This function loads a specific record from the server by its ID.
 * It uses the 'getRecord' function from the '$lib/server/api.js' module to retrieve the record.
 *
 * @param {Object} params - An object containing a string 'id' field representing the record ID.
 * @returns {Object} - If the record is found, returns an object containing the record.
 * Otherwise, it throws an HTTP 404 error.
 *
 * @example
 * // How to access the returned data in the corresponding .svelte page
 * <script>
 *     export let data: PageData;
 *     let record = data.record;
 * </script>
 *
 * @throws {Error} - Throws an error with status code 404 if the record is not found.
 *
 */
export async function load({ params }: { params: { id: string } }) {
	const record = await getRecord(params.id);
	if (record) {
		return { props: { record: record } };
	}

	throw error(404, 'Not found');
}
