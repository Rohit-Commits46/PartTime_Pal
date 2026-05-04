import { useState, useEffect, useCallback, useRef } from "react";
import { useChatstore } from "../../store/useChatstore";
import { useAuthstore } from "../../store/useauthstore";

export default function ChatBox() {
  const {
    getuser,
    users,
    selectedUser,
    isuserloading,
    setSelecteduser,
    getmessages,
    sendMessage,
     listentoMessages,removeMessages,
    messages, // ✅ Get messages directly from the store
  } = useChatstore();
  const { authuser } = useAuthstore();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    try {
      await sendMessage(text); 
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = useCallback(() => {
    getuser();
  }, [getuser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedUser?._id) {

      getmessages(selectedUser._id);
    listentoMessages();

    }
    return () => {
      removeMessages(); // ✅ Cleanup should always run
    };
  }, [selectedUser, getmessages]);

  useEffect(() => { 
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="flex h-screen bg-gray-900 text-white">
        <ul className="w-64 bg-gray-800 p-3 space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 50px)" }}>
          {users.length > 0 ? (
            users
              .filter((user) => user._id !== authuser._id)
              .map((user) => (
                <li
                  key={user._id}
                  onClick={() => setSelecteduser(user)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                    selectedUser?._id === user._id
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <img
                    src="/avatar.png"
                    alt="User Avatar"
                    className="rounded-full mr-3"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <span className="text-lg font-semibold">{user.firstname}</span>
                </li>
              ))
          ) : (
            <li className="text-gray-400 text-center py-4">
              {isuserloading ? "Loading users..." : "No users available"}
            </li>
          )}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center">
          <span className="text-lg font-semibold">
            {selectedUser ? selectedUser.firstname : "Select a user to chat"}
          </span>
        </div>

        {/* Chat Messages */}
        <div
          className="messages-container flex-grow-1 overflow-auto p-3"
          style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.senderid === authuser._id ? "flex-end" : "flex-start",
                    backgroundColor: msg.senderid === authuser._id ? "#dcf8c6" : "#ffffff",
                    padding: "10px",
                    borderRadius: "12px",
                    maxWidth: "60%",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "left",
                    fontSize: "16px",
                    wordWrap: "break-word",
                  }}
                >
                  <p style={{ margin: 0 ,color:"black"}}>{msg.text}</p>
                  <p style={{ fontSize: "12px", color: "#555", textAlign: "right", marginTop: "5px" }}>
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "No time"}
                  </p>
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* Input Box */}
        <div
          className="message-input-container p-2 bg-white border-t"
          style={{
            width: "100%",
            position: "sticky",
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
            padding: "10px",
            borderTop: "1px solid #ddd",
          }}
        >
          <form onSubmit={handleSendMessage} className="d-flex align-items-center bg-light rounded p-2" style={{ width: "100%" }}>
            <input
              type="text"
              value={text}
              placeholder="Type a message..."
              className="form-control me-2"
              onChange={(e) => setText(e.target.value)}
              style={{
                flex: 1,
                borderRadius: "20px",
                padding: "10px",
                outline: "none",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                color: "#333",
                zIndex: 1001,
              }}
            />

            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center justify-content-center"
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: text.trim() ? 1 : 0.5,
                cursor: text.trim() ? "pointer" : "not-allowed",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                zIndex: 1002,
              }}
              disabled={!text.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
