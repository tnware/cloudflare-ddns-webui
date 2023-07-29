<script lang="ts">
	import type { Zones } from '$lib/types/db';
	import { Button, Modal } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';
	export let zone: Zones;
	export let deleteModal = false;

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
			Are you sure you want to delete this zone? All records associatd with this zone will also be
			deleted.
		</h3>
		<Button color="red" class="mr-2" on:click={() => deleteZone(zone.id)}>Yes, I'm sure</Button>
		<Button color="alternative" on:click={() => (deleteModal = false)}>No, cancel</Button>
	</div>
</Modal>

<div
	class="rounded-sm w-1/2 grid grid-cols-12 bg-white dark:bg-gray-900 shadow p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform"
>
	<!-- Icon -->
	<div class="col-span-12 md:col-span-1">
		<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 128 128"
			><path
				fill="#FFF"
				d="m115.679 69.288l-15.591-8.94l-2.689-1.163l-63.781.436v32.381h82.061z"
			/><path
				fill="#F38020"
				d="M87.295 89.022c.763-2.617.472-5.015-.8-6.796c-1.163-1.635-3.125-2.58-5.488-2.689l-44.737-.581c-.291 0-.545-.145-.691-.363s-.182-.509-.109-.8c.145-.436.581-.763 1.054-.8l45.137-.581c5.342-.254 11.157-4.579 13.192-9.885l2.58-6.723c.109-.291.145-.581.073-.872c-2.906-13.158-14.644-22.97-28.672-22.97c-12.938 0-23.913 8.359-27.838 19.952a13.35 13.35 0 0 0-9.267-2.58c-6.215.618-11.193 5.597-11.811 11.811c-.145 1.599-.036 3.162.327 4.615C10.104 70.051 2 78.337 2 88.549c0 .909.073 1.817.182 2.726a.895.895 0 0 0 .872.763h82.57c.472 0 .909-.327 1.054-.8l.617-2.216z"
			/><path
				fill="#FAAE40"
				d="M101.542 60.275c-.4 0-.836 0-1.236.036c-.291 0-.545.218-.654.509l-1.744 6.069c-.763 2.617-.472 5.015.8 6.796c1.163 1.635 3.125 2.58 5.488 2.689l9.522.581c.291 0 .545.145.691.363c.145.218.182.545.109.8c-.145.436-.581.763-1.054.8l-9.924.582c-5.379.254-11.157 4.579-13.192 9.885l-.727 1.853c-.145.363.109.727.509.727h34.089c.4 0 .763-.254.872-.654c.581-2.108.909-4.325.909-6.614c0-13.447-10.975-24.422-24.458-24.422"
			/></svg
		>
	</div>
	<!-- Title -->
	<div class="col-span-11 ml-6">
		<p class="text-blue-600 font-semibold">{zone.name}</p>
		<div class="text-end">
			<slot />
			<Button size="xs" color="red" on:click={() => (deleteModal = true)}
				><svg
					class="w-[15px] h-[15px] text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 18 20"
				>
					<path
						d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"
					/>
				</svg></Button
			>
		</div>
	</div>

	<!-- Description -->
	<div class="md:col-start-2 col-span-11 xl:-ml-5">
		<p class="text-sm text-gray-800 font-light dark:text-gray-400">
			{zone.zone_id}
		</p>
	</div>
</div>
