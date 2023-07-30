<script lang="ts">
	import { afterUpdate } from 'svelte';

	export let selectedRecord;
	let logs;
	async function getRecordLogs(id) {
		const response = await fetch(`/api/logs?related_object=${id}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			return await response.json(); // Add parentheses here to call the function
		}
	}

	async function loadLogs() {
		logs = await getRecordLogs(selectedRecord.id);
	}

	afterUpdate(() => {
		// loadLogs();
	});
	// $: selectedRecord = selectedRecord;
	// loadLogs();
	$: {
		if (selectedRecord.id) {
			loadLogs();
		}
	}
</script>

{#if selectedRecord}
	<div class=" bg-white dark:bg-neutral-800 w-full rounded-lg shadow-xl dark:text-white">
		<div class="p-4 border-b dark:border-neutral-600">
			<h2 class="text-2xl dark:text-white">{selectedRecord.name}</h2>
			<p class="text-sm text-neutral-500">{selectedRecord.id}</p>
		</div>
		<div>
			<div
				class="md:grid md:grid-cols-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
			>
				<p class="text-neutral-600 dark:text-neutral-400">Record Name:</p>
				<p>{selectedRecord.name}</p>
			</div>
			<div
				class="md:grid md:grid-cols-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
			>
				<p class="text-neutral-600 dark:text-neutral-400">Content:</p>
				<p>{selectedRecord.content}</p>
			</div>
			<div
				class="md:grid md:grid-cols-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
			>
				<p class="text-neutral-600 dark:text-neutral-400">Last Modified:</p>
				<p>{new Date(selectedRecord.modified_on)}</p>
			</div>
			<div
				class="md:grid md:grid-cols-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
			>
				<p class="text-neutral-600 dark:text-neutral-400">Type:</p>
				<p>({selectedRecord.type}) Record</p>
			</div>
			<div
				class="md:grid md:grid-cols-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
			>
				<p class="text-neutral-600 dark:text-neutral-400">Zone Name:</p>
				<p>{selectedRecord.zone_name}</p>
			</div>
			<div
				class="md:grid md:grid-cols-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4"
			>
				<p class="text-neutral-600 dark:text-neutral-400">Zone ID:</p>
				<p>{selectedRecord.zone_id}</p>
			</div>
		</div>
		<div class="pb-2 pl-4">
			<button
				class="px-4 py-1 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
			>
				Delete Record
			</button>
		</div>
	</div>
{/if}

{#if logs}
	<div class="mt-4 bg-white dark:bg-neutral-800 w-full rounded-lg shadow-xl dark:text-white">
		<div class="flex justify-end pt-2 pr-4">
			<button
				class="px-4 py-1 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
			>
				Clear Logs
			</button>
		</div>

		<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-neutral-800">
				<tr>
					<th
						scope="col"
						class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
					>
						Date
					</th>
					<th
						scope="col"
						class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
					>
						Action
					</th>
					<th
						scope="col"
						class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
					>
						Status
					</th>

					<th
						scope="col"
						class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
					>
						Message
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-neutral-900">
				{#each logs as log}
					<tr>
						<td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
							>{log.timestamp}</td
						>
						<td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
							<div>
								<p class="text-xs font-normal text-gray-600 dark:text-gray-400">
									{log.action}
								</p>
							</div>
						</td>
						<td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
							<!-- Assuming 'log' is the object representing the log in the template -->
							<!-- Assuming 'log' is the object representing the log in the template -->
							{#if log.result === 'success'}
								<div
									class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100 dark:bg-emerald-800"
								>
									<svg
										width="12"
										height="12"
										viewBox="0 0 12 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M10 3L4.5 8.5L2 6"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<h2 class="text-sm font-normal">{log.result}</h2>
								</div>
							{:else if log.result === 'error'}
								<div
									class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-red-500 bg-red-100 dark:bg-red-800"
								>
									<svg
										width="12"
										height="12"
										viewBox="0 0 12 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M1 1L11 11M1 11L11 1"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<h2 class="text-sm font-normal">{log.result}</h2>
								</div>
							{:else}
								<!-- Handle any other log types here -->
							{/if}
						</td>
						<td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
							<div>
								<p class="text-xs font-normal text-gray-600 dark:text-gray-400">
									{log.message}
								</p>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
