import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from './URL';

interface PostParams {
  name: string;
  message: string;
}

interface PatchParams extends PostParams {
  id: number;
}

const useGuestbookMutation = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['방명록'] });
  const { mutateAsync: postMutate } = useMutation({
    mutationFn: async ({ name, message }: PostParams) => {
      axios.post(BASE_URL, {
        name,
        message,
      });
    },
    onSuccess: invalidate,
  });

  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: async (id: number) => {
      axios.delete(`${BASE_URL}?id=${id}`);
    },
    onSuccess: invalidate,
  });

  const { mutateAsync: patchMutate } = useMutation({
    mutationFn: async ({ name, message, id }: PatchParams) => {
      axios.post(`${BASE_URL}?id=${id}`, {
        name,
        message,
      });
    },
    onSuccess: invalidate,
  });

  return {
    patchMutate,
    postMutate,
    deleteMutate,
  };
};

export default useGuestbookMutation;
