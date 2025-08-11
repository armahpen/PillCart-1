import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  User, 
  Clock,
  CheckCircle,
  MinusCircle
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'staff';
  senderName: string;
  timestamp: Date;
  type: 'message' | 'system';
}

interface ChatSession {
  id: string;
  status: 'waiting' | 'connected' | 'ended';
  staffName?: string;
  staffRole?: string;
  startedAt: Date;
  queuePosition?: number;
}

export default function ChatWidget() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineStaff, setOnlineStaff] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize WebSocket connection
  const initializeChat = () => {
    if (!isAuthenticated || wsRef.current) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log("Chat WebSocket connected");
      // Join chat with user info
      wsRef.current?.send(JSON.stringify({
        type: 'join',
        userId: user?.id,
        userName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email
      }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'message':
          const newMsg: Message = {
            id: data.id,
            text: data.text,
            sender: data.sender,
            senderName: data.senderName,
            timestamp: new Date(data.timestamp),
            type: 'message'
          };
          
          setMessages(prev => [...prev, newMsg]);
          
          // Update unread count if widget is closed
          if (!isOpen && data.sender === 'staff') {
            setUnreadCount(prev => prev + 1);
          }
          break;

        case 'session_update':
          setChatSession(data.session);
          
          // Add system message for session updates
          if (data.session.status === 'connected' && data.session.staffName) {
            const systemMsg: Message = {
              id: `system-${Date.now()}`,
              text: `${data.session.staffName} (${data.session.staffRole}) has joined the chat`,
              sender: 'staff',
              senderName: 'System',
              timestamp: new Date(),
              type: 'system'
            };
            setMessages(prev => [...prev, systemMsg]);
          }
          break;

        case 'typing':
          setIsTyping(data.isTyping);
          break;

        case 'staff_status':
          setOnlineStaff(data.onlineCount);
          break;

        case 'error':
          toast({
            title: "Chat Error",
            description: data.message,
            variant: "destructive",
          });
          break;
      }
    };

    wsRef.current.onclose = () => {
      console.log("Chat WebSocket disconnected");
      wsRef.current = null;
      
      // Try to reconnect after 3 seconds if user is authenticated
      if (isAuthenticated) {
        setTimeout(() => {
          initializeChat();
        }, 3000);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("Chat WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to chat. Please try again.",
        variant: "destructive",
      });
    };
  };

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      initializeChat();
    } else {
      // Cleanup when not authenticated
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setMessages([]);
      setChatSession(null);
      setUnreadCount(0);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, user]);

  const startChat = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to start a chat.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Connection Error",
        description: "Chat service is not available. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    wsRef.current.send(JSON.stringify({
      type: 'start_chat'
    }));

    // Add welcome message
    const welcomeMsg: Message = {
      id: `welcome-${Date.now()}`,
      text: "Hello! We're connecting you with one of our pharmacy staff. Please wait a moment...",
      sender: 'staff',
      senderName: 'Smile Pills Support',
      timestamp: new Date(),
      type: 'system'
    };
    setMessages([welcomeMsg]);
    setIsConnecting(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      type: 'message',
      text: newMessage.trim()
    }));

    setNewMessage("");
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    
    // Send typing indicator
    if (wsRef.current && chatSession?.status === 'connected') {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        isTyping: value.length > 0
      }));
      
      // Clear typing after 2 seconds of no typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      if (value.length > 0) {
        typingTimeoutRef.current = setTimeout(() => {
          if (wsRef.current) {
            wsRef.current.send(JSON.stringify({
              type: 'typing',
              isTyping: false
            }));
          }
        }, 2000);
      }
    }
  };

  const endChat = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'end_chat'
      }));
    }
    setChatSession(null);
    setMessages([]);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={toggleWidget}
            className="w-14 h-14 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg relative"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 min-w-6 h-6 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        )}

        {/* Chat Widget */}
        {isOpen && (
          <Card className="w-96 h-[500px] shadow-xl border-2 border-primary/20">
            {/* Header */}
            <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {chatSession?.status === 'connected' ? 
                        `Chat with ${chatSession.staffName}` : 
                        'Pharmacy Support'
                      }
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-xs text-blue-100">
                      {chatSession?.status === 'connected' && (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Online</span>
                        </>
                      )}
                      {chatSession?.status === 'waiting' && (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>
                            {chatSession.queuePosition ? 
                              `Position ${chatSession.queuePosition} in queue` : 
                              'Connecting...'
                            }
                          </span>
                        </>
                      )}
                      {!chatSession && (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>{onlineStaff} staff online</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleWidget}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0 flex flex-col h-[360px]">
              {!chatSession ? (
                // Start Chat Screen
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Need help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Chat with our pharmacy staff for expert advice on medicines, 
                      prescriptions, and health questions.
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Licensed pharmacists available</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Prescription consultation</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Health advice & support</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={startChat} 
                    disabled={isConnecting}
                    className="w-full bg-primary text-white hover:bg-primary/90"
                  >
                    {isConnecting ? "Connecting..." : "Start Chat"}
                  </Button>
                  <div className="text-xs text-gray-500">
                    Available Monday-Saturday, 24/7
                  </div>
                </div>
              ) : (
                // Chat Messages
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.type === 'system'
                                ? 'bg-gray-100 text-gray-600 text-center text-sm'
                                : message.sender === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {message.type !== 'system' && message.sender === 'staff' && (
                              <div className="text-xs text-gray-500 mb-1">
                                {message.senderName}
                              </div>
                            )}
                            <div className="text-sm">{message.text}</div>
                            <div className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-600 rounded-lg p-3 max-w-[80%]">
                            <div className="text-sm">Staff is typing...</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        disabled={chatSession.status !== 'connected'}
                        className="flex-1"
                      />
                      <Button 
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || chatSession.status !== 'connected'}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {chatSession.status === 'connected' && (
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-gray-500">
                          Connected to {chatSession.staffName}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={endChat}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
                          End Chat
                        </Button>
                      </div>
                    )}
                    
                    {chatSession.status === 'waiting' && (
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        Waiting for pharmacy staff to join...
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}