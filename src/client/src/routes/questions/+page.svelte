<script lang="ts">
	// import  fetchQuestions from src/lib/api/fetchQuestions.ts
	import { fetchQuestions } from '$lib/api/fetchQuestions';
	import type { Question } from '@prisma/client';

	let data: Question[] | undefined;

	async function loadData() {
		data = await fetchQuestions();
	}

	loadData();
</script>

<main>
	{#if data}
		{#each data as question}
			<p>{question.title}</p>
		{/each}
	{/if}
</main>
