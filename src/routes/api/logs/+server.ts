import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const type = url.searchParams.get('type') ?? '';
		const action = url.searchParams.get('action') ?? '';
		const related_object = url.searchParams.get('related_object') ?? '';

		// Load the Record with the given id
		const record = await db('Record').where('id', related_object).first();

		// Load the logs related to this record, ordered by timestamp
		const logs = await db('RecordLog').where('record_id', record.id).orderBy('timestamp', 'desc');

		return json(logs);
	} catch (error) {
		return json(error);
	}
}
