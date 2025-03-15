import { useState, useRef, useEffect } from 'react'
import { cn } from './lib/utils'
import { SendIcon, User2, Bot, Loader2 } from 'lucide-react'

// Define message types
type MessageType = 'user' | 'assistant'

interface Message {
  id: string
  type: MessageType
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "I understand what you're asking. Let me help with that.",
        "That's an interesting question. Here's what I think...",
        "Based on my knowledge, I can provide this information.",
        "I've analyzed your request and here's my response.",
        "Let me process that and give you a thoughtful answer."
      ]
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: randomResponse
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary-950 text-secondary-50">
      {/* Header */}
      <header className="border-b border-secondary-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">AI Chat</h1>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-secondary-300">Online</span>
          </div>
        </div>
      </header>
      
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 container mx-auto max-w-4xl">
        <div className="space-y-4 pb-20">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "flex items-start gap-3 animate-fade-in",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.type === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
              )}
              
              <div 
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.type === 'user' 
                    ? "bg-primary-600 text-white" 
                    : "bg-secondary-800 text-secondary-100"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              
              {message.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-700 flex items-center justify-center">
                  <User2 size={18} className="text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-secondary-800 text-secondary-100">
                <Loader2 className="h-5 w-5 animate-spin text-secondary-400" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-secondary-900 border-t border-secondary-800 p-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-secondary-800 text-secondary-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className={cn(
                "rounded-lg p-2 transition-colors",
                input.trim() && !isLoading
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-secondary-800 text-secondary-500 cursor-not-allowed"
              )}
            >
              <SendIcon size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App