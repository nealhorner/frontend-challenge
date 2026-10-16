import { expect, test, type Page } from '@playwright/test';

const QUIZ_SIZE = 10;

// Matches an `answers` key in JSON (`"answers":`) or in the JS object literal
// SvelteKit inlines into server-rendered HTML (`answers:`). Question prompts are
// random, so a bare "answers" word in prose must not trip this.
const ANSWERS_KEY = /\banswers"?\s*:/;

// Each test gets a fresh browser context, so visiting /quiz has no session and
// the server signs in an anonymous guest. Start a quiz and wait for question 1.
async function startGuestQuiz(page: Page) {
  await page.goto('/quiz');
  await page.getByRole('button', { name: 'Start Quiz' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /^Quiz #/ })).toBeVisible();
  await expect(questionHeading(page)).toBeVisible();
}

function questionHeading(page: Page) {
  return page.locator('.question h2');
}

function progress(page: Page) {
  return page.locator('#quiz-progress');
}

// Enter an answer for whichever question type is showing. The question bank is
// random, so this must not depend on the content — any answer will do.
async function answerCurrentQuestion(page: Page) {
  const question = page.locator('.question');
  const textInput = question.locator('input[type="text"]');
  if (await textInput.count()) {
    // Blind answer: the component listens for `change`, which `fill` alone
    // doesn't fire. Blur commits it (Enter would submit the surrounding form).
    await textInput.fill('e2e answer');
    await textInput.blur();
  } else {
    await question.locator('input[type="radio"]').first().check();
  }
}

function submitButton(page: Page) {
  return page.locator('.question').getByRole('button', { name: 'Submit' });
}

test('guest can complete a full quiz without answers leaking to the client', async ({ page }) => {
  // Record every question API response the page makes along the way.
  const questionApiBodies: string[] = [];
  page.on('response', async (response) => {
    if (/\/api\/question(\/|$)/.test(new URL(response.url()).pathname)) {
      questionApiBodies.push(await response.text());
    }
  });

  await startGuestQuiz(page);

  // --- The in-progress quiz must not ship answers, in either data channel ---
  const html = await (await page.request.get('/quiz')).text();
  expect(html).toContain('Quiz #');
  expect(html).not.toMatch(ANSWERS_KEY);

  const dataRes = await page.request.get('/quiz/__data.json');
  expect(dataRes.ok()).toBeTruthy();
  const data = await dataRes.text();
  expect(data).toContain('quizQuestions');
  expect(data).not.toMatch(ANSWERS_KEY);

  // --- Answer every question through the UI ---
  for (let i = 1; i <= QUIZ_SIZE; i++) {
    const previousPrompt = await questionHeading(page).textContent();

    await answerCurrentQuestion(page);
    await expect(submitButton(page)).toBeEnabled();
    await submitButton(page).click();

    if (i < QUIZ_SIZE) {
      await expect(progress(page)).toHaveAttribute(
        'title',
        `Completed ${i} of ${QUIZ_SIZE} questions`
      );
      await expect(questionHeading(page)).not.toHaveText(previousPrompt ?? '');
    }
  }

  // --- Results ---
  await page.waitForURL(/\/quiz\/results\/[^/]+$/);
  await expect(page.getByText(/^Score: \d+ pts$/)).toBeVisible();
  await expect(page.getByText(/^Correct Answer\(s\):/)).toHaveCount(QUIZ_SIZE);

  // --- The public question endpoints never include answers ---
  const random = await page.request.get('/api/question');
  expect(random.ok()).toBeTruthy();
  const randomBody = await random.text();
  expect(randomBody).not.toMatch(ANSWERS_KEY);

  const { id } = JSON.parse(randomBody) as { id: string };
  const byId = await page.request.get(`/api/question/${id}`);
  expect(byId.ok()).toBeTruthy();
  expect(await byId.text()).not.toMatch(ANSWERS_KEY);

  for (const body of questionApiBodies) {
    expect(body).not.toMatch(ANSWERS_KEY);
  }
});

test('a failed answer submit shows an error and the retry succeeds', async ({ page }) => {
  await startGuestQuiz(page);

  // Fail the first answer submit, then let later ones through.
  let failedOnce = false;
  await page.route('**/api/quiz/questions', async (route) => {
    if (route.request().method() === 'POST' && !failedOnce) {
      failedOnce = true;
      await route.fulfill({ status: 500, json: { error: 'Injected failure' } });
      return;
    }
    await route.continue();
  });

  const prompt = await questionHeading(page).textContent();
  await answerCurrentQuestion(page);
  await expect(submitButton(page)).toBeEnabled();
  await submitButton(page).click();

  // The error shows and the quiz stays on the same question.
  await expect(page.getByRole('alert')).toContainText('Failed to submit your answer');
  await expect(questionHeading(page)).toHaveText(prompt ?? '');
  await expect(progress(page)).toHaveAttribute('title', `Completed 0 of ${QUIZ_SIZE} questions`);

  // Retrying the same answer goes through and advances the quiz.
  await expect(submitButton(page)).toBeEnabled();
  await submitButton(page).click();
  await expect(progress(page)).toHaveAttribute('title', `Completed 1 of ${QUIZ_SIZE} questions`);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(questionHeading(page)).not.toHaveText(prompt ?? '');
});
