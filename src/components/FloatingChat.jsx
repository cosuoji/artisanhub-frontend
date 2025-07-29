import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

function FloatingChat({ artisanId }) {
  const { user } = useAuthStore();
  const { joinRoom, sendText, sendImage, messages } = useChatStore();
  const room = `${user?._id}:${artisanId}`;

  const [isChatVisible, setIsChatVisible] = useState(false); // starts minimized
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [text, setText] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    joinRoom(room, user);
    return () => {
      useChatStore.getState().socket.off('new-message');
    };
  }, [room, user]);

  const handleSend = () => {
    if (text.trim()) {
      sendText(text.trim());
      setText('');
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result.split(',')[1];
      sendImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (url) => {
    setSelectedImageUrl(url);
    setIsImageModalOpen(true);
  };

  return (
    <div className="fixed bottom-30 right-4 z-50">
      {isChatVisible ? (
        <div className="bg-white w-80 max-h-[450px] bg-base-100 shadow-xl rounded-lg p-3 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Chat with Artisan</h3>
            <button
              onClick={() => setIsChatVisible(false)}
              className="text-gray-500 hover:text-red-500 text-xl font-bold"
              aria-label="Minimize chat"
            >
              &minus;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto text-sm space-y-2 mb-2">
            {messages?.map((m, i) => (
              <div key={`${m._id}-${i}`} className="text-xs">
                {m.text}
                {m.imageUrl && (
                  <img
                    src={m.imageUrl}
                    alt="img"
                    className="w-20 rounded mt-1 cursor-pointer"
                    onClick={() => handleImageClick(m.imageUrl)}
                  />
                )}
              </div>
            ))}
          </div>

          <input
            type="file"
            onChange={handleImage}
            ref={fileRef}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-1">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input input-sm input-bordered border-2 w-full"
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="btn btn-sm">Send</button>
            <button onClick={() => fileRef.current?.click()} className="btn btn-sm">📷</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsChatVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg focus:outline-none transition"
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <img src={selectedImageUrl} alt="img" className="max-w-full max-h-screen" />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-sm"
              aria-label="Close image"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FloatingChat;
