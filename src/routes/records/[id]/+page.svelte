<script lang="ts">
	import { Toggle } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let record = data.props.record;
	let enabled = record.enabled === 1;

	async function toggleStatus() {
		enabled = !enabled; // Toggle the enabled state
		const response = await fetch(`/records/${record.id}`, {
			method: 'POST',
			body: JSON.stringify({ enabled: enabled ? 1 : 0, id: record.id }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			record.enabled = enabled ? 1 : 0; // Update the enabled value on the record object
		}
	}
</script>

<!-- This is an example component -->
<div class=" bg-white dark:bg-gray-900 w-full rounded-lg shadow-xl dark:text-white">
	<div class="p-4 border-b dark:border-slate-600">
		<h2 class="text-2xl dark:text-white">{record.name}</h2>
		<p class="text-sm text-gray-500">{record.id}</p>
	</div>
	<div>
		<div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4 border-b dark:border-slate-600"
		>
			<p class="text-gray-600 dark:text-gray-400">Automatic Updates</p>
			<p><Toggle checked={enabled} on:click={toggleStatus} /></p>
		</div>
		<div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4 border-b dark:border-slate-600"
		>
			<p class="text-gray-600 dark:text-gray-400">Record Name:</p>
			<p>{record.name}</p>
		</div>
		<div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4 border-b dark:border-slate-600"
		>
			<p class="text-gray-600 dark:text-gray-400">Content:</p>
			<p>{record.content}</p>
		</div>
		<div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4 border-b dark:border-slate-600"
		>
			<p class="text-gray-600 dark:text-gray-400">Last Modified:</p>
			<p>{new Date(record.modified_on)}</p>
		</div>
		<div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4 border-b dark:border-slate-600"
		>
			<p class="text-gray-600 dark:text-gray-400">Type:</p>
			<p>({record.type}) Record</p>
		</div>
		<div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4 border-b dark:border-slate-600"
		>
			<p class="text-gray-600 dark:text-gray-400">Zone Name:</p>
			<p>{record.zone_name}</p>
		</div>
		<div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4"
		>
			<p class="text-gray-600 dark:text-gray-400">Zone ID:</p>
			<p>{record.zone_id}</p>
		</div>
		<!-- <div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4 border-b dark:border-slate-500"
		>
			<p class="text-gray-600 dark:text-gray-400">Enable for dynamic updates</p>
			<p><Toggle checked={enabled} on:click={toggleStatus} /></p>
		</div> -->
		<!-- <div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4 border-b dark:border-slate-500"
		>
			<p class="text-gray-600 dark:text-gray-400">About</p>
			<p>
				Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa
				consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in
				ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui
				eu.
			</p>
		</div>
		<div
			class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-gray-700 md:space-y-0 space-y-1 p-4"
		>
			<p class="text-gray-600 dark:text-gray-400">Actions</p>
			<div class="space-y-2">
				<div class="border-2 flex items-center p-2 rounded justify-between space-x-2">One</div>

				<div class="border-2 flex items-center p-2 rounded justify-between space-x-2">Two</div>
			</div>
		</div> -->
	</div>
</div>
