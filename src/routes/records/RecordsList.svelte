<script lang="ts">
	import type { Record } from '$lib/types/db';
	export let records: Record[];
	import RecordItem from './RecordItem.svelte';
</script>

<div class="p-8 mx-auto flex flex-col space-y-4">
	<!-- Border gradient -->
	{#each records as record}
		<RecordItem {record} />
	{/each}
</div>
