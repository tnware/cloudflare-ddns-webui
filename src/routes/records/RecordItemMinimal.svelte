<script lang="ts">
	import type { Record } from '$lib/types/db';
	export let record: Record;
	import { Toggle } from 'flowbite-svelte';
	let enabled = record.enabled === 1;

	async function toggleStatus(id: string) {
		enabled = !enabled; // Toggle the enabled state
		const response = await fetch(`/records`, {
			method: 'POST',
			body: JSON.stringify({ enabled: enabled ? 1 : 0, id: id }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			record.enabled = enabled ? 1 : 0; // Update the enabled value on the record object
		}
	}
</script>

<div
	class="opacity-80 dark:opacity-80 hover:dark:opacity-100 hover:opacity-100 hover:from-gray-50 hover:dark:from-slate-500 transition-all w-80 h-16 w-full rounded-xl dark:bg-gradient-to-br bg-gradient-to-br dark:from-slate-600 from-gray-100 dark:via-gray-800 via-gray-100 dark:to-slate-700 to-slate-200 p-[1px]"
>
	<!-- <a href="/records/{record.id}"> -->
	<div
		class="h-full w-full dark:bg-gradient-to-br dark:from-slate-700 dark:to-slate-800 rounded-xl back p-4 dark:text-white group"
	>
		<!-- Logo -->

		<div class="flex justify-between">
			<div id="start" class="flex">
				<Toggle checked={record.enabled === 1} on:click={() => toggleStatus(record.id)} />
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 116">
					<path
						fill="#FFF"
						d="m202.357 49.394l-5.311-2.124C172.085 103.434 72.786 69.289 66.81 85.997c-.996 11.286 54.227 2.146 93.706 4.059c12.039.583 18.076 9.671 12.964 24.484l10.069.031c11.615-36.209 48.683-17.73 50.232-29.68c-2.545-7.857-42.601 0-31.425-35.497Z"
					/>
					<path
						fill="#F4811F"
						d="M176.332 108.348c1.593-5.31 1.062-10.622-1.593-13.809c-2.656-3.187-6.374-5.31-11.154-5.842L71.17 87.634c-.531 0-1.062-.53-1.593-.53c-.531-.532-.531-1.063 0-1.594c.531-1.062 1.062-1.594 2.124-1.594l92.946-1.062c11.154-.53 22.839-9.56 27.087-20.182l5.312-13.809c0-.532.531-1.063 0-1.594C191.203 20.182 166.772 0 138.091 0C111.535 0 88.697 16.995 80.73 40.896c-5.311-3.718-11.684-5.843-19.12-5.31c-12.747 1.061-22.838 11.683-24.432 24.43c-.531 3.187 0 6.374.532 9.56C16.996 70.107 0 87.103 0 108.348c0 2.124 0 3.718.531 5.842c0 1.063 1.062 1.594 1.594 1.594h170.489c1.062 0 2.125-.53 2.125-1.594l1.593-5.842Z"
					/>
					<path
						fill="#FAAD3F"
						d="M205.544 48.863h-2.656c-.531 0-1.062.53-1.593 1.062l-3.718 12.747c-1.593 5.31-1.062 10.623 1.594 13.809c2.655 3.187 6.373 5.31 11.153 5.843l19.652 1.062c.53 0 1.062.53 1.593.53c.53.532.53 1.063 0 1.594c-.531 1.063-1.062 1.594-2.125 1.594l-20.182 1.062c-11.154.53-22.838 9.56-27.087 20.182l-1.063 4.78c-.531.532 0 1.594 1.063 1.594h70.108c1.062 0 1.593-.531 1.593-1.593c1.062-4.25 2.124-9.03 2.124-13.81c0-27.618-22.838-50.456-50.456-50.456"
					/>
				</svg>
				<a href="/records/{record.id}"
					><h1 class="ml-4 font-semibold mt-1">
						{record.name} &#8226; {record.type}: ({record.content})
					</h1></a
				>
			</div>
			<a href="/records/{record.id}">
				<div id="end">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						class="w-6 stroke-slate-800 dark:stroke-slate-500 transition-all group-hover:translate-x-1 group-hover:stroke-slate-400"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path d="M4 12h16M14 6l6 6-6 6" /></svg
					>
				</div></a
			>
		</div>

		<!-- Headline -->
		<!-- <h1 class="font-semibold mt-2 ml-2">{record.content}</h1> -->
		<!-- Content -->
	</div>

	<!-- </a> -->
</div>
