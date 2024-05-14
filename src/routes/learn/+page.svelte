<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  const { learning_resources } = data;
  const blogs = learning_resources.filter((resource) => resource.type === 'blog');
  const courses = learning_resources.filter((resource) => resource.type === 'course');
  const podcasts = learning_resources.filter((resource) => resource.type === 'podcast');
</script>

<main>
  <h1>Learning Resources</h1>

  <section>
    <h2>Blogs</h2>

    {#await blogs}
      <p>...waiting</p>
    {:then blogs}
      <ul>
        {#each blogs as blog}
          <li><a href={blog.url}>{blog.title}</a></li>
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
          <li><a href={course.url}>{course.title}</a></li>
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
          <li><a href={podcast.url}>{podcast.title}</a></li>
        {/each}
      </ul>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </section>
</main>

<style>
  /* Add your custom styles here */
</style>
