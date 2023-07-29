<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import ZoneListItem from './ZoneListItem.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { Zones } from '$lib/types/db';

	export let data: PageData;
	let zones = data.zones;
	let formModal = false;
	let deleteModal = false;
	let new_zone_id = '';
	let new_zone_name = '';
	async function createZone(name: Zones['name'], id: Zones['zone_id']) {
		const response = await fetch('/zones', {
			method: 'POST',
			body: JSON.stringify({ name: name, id: id, action: 'createZone' }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			formModal = false;
			invalidateAll();
			new_zone_id = '';
			new_zone_name = '';
			console.log(response.statusText);
		}
	}

	async function updateRecords(zone_id: Zones['zone_id']) {
		const response = await fetch('/zones', {
			method: 'POST',
			body: JSON.stringify({ zone_id: zone_id, action: 'updateRecords' }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			console.log(response.statusText);
		}
	}

	$: zones = data.zones;
</script>

<div class="text-end">
	<Button on:click={() => (formModal = true)}>
		<svg
			aria-hidden="true"
			class="mr-2 -ml-1 w-5 h-5"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
			/></svg
		> Add Zone
	</Button>
</div>

<div class="flex flex-col gap-4 items-center">
	{#if zones}
		{#each zones as zone}
			<ZoneListItem {zone}>
				<Button on:click={() => updateRecords(zone.zone_id)}>Update Records</Button>
			</ZoneListItem>
		{/each}
	{/if}
</div>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" action="#">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add new Zone</h3>
		<Label class="space-y-2">
			<span>Zone Name</span>
			<Input
				type="text"
				name="zone_name"
				placeholder="example.com"
				bind:value={new_zone_name}
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Zone ID</span>
			<Input
				type="text"
				name="zone_id"
				placeholder="023e105f4ecef8ad9ca31a8372d0c353"
				bind:value={new_zone_id}
				required
			/>
		</Label>

		<Button type="submit" class="w-full1" on:click={() => createZone(new_zone_name, new_zone_id)}
			>Save Zone</Button
		>
	</form>
</Modal>
