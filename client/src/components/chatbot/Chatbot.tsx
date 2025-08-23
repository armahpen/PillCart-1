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
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Ordering & Prescriptions", query: "how do i order" },
    { label: "Product Information", query: "tell me about medications" },
    { label: "Returns & Refunds", query: "return policy" },
    { label: "Shipping & Delivery", query: "delivery options" },
    { label: "Contact Support", query: "contact support" },
    { label: "Privacy & Security", query: "data safe" }
  ];

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
    
    // Contact Support
    'contact support': "You can reach our support team at smilepills21@gmail.com or call +233 209339912, Monday-Saturday, 24/7. Prefer to send a message now? I can help you draft one!",
    'how do i contact': "You can reach our support team at smilepills21@gmail.com or call +233 209339912, Monday-Saturday, 24/7. Prefer to send a message now? I can help you draft one!",
    'contact': "You can reach us at 0544137947 or +233 209339912, email smilepills21@gmail.com, or use WhatsApp at +233 209339912 for instant support. We're available Monday-Saturday, 24/7!",
    
    // Product Information
    'tell me about': "Could you clarify the medication name? For example, if it's one of our products, I can share details like its uses, dosage, and side effects. You can also check the \"Products\" section on our website for full info. Need help finding it?",
    'medication safe': "Absolutely, all our medications meet strict safety standards set by regulators like the FDA or EMA. Always consult your doctor to ensure a medication is right for you. Want tips on safe medication use?",
    'medications safe': "Absolutely, all our medications meet strict safety standards set by regulators like the FDA or EMA. Always consult your doctor to ensure a medication is right for you. Want tips on safe medication use?",
    'safe': "Absolutely, all our medications meet strict safety standards set by regulators like the FDA or EMA. Always consult your doctor to ensure a medication is right for you. Want tips on safe medication use?",
    'generic drugs': "Yes, we offer generic medications that are just as effective as brand-name drugs but more affordable. Browse our product catalog to see options. Looking for something specific?",
    'generic': "Yes, we offer generic medications that are just as effective as brand-name drugs but more affordable. Browse our product catalog to see options. Looking for something specific?",
    
    // Prescriptions and Ordering
    'need a prescription': "Most of our medications require a valid prescription from a licensed healthcare provider. Some over-the-counter products don't. Tell me what you're looking for, and I'll confirm!",
    'prescription required': "Most of our medications require a valid prescription from a licensed healthcare provider. Some over-the-counter products don't. Tell me what you're looking for, and I'll confirm!",
    'prescription': "For prescription medications, we require a valid prescription from a licensed healthcare provider. Our team verifies all prescriptions to ensure safety.",
    'how do i order': "Easy! Go to our website, select your medication, upload your prescription (if needed), and follow the checkout steps. Need help with the process or want to check shipping options?",
    'order medication': "Easy! Go to our website, select your medication, upload your prescription (if needed), and follow the checkout steps. Need help with the process or want to check shipping options?",
    'order': "To place an order: 1) Browse our products 2) Add items to cart 3) Upload prescription if required 4) Proceed to checkout. Need help with any step?",
    'ship internationally': "Currently we primarily serve customers in Ghana with same-day delivery in Accra and typically complete orders within 1–3 working days nationwide. Please contact us for specific international shipping requests.",
    'international shipping': "Currently we primarily serve customers in Ghana with same-day delivery in Accra and typically complete orders within 1–3 working days nationwide. Please contact us for specific international shipping requests.",
    'shipping': "We provide reliable shipping across Ghana. Same-day delivery in Accra, 1-3 working days for other regions.",
    'delivery': "We offer same-day delivery in Accra and 1-3 day delivery nationwide across Ghana. Delivery fees vary by location.",
    
    // Safety and Side Effects
    'side effects': "I'm not a doctor, but please contact your healthcare provider right away if you're experiencing side effects. You can also report them to us via our website or by calling +233 209339912. Need help finding the reporting form?",
    'having side effects': "I'm not a doctor, but please contact your healthcare provider right away if you're experiencing side effects. You can also report them to us via our website or by calling +233 209339912. Need help finding the reporting form?",
    'medication safe for me': "I'd recommend checking with your doctor to confirm if a medication suits your health needs. Want me to share general info about the medication, like its uses or precautions?",
    'safe for me': "I'd recommend checking with your doctor to confirm if a medication suits your health needs. Want me to share general info about the medication, like its uses or precautions?",
    'right for me': "I'd recommend checking with your doctor to confirm if a medication suits your health needs. Want me to share general info about the medication, like its uses or precautions?",
    
    // Returns and Refunds
    'return medication': "Due to safety regulations, we typically don't accept returns unless the product is damaged or incorrect. Check our return policy online for details. Want help starting a return request?",
    'can i return': "Due to safety regulations, we typically don't accept returns unless the product is damaged or incorrect. Check our return policy online for details. Want help starting a return request?",
    'return': "Due to pharmaceutical safety regulations, returns are generally not accepted unless the product is damaged or incorrect upon delivery.",
    'get a refund': "If your order qualifies (e.g., damaged product), contact our support team within 7 days of delivery with your order number. I can guide you to the refund request form if you'd like!",
    'refund': "Refunds may be available for damaged or incorrect products. Contact our support team within 7 days of delivery with your order details.",
    
    // Privacy and Security
    'data safe': "Yes, we use top-notch encryption to protect your personal and payment info. Curious about our Privacy Policy? I can link you to it or explain the basics!",
    'my data safe': "Yes, we use top-notch encryption to protect your personal and payment info. Curious about our Privacy Policy? I can link you to it or explain the basics!",
    'privacy': "We prioritize your privacy and use industry-standard encryption. Check our Privacy Policy page for complete details about how we handle your information.",
    'prescription data': "Your prescription data is securely stored and only used to process your order, following strict privacy laws. Want more details on how we handle your info?",
    
    // Additional Support
    'health condition': "Our website has a \"Health Resources\" section with expert-written articles on various conditions. I can suggest some topics or help you search for specific info. What condition are you curious about?",
    'learn about': "Our website has a \"Health Resources\" section with expert-written articles on various conditions. I can suggest some topics or help you search for specific info. What condition are you curious about?",
    'discounts': "Yes, we offer discounts and patient assistance programs for eligible customers. Visit our \"Patient Support\" page to learn more or apply. Want me to guide you there?",
    'assistance programs': "Yes, we offer discounts and patient assistance programs for eligible customers. Visit our \"Patient Support\" page to learn more or apply. Want me to guide you there?",
    
    // Pricing - redirect to appropriate pages
    'price': "For current pricing on our medications and health products, please visit our Shop page where all prices are clearly displayed in Ghana Cedis (GHS). Looking for something specific?",
    'cost': "All our product costs are listed in Ghana Cedis (GHS) on our Shop page. Our prices are competitive and transparent. What product are you interested in?",
    'how much': "You can find pricing for all our products on the Shop page. Prices are listed in Ghana Cedis (GHS). Need help finding a specific product?",
    'pricing': "Visit our Shop section to see current pricing on all medications and health products. All prices are in Ghana Cedis (GHS). Looking for anything specific?",
    
    // Operating hours and location
    'hours': "We're available Monday-Saturday, 24/7. Our team is always ready to help with your healthcare needs!",
    'working hours': "We're available Monday-Saturday, 24/7. Our team is always ready to help with your healthcare needs!",
    'open': "We're available Monday-Saturday, 24/7. Our team is always ready to help with your healthcare needs!",
    'location': "We're located in East Legon Hills, Accra, Ghana. We serve customers nationwide with reliable delivery services.",
    'where are you': "We're located in East Legon Hills, Accra, Ghana. We serve customers nationwide with reliable delivery services.",
    
    // Quality and compliance
    'quality': "We ensure the highest quality standards. All medications are properly stored, handled, and dispensed by certified pharmacy professionals.",
    'licensed': "Yes, we're a licensed pharmaceutical business operating in Ghana with certified pharmacy technicians and full regulatory compliance.",
    'certified': "Our team includes certified pharmacy technicians with 4+ years of experience. We maintain full compliance with healthcare regulations.",
    
    // Medical advice compliance
    'medical advice': "I can't provide medical advice. Please consult your licensed healthcare provider for medical questions. I can help with general product information and ordering assistance.",
    'what should i take': "I can't recommend specific medications. Please consult your doctor or pharmacist who can assess your individual health needs and recommend appropriate treatment.",
    'recommend medication': "I can't recommend specific medications. Please consult your doctor or pharmacist who can assess your individual health needs and recommend appropriate treatment.",
    'dosage': "For dosage information, please consult your healthcare provider or check the medication packaging. I can't provide specific dosage recommendations.",
    
    // Default responses  
    'help': "I can help with: product information, ordering process, delivery details, pricing, safety questions, and general inquiries. For medical advice, please consult your healthcare provider. What would you like to know?",
    'thank you': "You're welcome! Is there anything else I can help you with today?",
    'thanks': "My pleasure! Feel free to ask if you have any other questions.",
    'another question': "I'm here to help! What's your question? If it's complex, I can connect you with our support team or check our resources for an answer.",
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for human agent request
    if (lowerMessage.includes('human') || lowerMessage.includes('person') || 
        lowerMessage.includes('agent') || lowerMessage.includes('real person') ||
        lowerMessage.includes('talk to someone') || lowerMessage.includes('speak to')) {
      return "I'd be happy to connect you with our pharmacy team! For personalized assistance, please contact us on WhatsApp at +233 209339912. Our licensed pharmacists are available Monday-Saturday, 24/7 to help with your specific needs.";
    }

    // Check for medical advice requests - redirect to healthcare providers
    if (lowerMessage.includes('diagnose') || lowerMessage.includes('what medication') || 
        lowerMessage.includes('should i take') || lowerMessage.includes('medical advice') ||
        lowerMessage.includes('treat my') || lowerMessage.includes('cure') ||
        lowerMessage.includes('symptoms') || lowerMessage.includes('drug interaction')) {
      return "I can't provide medical advice or diagnose conditions. Please consult your licensed healthcare provider or pharmacist for medical questions. They can assess your individual health needs and recommend appropriate treatment. I can help with general product information and ordering assistance.";
    }

    // Find matching response - check longer phrases first for better matching
    const sortedResponses = Object.entries(faqResponses).sort((a, b) => b[0].length - a[0].length);
    
    for (const [key, response] of sortedResponses) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default response with WhatsApp option
    return "I'm not sure about that specific question, but I'm here to help! For detailed assistance or complex questions, feel free to contact our pharmacy team directly on WhatsApp at +233 209339912. We're available Monday-Saturday, 24/7. What else can I help you with?";
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
    setShowQuickButtons(false); // Hide quick buttons after first user message

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

  const handleQuickAction = (query: string, label: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: label,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowQuickButtons(false); // Hide quick buttons after selection

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(query),
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
              
              {/* Quick Action Buttons */}
              {showQuickButtons && (
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                      <p className="text-xs text-gray-600 mb-2">Quick topics:</p>
                      <div className="grid grid-cols-1 gap-1">
                        {quickActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.query, action.label)}
                            className="justify-start text-xs h-7 px-2 border-secondary/30 hover:bg-secondary/10 hover:border-secondary"
                          >
                            {action.label}
                          </Button>
                        ))}
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