import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Phone
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm the Smile Pills virtual assistant. How can I help you today? 💊",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const faqResponses: { [key: string]: string } = {
    // Greeting patterns
    'hello': "Hello! Welcome to Smile Pills Ltd. How can I assist you with your pharmaceutical needs today?",
    'hi': "Hi there! I'm here to help with any questions about our medications and services.",
    'good morning': "Good morning! How can Smile Pills help you today?",
    'good afternoon': "Good afternoon! What can I help you with?",
    'good evening': "Good evening! How may I assist you?",
    
    // Product inquiries
    'medication': "We offer a wide range of quality medications. You can browse our shop section or ask about specific medicines. Do you have a particular medication in mind?",
    'medicine': "We stock various medicines and healthcare products. What specific medication are you looking for?",
    'prescription': "For prescription medications, we require a valid prescription from a licensed healthcare provider. Our team verifies all prescriptions to ensure safety.",
    'over the counter': "We have many over-the-counter medications available without prescription. Check our shop for pain relief, vitamins, and general health products.",
    'vitamins': "We stock various vitamins and supplements. Popular items include multivitamins, Vitamin D, B-complex, and specialized supplements.",
    
    // Ordering process
    'order': "To place an order: 1) Browse our products 2) Add items to cart 3) Upload prescription if required 4) Proceed to checkout. Need help with any step?",
    'how to order': "Ordering is simple! Browse our shop, select products, upload prescriptions if needed, and checkout. We'll handle the rest!",
    'delivery': "We offer same-day delivery in Accra and 1-3 day delivery nationwide across Ghana. Delivery fees vary by location.",
    'shipping': "We provide reliable shipping across Ghana. Same-day delivery in Accra, 1-3 working days for other regions.",
    
    // Pricing and payment
    'price': "Prices vary by product. All prices are listed in Ghana Cedis (GHS). Check our shop section for current pricing on medications and health products.",
    'payment': "We accept various payment methods including mobile money, bank transfers, and cards through our secure payment system.",
    'cost': "Our prices are competitive and clearly displayed on each product. We offer quality medications at affordable rates.",
    
    // Safety and quality
    'safe': "Yes! All our medications meet international safety standards. We source from licensed suppliers and follow strict quality control procedures.",
    'quality': "We ensure the highest quality standards. All medications are properly stored, handled, and dispensed by certified pharmacy professionals.",
    'expiry': "We regularly check expiry dates and never dispense expired medications. All products are fresh and within their shelf life.",
    
    // Operating hours and contact
    'hours': "We're available Monday-Saturday, 24/7. Our team is always ready to help with your healthcare needs!",
    'contact': "You can reach us at 0544137947 or +233 209339912, email smilepills21@gmail.com, or use WhatsApp for instant support.",
    'location': "We're located in East Legon Hills, Accra, Ghana. We serve customers nationwide with reliable delivery services.",
    
    // Returns and policies
    'return': "Due to pharmaceutical safety regulations, returns are generally not accepted unless the product is damaged or incorrect upon delivery.",
    'refund': "Refunds may be available for damaged or incorrect products. Contact our support team within 7 days of delivery with your order details.",
    
    // Technical support
    'website': "Having trouble with our website? Try refreshing the page or clearing your browser cache. Our team is here to help if issues persist.",
    'account': "Need help with your account? You can create one during checkout or contact support for assistance with login issues.",
    
    // Default responses
    'help': "I can help with: product information, ordering process, delivery details, pricing, safety questions, and general inquiries. What would you like to know?",
    'thank you': "You're welcome! Is there anything else I can help you with today?",
    'thanks': "My pleasure! Feel free to ask if you have any other questions.",
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for human agent request
    if (lowerMessage.includes('human') || lowerMessage.includes('person') || 
        lowerMessage.includes('agent') || lowerMessage.includes('real person') ||
        lowerMessage.includes('talk to someone') || lowerMessage.includes('speak to')) {
      return "I'd be happy to connect you with our pharmacy team! For personalized assistance, please contact us on WhatsApp at +233 209339912. Our licensed pharmacists are available to help with your specific needs.";
    }

    // Find matching response
    for (const [key, response] of Object.entries(faqResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default response with WhatsApp option
    return "I'm not sure about that specific question, but I'm here to help! For detailed assistance or complex questions, feel free to contact our pharmacy team directly on WhatsApp at +233 209339912. What else can I help you with?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(input),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleWhatsAppRedirect = () => {
    window.open('https://wa.me/233209339912', '_blank');
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-secondary hover:bg-secondary/90"
          data-testid="chat-button"
        >
          <MessageCircle className="h-6 w-6" />
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
            ?
          </Badge>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 h-96 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-secondary text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold text-sm">Smile Pills Assistant</h3>
                <p className="text-xs opacity-90">Online - Ask me anything!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <CardContent className="flex flex-col h-64 p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    {message.isBot && (
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`p-2 rounded-lg text-sm ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-primary text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                    {!message.isBot && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 text-sm"
                />
                <Button type="submit" size="sm" className="px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              {/* WhatsApp Quick Action */}
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsAppRedirect}
                  className="w-full text-xs"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Talk to Pharmacy Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}