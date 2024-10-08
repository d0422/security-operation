import useGuestbookMutation from './apis/useGuestbookMutation';
import useGuestbookQuery from './apis/useGuestbookQuery';
import { useInput } from '@rapiders/react-hooks';

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

    await postMutate({
      name,
      message,
    });
    reset();
    resetMessage();
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
                  onClick={() => deleteMutate(guestbook.id)}
                >
                  X
                </button>
              </div>
              <div>{guestbook.message}</div>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <div>작성자</div>
            <input
              type="text"
              className="rounded-md p-1 text-black"
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
