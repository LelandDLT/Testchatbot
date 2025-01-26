import { useState, useReducer, useEffect } from 'react'
import { Settings, Send, Bot } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
  aiModel?: string
}

type AIModel = {
  id: string
  name: string
  model: string
  helpUrl: string
}

const AI_MODELS: AIModel[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    model: 'gpt-4',
    helpUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    model: 'claude-3',
    helpUrl: 'https://console.anthropic.com/settings/keys'
  },
  {
    id: 'groq',
    name: 'Groq',
    model: 'mixtral-8x7b-32768',
    helpUrl: 'https://console.groq.com/keys'
  }
]

function messageReducer(state: Message[], action: Message) {
  return [...state, action]
}

export default function App() {
  const [messages, dispatch] = useReducer(messageReducer, [])
  const [input, setInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedAI, setSelectedAI] = useState<AIModel>(AI_MODELS[0])
  const [apiKey, setApiKey] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input
    }
    
    dispatch(userMessage)
    setInput('')

    // Simulated AI response
    const aiResponse: Message = {
      role: 'assistant',
      content: `This is a mock response from ${selectedAI.name}. 
                Actual implementation would connect to the ${selectedAI.model} API.`,
      aiModel: selectedAI.model
    }

    setTimeout(() => dispatch(aiResponse), 1000)
  }

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl p-4 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-100'
            }`}>
              <div className="text-sm mb-2 flex items-center gap-2">
                {msg.role === 'assistant' && (
                  <Bot className="w-4 h-4" />
                )}
                {msg.aiModel && (
                  <span className="text-xs opacity-75">
                    {msg.aiModel}
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-slate-800 rounded-lg"
            >
              <Settings className="w-6 h-6" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">AI Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">AI Provider</label>
                <select
                  value={selectedAI.id}
                  onChange={(e) => {
                    const ai = AI_MODELS.find(m => m.id === e.target.value)
                    if (ai) setSelectedAI(ai)
                  }}
                  className="w-full bg-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {AI_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.model})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your API key"
                />
                <a
                  href={selectedAI.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline mt-1 inline-block"
                >
                  Get API key
                </a>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
