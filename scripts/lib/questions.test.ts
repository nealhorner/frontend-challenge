import { describe, expect, it } from 'vitest';
import { QuestionType } from '$lib/types';
import { buildQuestionRows, generateQuestionPermutations, type RawQuestion } from './questions';

const record = (overrides: Partial<RawQuestion> = {}): RawQuestion => ({
  title: 'Title',
  prompt: 'Prompt?',
  answers: ['right'],
  false_answers: ['a', 'b', 'c', 'd', 'e'],
  tags: ['Tag'],
  ...overrides
});

describe('generateQuestionPermutations', () => {
  it('makes a multiple-choice, a none-correct and a blind-answer variant', () => {
    const variants = generateQuestionPermutations(record());
    expect(variants.map((v) => [v.type, v.answers.length])).toEqual([
      [QuestionType.MultipleChoice, 1],
      [QuestionType.MultipleChoice, 0],
      [QuestionType.BlindAnswer, 1]
    ]);
  });

  it('puts the correct answer and three wrong ones in the multiple-choice options', () => {
    const [multipleChoice] = generateQuestionPermutations(record());
    expect(multipleChoice.multiple_choice).toHaveLength(4);
    expect(multipleChoice.multiple_choice).toContain('right');
  });

  it('never offers the correct answer in the none-correct variant', () => {
    const [, noneCorrect] = generateQuestionPermutations(record());
    expect(noneCorrect.multiple_choice).not.toContain('right');
  });

  it('skips the none-correct variant with a single wrong answer', () => {
    const variants = generateQuestionPermutations(record({ false_answers: ['a'] }));
    expect(variants).toHaveLength(2);
  });

  it('only makes the blind-answer variant without wrong answers', () => {
    const variants = generateQuestionPermutations(record({ false_answers: [] }));
    expect(variants.map((v) => v.type)).toEqual([QuestionType.BlindAnswer]);
  });
});

describe('buildQuestionRows', () => {
  it('shares one family id per record and stores arrays as JSON strings', () => {
    const rows = buildQuestionRows([record(), record({ title: 'Other' })]);
    expect(rows).toHaveLength(6);
    expect(new Set(rows.slice(0, 3).map((r) => r.family)).size).toBe(1);
    expect(rows[0].family).not.toBe(rows[3].family);
    expect(JSON.parse(rows[2].answers)).toEqual(['right']);
    expect(JSON.parse(rows[2].multipleChoiceOptions)).toEqual([]);
  });
});
