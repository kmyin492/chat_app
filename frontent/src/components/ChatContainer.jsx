import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className={`text-xs opacity-50 ml-1 `}>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="relative group flex flex-col
            justify-center items-center ">
              <div
                className={`chat-bubble flex flex-col max-w-[100%] rounded-xl ${
                  message.senderId === authUser._id
                    ? "bg-primary"
                    : "bg-base-200"
                }`}
              >
                {message.isDeleted ? (
                  <p className="italic text-gray-500">
                    This message was deleted
                  </p>
                ) : (
                  <>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && (
                      <p
                        className={`${
                          message.senderId === authUser._id
                            ? "text-primary-content"
                            : "text-base-content"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}
                  </>
                )}
              </div>

              {message.senderId === authUser._id && (
                <button
                  className={`${
                    message.isDeleted ? "hidden" : ""
                  } min-h-0 h-3 w-3 absolute top-50% -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500`}
                  onClick={() => deleteMessage(message._id)}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
