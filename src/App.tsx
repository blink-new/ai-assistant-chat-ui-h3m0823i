import { useState, useRef, useEffect } from 'react'
import { cn } from './lib/utils'
import { ArrowUp, User2, Bot, Loader2 } from 'lucide-react'

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
      content: 'Hi, I\'m Vercel\'s AI assistant. How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [input])

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

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="border-b border-neutral-800 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <Bot size={18} className="text-black" />
            </div>
            <h1 className="text-sm font-medium">Vercel AI Assistant</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              Online
            </span>
          </div>
        </div>
      </header>
      
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "flex group",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex max-w-[85%] sm:max-w-[75%]",
                message.type === 'user' ? "flex-row-reverse" : "flex-row",
              )}>
                <div className={cn(
                  "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1",
                  message.type === 'user' ? "ml-3" : "mr-3",
                  message.type === 'user' ? "bg-neutral-800" : "bg-white"
                )}>
                  {message.type === 'user' ? (
                    <User2 size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-black" />
                  )}
                </div>
                
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm",
                  message.type === 'user' 
                    ? "bg-neutral-800 text-white" 
                    : "bg-white text-black"
                )}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] sm:max-w-[75%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white flex items-center justify-center mr-3 mt-1">
                  <Bot size={16} className="text-black" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white text-black">
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-neutral-800 py-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Vercel AI..."
              rows={1}
              className="w-full resize-none bg-neutral-900 rounded-xl border border-neutral-800 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700 placeholder:text-neutral-500"
              style={{ maxHeight: '200px' }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-3 bottom-3 p-1.5 rounded-lg transition-colors",
                input.trim() && !isLoading
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              )}
            >
              <ArrowUp size={16} />
            </button>
          </form>
          <div className="mt-2 text-xs text-neutral-500 flex justify-between">
            <span>Powered by Vercel</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400 font-mono text-xs">Enter</kbd> to send</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App