<script lang="ts">
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import TryQuestion from '$lib/components/TryQuestion.svelte';
  import WelcomeSection from '$lib/components/WelcomeSection.svelte';
  import IconAllInclusive from '~icons/mdi/all-inclusive';
  import IconArrowRight from '~icons/mdi/arrow-right';
  import IconBookmark from '~icons/mdi/bookmark-outline';
  import IconBookOpen from '~icons/mdi/book-open-variant';
  import IconCheckAll from '~icons/mdi/check-all';
  import IconFileTree from '~icons/mdi/file-tree';
  import IconFire from '~icons/mdi/fire';
  import IconPodcast from '~icons/mdi/podcast';
  import IconPost from '~icons/mdi/post-outline';
  import IconSchool from '~icons/mdi/school-outline';
  import IconSwap from '~icons/mdi/swap-horizontal';
  import IconTrophy from '~icons/mdi/trophy-outline';
  import learningResources from '../../data/learning_resources.json';

  // Question counts per topic, from the seed data in data/questions.json.
  // Hardcoded on purpose: the homepage is prerendered (see +page.ts), and the
  // question data carries answers we must not ship to the client.
  const topics: {
    name: string;
    count: string;
    hue: string;
    glyph?: string;
    icon?: typeof IconSwap;
  }[] = [
    { name: 'JavaScript', count: '9 challenges', hue: 'amber', glyph: 'JS' },
    { name: 'CSS', count: '5 challenges', hue: 'sky', glyph: '#' },
    { name: 'React', count: '3 challenges', hue: 'violet', icon: IconAllInclusive },
    { name: 'HTTP', count: '15 challenges', hue: 'emerald', icon: IconSwap },
    { name: 'DOM', count: '2 challenges', hue: 'rose', icon: IconFileTree },
    { name: 'Closures', count: 'Advanced scope', hue: 'sky', glyph: '()' }
  ];

  // Counted from data/learning_resources.json at build time. Unlike the
  // questions, it holds no answers, so it is safe to bundle into the prerender.
  const countOf = (type: string, noun: string) => {
    const total = learningResources.records.filter((r) => r.type === type).length;
    return `${total} ${noun}${total === 1 ? '' : 's'}`;
  };

  const resourceTypes = [
    {
      name: 'Blogs',
      count: countOf('blog', 'blog'),
      hue: 'sky',
      icon: IconPost,
      description: 'In-depth articles and practical write-ups on JavaScript, CSS and React.',
      examples: ['Lydia Hallie', 'Dan Abramov', 'Sarah Drasner']
    },
    {
      name: 'Courses',
      count: countOf('course', 'course'),
      hue: 'violet',
      icon: IconSchool,
      description: 'Structured paths for when you want to go from the fundamentals to fluency.',
      examples: ['Frontend Masters', 'Just JavaScript', 'Kent C. Dodds']
    },
    {
      name: 'Podcasts',
      count: countOf('podcast', 'podcast'),
      hue: 'amber',
      icon: IconPodcast,
      description: 'Conversations about the web to keep learning on a walk or a commute.',
      examples: ['Syntax', 'ShopTalk Show', 'Frontend Happy Hour']
    }
  ];
</script>

<svelte:head>
  <title>Frontend Challenge — Test your frontend skills</title>
  <meta
    name="description"
    content="Answer real-world JavaScript, CSS, React and HTTP questions. Track your accuracy and climb the global rankings."
  />
</svelte:head>

<!-- The glow covers the whole page, down to the footer -->
<div class="home">
  <WelcomeSection />
  <TryQuestion />

  <section class="section" aria-labelledby="depth-heading">
    <div class="section-head centered">
      <span class="eyebrow">Methodical mastery</span>
      <h2 id="depth-heading">Built for frontend depth, not trivia memorization</h2>
    </div>

    <div class="value-grid">
      <article class="value-card">
        <!-- Illustration only: example numbers, not the visitor's data -->
        <div class="visual" aria-hidden="true">
          <div class="visual-row">
            <span class="mono muted">RUNNING_ACCURACY</span>
            <span class="chip success">+6.4% this week</span>
          </div>
          <div class="accuracy">
            <svg class="ring" viewBox="0 0 36 36">
              <circle class="ring-track" cx="18" cy="18" r="15.9155" />
              <circle class="ring-value" cx="18" cy="18" r="15.9155" pathLength="100" />
            </svg>
            <div class="ring-label">
              <strong>84%</strong>
              <span>ACC</span>
            </div>
            <div class="stat-stack">
              <span class="stat"><IconFire class="amber" />12 streak</span>
              <span class="stat muted"><IconCheckAll class="info" />324 solved</span>
            </div>
          </div>
          <div class="bar"><span style:width="84%"></span></div>
        </div>
        <h3>Track your accuracy</h3>
        <p>Every answer feeds your running score so you can watch your progress over time.</p>
        <a class="card-link" href="/profile">View your stats <IconArrowRight /></a>
      </article>

      <article class="value-card">
        <div class="visual" aria-hidden="true">
          <div class="visual-row">
            <span class="mono strong"><IconTrophy class="amber" />1,842 ELO</span>
            <span class="chip amber">Rank #14</span>
          </div>
          <ol class="ladder">
            <li><span><b class="amber">#1</b> alex.dev</span><span class="string">2,190</span></li>
            <li class="you"><span><b>#14</b> You</span><span>1,842</span></li>
            <li class="muted"><span><b>#15</b> k_nakamura</span><span>1,838</span></li>
          </ol>
          <div class="visual-row mono muted small">
            <span>ELO-style rating</span>
            <span class="live"><span class="live-dot"></span>Updates every quiz</span>
          </div>
        </div>
        <h3>Climb the rankings</h3>
        <p>An ELO-style rating pits your skills against the rest of the community.</p>
        <a class="card-link" href="/profile">See your rating <IconArrowRight /></a>
      </article>

      <article class="value-card">
        <div class="visual" aria-hidden="true">
          <div class="visual-row">
            <span class="chip function">spec: MDN / W3C</span>
            <IconBookmark class="muted" />
          </div>
          <pre class="snippet"><span class="kw">const</span> <span class="fn">memoizedVal</span
            > = <span class="fn">useMemo</span>(() =&gt; &#123;
    <span class="cm">// recalculate only when deps change</span>
    <span class="kw">return</span> computeExpensive(<span class="var">data</span>);
  &#125;, [<span class="var">data</span>]);</pre>
          <div class="visual-row mono muted small">
            <span class="with-icon"
              ><IconBookOpen class="info" />Curated deep-dives with each quiz</span
            >
          </div>
        </div>
        <h3>Learn as you go</h3>
        <p>See the right answer instantly and dig into curated resources to level up.</p>
        <a class="card-link" href="/learn">Browse learning resources <IconArrowRight /></a>
      </article>
    </div>
  </section>

  <section class="section" aria-labelledby="topics-heading">
    <div class="section-head split">
      <div>
        <span class="eyebrow">Targeted curricula</span>
        <h2 id="topics-heading">Covering the topics that matter</h2>
      </div>
      <p>
        From runtime subtleties and DOM performance to CSS layout algorithms and HTTP protocols.
      </p>
    </div>

    <ul class="topic-grid">
      {#each topics as topic (topic.name)}
        <li>
          <!-- Not links: quizzes can't be filtered by topic yet (roadmap item 2) -->
          <div
            class="topic"
            style:--hue-text="var(--topic-{topic.hue}-text)"
            style:--hue-bg="var(--topic-{topic.hue}-bg)"
          >
            <span class="topic-icon" aria-hidden="true">
              {#if topic.icon}<topic.icon />{:else}{topic.glyph}{/if}
            </span>
            <span class="topic-name">{topic.name}</span>
            <span class="topic-count">{topic.count}</span>
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <section class="section" aria-labelledby="resources-heading">
    <div class="section-head split">
      <div>
        <span class="eyebrow">Keep learning</span>
        <h2 id="resources-heading">Go deeper with curated resources</h2>
      </div>
      <p>Hand-picked blogs, courses and podcasts to help you dig into what you practice here.</p>
    </div>

    <ul class="resource-types">
      {#each resourceTypes as type (type.name)}
        <li>
          <a
            class="resource-type"
            href="/learn"
            style:--hue-text="var(--topic-{type.hue}-text)"
            style:--hue-bg="var(--topic-{type.hue}-bg)"
          >
            <div class="resource-type-head">
              <span class="resource-icon" aria-hidden="true"><type.icon /></span>
              <span class="resource-count">{type.count}</span>
            </div>
            <h3>{type.name}</h3>
            <p>{type.description}</p>
            <ul class="resource-examples" aria-label="Including">
              {#each type.examples as example (example)}
                <li>{example}</li>
              {/each}
            </ul>
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <section class="section">
    <div class="cta">
      <span class="eyebrow">Learn at your own pace</span>
      <h2>Ready to find out where you stand?</h2>
      <p>
        Take a short quiz to see where your skills are today, then keep going and watch your rating
        grow as you pick up something new each time.
      </p>
      <ButtonLink href="/quiz" kind="primary" size="lg">
        Start Your First Quiz <IconArrowRight />
      </ButtonLink>
      <!-- True today: guests can take quizzes, results show every correct answer,
           and each quiz draws one question per family, so the topics vary. -->
      <ul class="cta-notes">
        <li>No account needed</li>
        <li>See the answer to every question</li>
        <li>A new mix of topics each time</li>
      </ul>
    </div>
  </section>
</div>

<style>
  /* ─── Page glow ─── */

  .home {
    position: relative;
    /* Own stacking context so the grain layer sits under the content */
    isolation: isolate;
    flex: 1;
    /* Reach the footer: cover the footer's top margin as well */
    margin-bottom: calc(-1 * var(--space-xl));
    padding-bottom: var(--space-xl);
    background-image: var(--glow-home-top), var(--glow-home-bottom);
    background-repeat: no-repeat;
  }

  /* Grain over the gradient, on its own layer behind the content */
  .home::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image: var(--noise-home);
    opacity: var(--noise-home-opacity);
    /* Blend with the glows underneath so the grain takes on their color */
    mix-blend-mode: var(--noise-home-blend);
    pointer-events: none;
  }

  /* ─── Shared section layout ─── */

  .section {
    /* The layout's page-content is a flex column; without a width, sections
       shrink to their content instead of filling the max width. */
    width: 100%;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--page-content-padding);
  }

  .section-head {
    margin-bottom: var(--space-xl);
  }

  .section-head.centered {
    max-width: 42rem;
    margin-inline: auto;
    text-align: center;
  }

  .section-head.split {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .section-head.split p {
    max-width: 28rem;
    margin: 0;
    color: var(--color-text-secondary);
  }

  .eyebrow {
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .section h2 {
    margin: var(--space-xs) 0 0;
    font-size: var(--text-3xl);
    line-height: 1.2;
    text-wrap: balance;
  }

  /* ─── Value cards ─── */

  .value-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-lg);
  }

  .value-card {
    display: flex;
    flex-direction: column;
    padding: var(--space-lg);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-card);
    transition: background-color var(--transition-fast);
  }

  .value-card:hover {
    background-color: var(--color-surface-raised);
  }

  .value-card h3 {
    margin: var(--space-md) 0 0;
    font-size: var(--text-xl);
  }

  .value-card > p {
    flex: 1;
    margin: var(--space-xs) 0 0;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }

  .card-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    margin-top: var(--space-md);
    padding-top: var(--space-sm);
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    text-decoration: none;
  }

  .card-link:hover {
    text-decoration: underline;
  }

  /* Mini dashboards inside the value cards */

  .visual {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-sm);
    height: 11.75rem;
    padding: var(--space-md);
    overflow: hidden;
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-button);
    background-color: var(--color-surface-sunken);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .visual-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .visual :global(svg) {
    flex-shrink: 0;
  }

  .mono {
    font-family: var(--font-mono);
  }

  .strong {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--color-text);
    font-weight: 700;
  }

  .muted,
  .visual :global(.muted) {
    color: var(--color-text-muted);
  }

  .small {
    font-size: 0.6875rem;
  }

  .visual :global(.amber),
  .amber {
    color: var(--topic-amber-text);
  }

  .visual :global(.info) {
    color: var(--color-info);
  }

  .chip {
    padding: 0.125rem var(--space-sm);
    border-radius: var(--radius-sm);
    font-weight: 600;
    white-space: nowrap;
  }

  .chip.success {
    background-color: var(--color-success-soft);
    color: var(--color-success-text);
  }

  .chip.amber {
    background-color: var(--topic-amber-bg);
  }

  .chip.function {
    background-color: var(--color-surface);
    color: var(--color-syntax-function);
  }

  .accuracy {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg);
  }

  .ring {
    width: 5rem;
    height: 5rem;
    transform: rotate(-90deg);
  }

  .ring circle {
    fill: none;
    stroke-width: 3.5;
  }

  .ring-track {
    stroke: var(--color-border);
  }

  .ring-value {
    stroke: var(--color-success);
    stroke-dasharray: 84 100;
    stroke-linecap: round;
  }

  :global([data-theme='dark']) .ring-value {
    stroke: var(--color-primary);
  }

  .ring-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: calc(-5rem - var(--space-lg));
    width: 5rem;
    color: var(--color-text-muted);
    font-size: 0.625rem;
  }

  .ring-label strong {
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    line-height: 1.1;
  }

  .stat-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .stat {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-weight: 700;
  }

  .stat.muted {
    font-weight: 500;
  }

  .bar {
    height: 6px;
    border-radius: var(--radius-full);
    background-color: var(--color-border);
    overflow: hidden;
  }

  .bar span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--color-info), var(--color-success));
  }

  :global([data-theme='dark']) .bar span {
    background: linear-gradient(90deg, var(--color-info), var(--color-primary));
  }

  .ladder {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ladder li {
    display: flex;
    justify-content: space-between;
    padding: 0.375rem var(--space-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    color: var(--color-text);
  }

  .ladder li.you {
    border-color: var(--color-primary-border);
    background-color: var(--color-primary-soft);
    color: var(--color-link);
    font-weight: 700;
  }

  .ladder li.muted {
    color: var(--color-text-muted);
  }

  .ladder b {
    margin-right: 0.375rem;
  }

  .string {
    color: var(--color-syntax-string);
    font-weight: 600;
  }

  .live {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--color-success-text);
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background-color: var(--color-success);
  }

  .snippet {
    margin: 0;
    padding: 0.625rem;
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    font-size: 0.6875rem;
    line-height: 1.6;
    white-space: pre;
    overflow: hidden;
  }

  .kw {
    color: var(--color-syntax-keyword);
  }

  .fn {
    color: var(--color-syntax-function);
  }

  .cm {
    color: var(--color-syntax-comment);
  }

  .var {
    color: var(--color-link);
  }

  .with-icon {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  /* ─── Topics ─── */

  /* Columns are sized so the name and count beside the icon stay on one line
     (the text column needs about 150px). Three columns: two even rows of six. */
  .topic-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-sm);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Two columns: the icon on the left (only as wide as itself), the name
     and count stacked on the right. */
  .topic {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: auto auto;
    align-content: start;
    column-gap: 0.75rem;
    height: 100%;
    padding: var(--space-md);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
    color: var(--color-text);
    text-decoration: none;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .topic-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    grid-row: 1 / span 2;
    align-self: start;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-button);
    background-color: var(--hue-bg, var(--color-surface));
    color: var(--hue-text, var(--color-text));
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 700;
    transition: transform var(--transition-fast);
  }

  .topic-icon :global(svg) {
    font-size: 1.25rem;
  }

  .topic-name {
    align-self: end;
    font-size: var(--text-md);
    line-height: 1.3;
    font-weight: 600;
    letter-spacing: var(--tracking-snug);
  }

  .topic-count {
    margin-top: 0.125rem;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  /* ─── Learning resources ─── */

  .resource-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(17rem, 100%), 1fr));
    gap: var(--space-lg);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .resource-type {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    height: 100%;
    padding: var(--space-lg);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-card);
    color: var(--color-text);
    text-decoration: none;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .resource-type:hover {
    border-color: var(--color-primary-border);
    background-color: var(--color-surface-raised);
    text-decoration: none;
  }

  .resource-type-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-xs);
  }

  .resource-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-button);
    background-color: var(--hue-bg);
    color: var(--hue-text);
    font-size: 1.25rem;
    transition: transform var(--transition-fast);
  }

  .resource-type:hover .resource-icon {
    transform: scale(1.05);
  }

  .resource-count {
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .resource-type h3 {
    margin: 0;
    font-size: var(--text-xl);
  }

  .resource-type p {
    flex: 1;
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }

  .resource-examples {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin: var(--space-xs) 0 0;
    padding: 0;
    list-style: none;
  }

  .resource-examples li {
    padding: 0.125rem 0.625rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background-color: var(--color-surface-sunken);
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  /* ─── Closing call to action (light or dark panel, by theme) ─── */

  .cta {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    padding: 5rem var(--space-xl);
    overflow: hidden;
    border: 1px solid var(--cta-border);
    border-radius: var(--radius-panel);
    background-image: var(--cta-glow), var(--cta-bg);
    box-shadow: var(--shadow-overlay);
    text-align: center;
    color: var(--cta-text);
    /* Point the primary button at the panel's own accent */
    --color-primary: var(--cta-accent);
    --color-primary-hover: var(--cta-accent-hover);
    --color-on-primary: var(--cta-on-accent);
    --focus-ring: 0 0 0 3px rgba(56, 189, 248, 0.4);
  }

  .cta .eyebrow {
    color: var(--cta-eyebrow);
  }

  .cta h2 {
    max-width: 40rem;
    margin: 0;
    color: var(--cta-text);
    font-size: var(--text-4xl);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  .cta p {
    max-width: 36rem;
    margin: 0 0 var(--space-sm);
    color: var(--cta-text-secondary);
    font-size: var(--text-lg);
  }

  .cta-notes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-xs) var(--space-md);
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--cta-text-muted);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .cta-notes li + li::before {
    content: '•';
    margin-right: var(--space-md);
  }

  /* ─── Responsive ─── */

  @media (max-width: 1023px) {
    .value-grid {
      grid-template-columns: minmax(0, 1fr);
      max-width: 32rem;
      margin-inline: auto;
    }
  }

  @media (max-width: 767px) {
    .topic-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 479px) {
    .topic-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 600px) {
    .cta {
      padding: var(--space-xl) var(--space-lg);
    }

    .cta-notes {
      flex-direction: column;
      align-items: center;
    }

    .cta-notes li + li::before {
      display: none;
    }
  }
</style>
