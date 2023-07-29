<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	export let deleteModal;
	export let zone;
	import { invalidateAll } from '$app/navigation';
	import type { Zones } from '$lib/types/db';

	async function deleteZone(id: Zones['id']) {
		const response = await fetch('/zones', {
			method: 'POST',
			body: JSON.stringify({ id: id, action: 'deleteZone' }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			deleteModal = false;
			invalidateAll();
			console.log(response.statusText);
		}
	}
</script>

<Modal bind:open={deleteModal} size="xs" autoclose>
	<div class="text-center">
		<svg
			aria-hidden="true"
			class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this zone?
		</h3>
		<Button color="red" class="mr-2" on:click={() => deleteZone(zone.id)}>Yes, I'm sure</Button>
		<Button color="alternative" on:click={() => ((deleteModal = false), (zone = ''))}
			>No, cancel</Button
		>
	</div>
</Modal>
