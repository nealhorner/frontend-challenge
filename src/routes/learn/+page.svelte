<script lang="ts">
  import type { PageData } from './$types';
  import Faq from '$lib/components/faq/FAQ.svelte';
  import Button from '$lib/components/Button.svelte';
  import ResourceListing from './components/ResourceListing.svelte';

  export let data: PageData;
  const { learning_resources } = data;
  const blogs = learning_resources.filter((resource) => resource.type === 'blog');
  const courses = learning_resources.filter((resource) => resource.type === 'course');
  const podcasts = learning_resources.filter((resource) => resource.type === 'podcast');

  const sendEmail = () => {
    const email = 'mailto:'; //FIXME: Add your email here
    window.open(email);
  };

  const faqItems = [
    {
      question: 'How can I submit a learning resource?',
      answer:
        'If you have any learning resources that you would like to share, feel free to submit them. <Button on:click={sendEmail}>Send Email</Button>'
    },
    {
      question: 'Where does the content come from?',
      answer: 'The data is extracted from OpenGraph data.'
    },
    {
      question: 'How can I contribute to this project?',
      answer: 'You can contribute by submitting a PR to the GitHub repository.'
    }
  ];
</script>

<svelte:head>
  <title>Learn</title>
  <meta name="description" content="Learning resources for frontend developers" />
</svelte:head>

<main>
  <h1>Learning Resources</h1>

  <p>
    Here you can find a list of learning resources for frontend developers. Feel free to explore the
    blogs, courses, and podcasts below. Enjoy!
  </p>

  <section>
    <h2>Blogs</h2>

    {#await blogs}
      <p>...waiting</p>
    {:then blogs}
      <ul>
        {#each blogs as blog}
          <li>
            <ResourceListing title={blog.title} url={blog.url} description={blog.description} />
          </li>
        {/each}
      </ul>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </section>

  <section>
    <h2>Courses</h2>
    {#await courses}
      <p>...waiting</p>
    {:then courses}
      <ul>
        {#each courses as course}
          <li>
            <ResourceListing
              title={course.title}
              url={course.url}
              description={course.description}
            />
          </li>
        {/each}
      </ul>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </section>

  <section>
    <h2>Podcasts</h2>
    {#await podcasts}
      <p>...waiting</p>
    {:then podcasts}
      <ul>
        {#each podcasts as podcast}
          <li>
            <ResourceListing
              title={podcast.title}
              url={podcast.url}
              description={podcast.description}
            />
          </li>
        {/each}
      </ul>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </section>
  <section style="margin-top:40px">
    <Faq {faqItems} />
  </section>
</main>

<style>
  main {
    max-width: 640px;
    margin: 0 auto;
  }
  h2 {
    margin: 40px 0px 10px 0px;
    color: var(--color-text-secondary);
  }
  ul {
    margin-top: 10px;
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }
</style>
