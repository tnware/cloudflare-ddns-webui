<script lang="ts">
	export let enabledCount: number;
	export let totalCount: number;
</script>

<div class="flex items-center">
	<div class="px-8 mx-auto container align-middle">
		<div class="grid grid-cols-2 gap-2">
			<div class="shadow rounded-lg py-3 px-5 bg-white dark:bg-gray-900 dark:text-white">
				<div class="flex flex-row justify-between items-center">
					<div>
						<h6 class="text-2xl">Records being tracked</h6>
						<!-- <h4 class="dark:text-white text-4xl font-bold text-left">{enabledCount}</h4> -->
					</div>
					<div>
						<h4 class="dark:text-white text-4xl font-bold text-left">{enabledCount}</h4>
					</div>
				</div>
			</div>
			<div class="shadow rounded-lg py-3 px-5 bg-white dark:bg-gray-900 dark:text-white">
				<div class="flex flex-row justify-between items-center">
					<div>
						<h6 class="text-2xl">Total records</h6>
						<!-- <h4 class="dark:text-white text-4xl font-bold text-left">{totalCount}</h4> -->
					</div>
					<div>
						<h4 class="dark:text-white text-4xl font-bold text-left">{totalCount}</h4>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
