import useGuestbookMutation from './apis/useGuestbookMutation';
import useGuestbookQuery from './apis/useGuestbookQuery';
import { useInput } from '@rapiders/react-hooks';

const getDisplayDate = (date: string) => {
  return date.split('T')[0];
};

function App() {
  const { data } = useGuestbookQuery();
  const { value: name, onChange, reset } = useInput('');
  const {
    value: message,
    onChange: onMessageChange,
    reset: resetMessage,
  } = useInput('');

  const { postMutate, deleteMutate } = useGuestbookMutation();

  const handleSubmit = async () => {
    if (!name || !message) return;
    const password = await new Promise<string>((resolve) =>
      resolve(prompt('등록할 비밀번호를 입력해주세요') || '')
    );

    await postMutate({
      name,
      message,
      password,
    });
    reset();
    resetMessage();
  };

  const handleDelete = async (id: number) => {
    const password = await new Promise<string>((resolve) =>
      resolve(prompt('등록한 비밀번호를 입력해주세요') || '')
    );
    await deleteMutate({ id, password });
  };

  return (
    <div className="flex p-10 justify-center items-center">
      <main className="bg-black w-full h-full justify-center items-center flex-col gap-8 flex">
        <h1 className="text-[24px]">방명록</h1>
        <div className="w-full flex flex-col gap-4 overflow-scroll">
          {data?.map((guestbook) => (
            <div className="flex justify-between items-start w-full flex-col gap-2 border border-white border-solid p-4 rounded-md">
              <div className="flex text-[24px] justify-between items-center w-full">
                <div key={guestbook.id}>{guestbook.name}</div>
                <button
                  className="text-[16px]"
                  onClick={() => handleDelete(guestbook.id)}
                >
                  X
                </button>
              </div>
              <div className="flex justify-between items-center w-full">
                <div>{guestbook.message}</div>
                <div>{getDisplayDate(guestbook.created_at)}</div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <div>작성자</div>
            <input
              type="text"
              className="rounded-md p-1 text-black max-w-32"
              value={name}
              onChange={onChange}
            />
          </div>
          <div>내용</div>
          <textarea
            className="rounded-md text-black p-1"
            value={message}
            onChange={onMessageChange}
          />
          <button
            className="p-4 border border-white rounded-md"
            onClick={handleSubmit}
          >
            작성하기
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
