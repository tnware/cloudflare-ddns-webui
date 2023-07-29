<script lang="ts">
	import type { PageData } from './$types';
	import type { Log } from '$lib/types/db';
	export let data: PageData;
	let logs: Log[] = data.logs;
</script>

<div class="flex-1 bg-white rounded-lg shadow-xl mt-4 p-8">
	<h4 class="text-xl text-gray-900 font-bold">Record Update Timeline</h4>
	<div class="relative px-4">
		<div class="absolute h-full border border-dashed border-opacity-20 border-secondary" />
		{#each logs as log}
			<!-- start::Timeline item -->
			<div class="flex items-center w-full my-6 -ml-1.5">
				<div class="w-1/12 z-10">
					<div class="w-3.5 h-3.5 bg-blue-600 rounded-full" />
				</div>
				<div class="w-11/12">
					<p class="text-sm">{log.action}</p>
					<p class="text-sm">{log.message}</p>
					<p class="text-xs text-gray-500">{log.timestamp}</p>
				</div>
			</div>
			<!-- end::Timeline item -->
		{/each}
	</div>
</div>
