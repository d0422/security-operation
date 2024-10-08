import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from './URL';

interface Guestbook {
  id: number;
  name: string;
  message: string;
}

const useGuestbookQuery = () => {
  return useQuery({
    queryFn: async () => {
      const result = await axios.get<Guestbook[]>(BASE_URL);
      return result.data;
    },
    queryKey: ['방명록'],
  });
};

export default useGuestbookQuery;
