<script lang="ts">
  import Progress from './components/progress.svelte';
  import Prompter from './components/prompter.svelte';

  interface Question {
    id: string;
    family: string;
    title: string;
    prompt: string;
    type: string;
    multipleChoiceOptions: string;
    answers: string;
    tags: string;
  }
  interface QuizQuestion {
    quizId: string;
    questionId: string;
    answer: string | null;
    isAnswered: boolean;
    isCorrect: boolean | null;
    askedTimestamp: Date | null;
    answeredTimestamp: Date | null;
    question: Question;
  }
  interface QuizData {
    id: string;
    title: string;
    userId: string;
    score: number;
    isCompleted: boolean;
    quizQuestions: QuizQuestion[];
  }

  export let data: QuizData;

  // Compute the number of completed questions from data.questions.length
  let completedQuestions = data.quizQuestions.reduce((acc, question) => {
    return question.isAnswered ? acc + 1 : acc;
  }, 0);
  let totalQuestions = data.quizQuestions.length;
</script>

<div>
  <h1>Quiz #{data.id}</h1>

  <Prompter bind:quizData={data} />
  <div>
    <Progress {completedQuestions} {totalQuestions} />
  </div>

  <p>
    Test your knowledge with our quiz. Select a category and start answering questions. Good luck!
  </p>
</div>
