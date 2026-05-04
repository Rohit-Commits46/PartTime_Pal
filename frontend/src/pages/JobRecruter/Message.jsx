import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';  // <-- Add useSearchParams
import { useState, useEffect, useCallback, useRef } from "react";
import { useChatstore } from "../../store/useChatstore";
import { useAuthstore } from "../../store/useAuthstore";

const MessagesRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contactId = searchParams.get('contact'); // Get contact ID from URL params
  
  const {
    getuser,
    users = [],
    selectedUser,
    isuserloading,
    setSelecteduser,
    getmessages,
    sendMessage,
    listentoMessages,
    removeMessages,
    messages = [],
    getRecruiterForContact,
  } = useChatstore(); 

  const { authuser, loadAuthuser} = useAuthstore();
  const storedUser = localStorage.getItem('authuser');
  useEffect(() => {
  if (!authuser && localStorage.getItem("authuser")) {
    loadAuthuser();
  }
}, [authuser]);
// useEffect(() => {
//   loadAuthuser();
// }, []);


  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false); // Changed from true to false
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setShouldAutoScroll(true); // Always auto-scroll when user sends a message
      await sendMessage(text);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
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
      // On first conversation load, scroll to top to read from beginning
      setIsFirstLoad(true);
      setShouldAutoScroll(false);
    }
    return () => removeMessages();
  }, [selectedUser, getmessages]);

  // Smart auto-scroll: scroll to top on first load, auto-scroll to bottom only for new messages
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      if (isFirstLoad) {
        // Scroll to top when first opening a conversation
        messagesContainerRef.current.scrollTop = 0;
        setIsFirstLoad(false);
      } else if (shouldAutoScroll) {
        // Auto-scroll to bottom only for new messages when user is already at bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShouldAutoScroll(false);
      }
    }
  }, [messages, shouldAutoScroll, isFirstLoad]);

  // Check if user is near bottom when they scroll
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;
      // Only enable auto-scroll for new messages if user is near bottom
      if (isNearBottom && !isFirstLoad) {
        setShouldAutoScroll(true);
      } else {
        setShouldAutoScroll(false);
      }
    }
  };

  // Handle direct contact from URL parameter
  useEffect(() => {
    const handleDirectContact = async () => {
      if (contactId && users.length >= 0) { // Changed from > 0 to >= 0
        console.log("Looking for contact with ID:", contactId);
        console.log("Available users:", users);
        
        // Try to find the contact by recid (which matches providerId from application)
        let contactUser = users.find(user => 
          user.recid === contactId || 
          user._id === contactId ||
          user.id === contactId
        );
        
        console.log("Found contact user in existing list:", contactUser);
        
        // If not found in existing users, try to fetch the specific recruiter
        if (!contactUser) {
          console.log("Contact not found in existing list, fetching from API...");
          setLoadingContact(true);
          contactUser = await getRecruiterForContact(contactId);
          console.log("Fetched contact user from API:", contactUser);
          setLoadingContact(false);
        }
        
        if (contactUser && contactUser._id !== selectedUser?._id) {
          setSelecteduser(contactUser);
          console.log("Selected user for contact:", contactUser);
        } else if (!contactUser) {
          console.warn("Contact user not found anywhere");
        }
      }
    };
    
    handleDirectContact();
  }, [contactId, users.length, selectedUser, setSelecteduser, getRecruiterForContact]);

// console.log(users)
  return (

    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Contact notification banner */}
        {contactId && (
          <div className={`mb-4 border rounded-md p-4 ${
            selectedUser ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {loadingContact ? (
                  <svg className="animate-spin h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : selectedUser ? (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${selectedUser ? 'text-green-800' : 'text-yellow-800'}`}>
                  {loadingContact ? (
                    "Loading employer contact..."
                  ) : selectedUser ? (
                    <>You can now chat with <strong>{selectedUser.name}</strong> about your job application.</>
                  ) : (
                    <>Unable to find employer with ID: <strong>{contactId}</strong>. They may not be available for chat yet.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with employers and recruiters</p>
        </div>

        <div className="bg-white border rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3">
          {/* Sidebar: Users */}
          <div className="border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute top-2.5 left-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-250px)]">
              {users.length > 0 ? (
                [...users]
                  .filter((user) =>
                    (user.name || user.first_name || user.username || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((user) => {
                    const displayName = user.first_name || user.name || user.username || "Unknown";

                    return (
                      <div
                        key={user._id}
                        onClick={() => {
                          setSelecteduser(user);
                          setIsFirstLoad(true); // Reset first load flag when selecting new user
                        }}
                        className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                          selectedUser?._id === user._id ? "bg-indigo-50" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-indigo-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {displayName[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {displayName}
                            </h4>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="p-4 text-gray-400 text-sm">No users found</div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="md:col-span-2 flex flex-col">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
              {selectedUser ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {selectedUser?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h2 className="text-md font-semibold text-gray-900">
                      {selectedUser.first_name || selectedUser.name || selectedUser.username}
                    </h2>
                  </div>
                </div>
              ) : (
                <h2 className="text-lg font-semibold">Select a user to chat</h2>
              )}
            </div>

            {/* Chat Messages */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-[500px]"
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow ${
                      msg.senderid === authuser?._id
                        ? "bg-indigo-100 ml-auto self-end"
                        : "bg-gray-200"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs text-right text-gray-500 mt-1">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "Just now"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No messages yet</p>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input Box */}
            <div className="border-t px-4 py-3 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full px-4 py-2 outline-none"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesRoute;
