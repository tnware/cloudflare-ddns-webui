import { listLog } from '$lib/server/api';
import { json } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	try {
		const type = url.searchParams.get('type') ?? '';
		const action = url.searchParams.get('action') ?? '';
		const related_object = url.searchParams.get('related_object') ?? '';

		const logs = listLog({ type, action, related_object });

		return json(logs);
	} catch (error) {
		return json(error);
	}
}
