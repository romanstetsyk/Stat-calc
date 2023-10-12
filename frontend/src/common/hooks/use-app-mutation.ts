import type {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const useAppMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationKey' | 'mutationFn'
  >,
): UseMutationResult<TData, TError, TVariables, TContext> => {
  return useMutation(mutationKey, mutationFn, options);
};

export { useAppMutation };
