<script lang="ts">
	import '../app.postcss';
	import { DarkMode } from 'flowbite-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<NavBar />
<div class="dark:bg-gray-800 text-end p-2"><DarkMode /></div>

<div class="p-4 dark:bg-gray-800 min-h-screen">
	<div class="max-w-[1300px] mx-auto">
		<slot />
	</div>
</div>
