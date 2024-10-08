import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from './URL';

interface PostParams {
  name: string;
  message: string;
  password: string;
}

interface PatchParams extends PostParams {
  id: number;
}
interface DeleteParams {
  id: number;
  password: string;
}

const useGuestbookMutation = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['방명록'] });
  const { mutateAsync: postMutate } = useMutation({
    mutationFn: async ({ name, message, password }: PostParams) => {
      await axios.post(BASE_URL, {
        name,
        message,
        password,
      });
    },
    onSuccess: invalidate,
  });

  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: async ({ id, password }: DeleteParams) => {
      await axios.delete(`${BASE_URL}?id=${id}&password=${password}`);
    },
    onSuccess: () => {
      alert('삭제되었습니다!');
      invalidate();
    },
    onError: () => alert('비밀번호를 확인해주세요!'),
  });

  const { mutateAsync: patchMutate } = useMutation({
    mutationFn: async ({ name, message, id }: PatchParams) => {
      await axios.post(`${BASE_URL}?id=${id}`, {
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
