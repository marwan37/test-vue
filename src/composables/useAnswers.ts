// composables/useAnswers.ts
import type { ComputedRef } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

interface UseAnswersProps {
  questionId: string;
  mode: ComputedRef<'tutor' | 'timed' | null>;
  localSubmitted: ComputedRef<boolean>;
  numberOfCorrectAnswers: ComputedRef<number>;
  selectedOptionIndices: ComputedRef<number[]>;
}

const useAnswers = ({
  localSubmitted,
  numberOfCorrectAnswers,
  selectedOptionIndices,
  questionId,
}: UseAnswersProps) => {
  const store = useStore();
  const toast = useToast();

  const handleSelectAnswer = (index: number) => {
    if (localSubmitted.value) {
      return; // Do nothing if answer has already been submitted
    }

    handleAnswer(index);
  };

  const handleAnswer = (index: number) => {
    if (numberOfCorrectAnswers.value === 1) {
      // Single-answer question
      store.commit('selectAnswer', { questionId, index });
    } else {
      // Multiple-answer question
      if (selectedOptionIndices.value.includes(index)) {
        store.commit('selectAnswer', { questionId, index });
      } else if (selectedOptionIndices.value.length < numberOfCorrectAnswers.value) {
        store.commit('selectAnswer', { questionId, index });
      } else {
        toast.warning(`You can only select ${numberOfCorrectAnswers.value} answer(s).`, {
          timeout: 3000,
          closeOnClick: true,
        });
      }
    }
  };

  return {
    handleSelectAnswer,
  };
};

export default useAnswers;
