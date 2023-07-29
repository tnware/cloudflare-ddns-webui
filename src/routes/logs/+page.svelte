<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	let logs = data.logs;
	let refreshInterval = 10000;

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, refreshInterval);

		return () => {
			clearInterval(interval);
		};
	});

	$: {
		logs = data.logs;
		refreshInterval = refreshInterval;
	}
</script>

<div class="mx-auto">
	<div class="w-full shadow-2xl subpixel-antialiased rounded h-64 bg-black border-black mx-auto">
		<div
			class="flex items-center h-6 rounded-t bg-gray-100 border-b border-gray-500 text-center text-black"
			id="headerTerminal"
		>
			<div
				class="flex ml-2 items-center text-center border-red-900 bg-red-500 shadow-inner rounded-full w-3 h-3"
				id="closebtn"
			/>
			<div
				class="ml-2 border-yellow-900 bg-yellow-500 shadow-inner rounded-full w-3 h-3"
				id="minbtn"
			/>
			<div
				class="ml-2 border-green-900 bg-green-500 shadow-inner rounded-full w-3 h-3"
				id="maxbtn"
			/>
			<div class="mx-auto pr-16" id="terminaltitle">
				<p class="text-center text-sm">Logs</p>
			</div>
		</div>
		<div class="break-all pl-1 pt-1 h-auto text-green-200 font-mono text-xs bg-black" id="console">
			{#if logs}
				{#each logs as log}
					<p>
						<span class="text-slate-500">{log.timestamp}</span>
						<span class="text-slate-400">[{log.type}]:</span>
						<span class="text-blue-500">{log.action}</span>
						<span class="text-gray-50">{log.message}</span>
						<!-- <code
							>{typeof log.message === 'string'
								? log.message
								: JSON.stringify(log.message, null, 2)}
						</code> -->
					</p>
				{/each}
			{/if}
		</div>
	</div>
</div>
