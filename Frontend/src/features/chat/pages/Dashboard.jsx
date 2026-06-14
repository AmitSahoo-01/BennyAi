import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hook/useChat.js'
import { setCurrentChatId } from '../chat.slice.js'
import remarkGfm from 'remark-gfm'


const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const [chatInput, setChatInput] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    chat.initilizeSocketConnnection()
    chat.handleGetChats()
  }, [])

  const messagesLength = chats[currentChatId]?.messages?.length || 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messagesLength, currentChatId])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
  }

  const startNewChat = () => {
    dispatch(setCurrentChatId(null))
  }

  const suggestions = [
    { title: 'Indian Premier Leauge Winner', query: 'Who won the Indian Premier Leauge in 2026?', desc: 'Check latest sports history' },
    { title: 'Current News', query: 'What  is the current situation of iran,Us war.', desc: 'explain simply ' },
    { title: 'Modern Web Design', query: 'What are the main design trends for websites in 2026?', desc: 'Discover layout aesthetics' },
  ]

  const handleSuggestionClick = (query) => {
    setChatInput(query)
  }

  return (
    <main className='min-h-screen w-full bg-[#09090b] p-3 text-white md:p-5 font-sans antialiased'>
      <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl p-1 md:h-[calc(100vh-2.5rem)] border-none'>

        {/* Sidebar */}
        <aside className='hidden h-full w-72 shrink-0 rounded-3xl bg-[#121215] border border-zinc-800/80 p-4 md:flex md:flex-col shadow-2xl justify-between'>
          <div>
            <div className='flex items-center gap-3 mb-6 px-1'>
              <div className='w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-md'>
                <svg className='w-5 h-5 text-white font-bold' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
              <h1 className='text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent'>Benny_AI</h1>
            </div>

            {/* New Chat Button */}
            <button
              onClick={startNewChat}
              className='w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 hover:text-white transition duration-300 mb-6 shadow-sm shadow-black/40'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M12 4v16m8-8H4' />
              </svg>
              New Chat
            </button>

            {/* Conversation History */}
            <div className='space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1 messages'>
              <h2 className='text-xs font-semibold text-white/45 uppercase tracking-wider mb-2 px-1'>Recent Threads</h2>
              {Object.values(chats).length === 0 ? (
                <p className='text-xs text-white/30 italic px-1 py-2'>No threads yet...</p>
              ) : (
                Object.values(chats).map((chatItem) => {
                  const isActive = chatItem.id === currentChatId;
                  return (
                    <button
                      onClick={() => openChat(chatItem.id)}
                      key={chatItem.id}
                      type='button'
                      className={`w-full cursor-pointer flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition duration-300 ease-in-out border ${isActive
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm'
                          : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                        }`}
                    >
                      <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-300' : 'text-white/40'}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                      </svg>
                      <span className='truncate'>{chatItem.title}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* User status info or footer at sidebar bottom */}
          <div className='border-t border-white/[0.05] pt-4 mt-auto'>
            <div className='flex items-center gap-3 px-1'>
              <div className='w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow'>
                <span className='text-xs font-semibold text-zinc-400'>U</span>
              </div>
              <div className='flex flex-col min-w-0'>
                <span className='text-xs font-medium text-zinc-300 truncate'>Active Session</span>
                <span className='text-[10px] text-zinc-500 flex items-center gap-1.5'>
                  <span className='w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse' />
                  Connected
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Section */}
        <section className='relative max-w-4xl mx-auto flex h-full min-w-0 flex-1 flex-col justify-between p-2 md:p-4'>

          {/* Header Bar */}
          <header className='flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-4 shrink-0 px-2'>
            <div className='flex items-center gap-2.5'>
              <span className='w-2 h-2 rounded-full bg-zinc-500 shadow-sm shadow-zinc-500/50' />
              <h2 className='text-sm font-semibold tracking-tight text-zinc-300'>
                {currentChatId && chats[currentChatId] ? chats[currentChatId].title : 'New Search'}
              </h2>
            </div>
            {currentChatId && (
              <button
                onClick={startNewChat}
                className='md:hidden cursor-pointer flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10'
              >
                New Thread
              </button>
            )}
          </header>

          {/* Chat/Messages Display Area */}
          <div className='messages flex-1 space-y-6 overflow-y-auto pr-1 pb-36 px-2'>
            {(!currentChatId || !chats[currentChatId] || chats[currentChatId].messages.length === 0) ? (

              /* Premium Empty Welcome Screen */
              <div className='h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 md:py-24 space-y-8 animate-fade-in'>
                <div className='space-y-3'>
                  <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent'>
                    Where knowledge begins
                  </h1>
                  <p className='text-sm md:text-base text-white/40 font-medium'>
                    Ask anything. Our agent compiles research, searches the web, and gives structured answers instantly.
                  </p>
                </div>

                {/* Suggestions Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 w-full mt-4'>
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(sug.query)}
                      className='cursor-pointer text-left rounded-2xl border border-zinc-800/60 bg-[#121215]/80 hover:bg-[#16161a] p-4 transition duration-300 ease-in-out hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 group'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-xs font-semibold text-zinc-400'>{sug.title}</span>
                        <svg className='w-3.5 h-3.5 text-white/20 group-hover:text-zinc-300 transition duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M14 5l7 7m0 0l-7 7m7-7H3' />
                        </svg>
                      </div>
                      <p className='text-sm text-white/85 font-medium mb-1 truncate'>{sug.query}</p>
                      <p className='text-[11px] text-white/30 font-normal'>{sug.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (

              /* Message Thread List */
              chats[currentChatId].messages.map((message, idx) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  >
                    {!isUser && (
                      <div className='w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 shadow-md mt-1'>
                        <svg className='w-4.5 h-4.5 text-zinc-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm md:text-base transition duration-200 ${isUser
                          ? 'bg-zinc-800 border border-zinc-700/60 text-zinc-100 rounded-tr-none shadow-md shadow-black/10'
                          : 'bg-[#121215] border border-zinc-850 text-zinc-200 rounded-tl-none shadow-sm'
                        }`}
                    >
                      {isUser ? (
                        <p className='leading-relaxed font-medium'>{message.content}</p>
                      ) : (
                        <div className='prose prose-invert max-w-none text-white/90 leading-relaxed font-normal'>
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className='mb-3 last:mb-0'>{children}</p>,
                              ul: ({ children }) => <ul className='mb-3 list-disc pl-5 space-y-1'>{children}</ul>,
                              ol: ({ children }) => <ol className='mb-3 list-decimal pl-5 space-y-1'>{children}</ol>,
                              code: ({ children }) => <code className='rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs text-zinc-300'>{children}</code>,
                              pre: ({ children }) => <pre className='mb-3 overflow-x-auto rounded-xl bg-[#09090b] p-4 border border-zinc-800 font-mono text-sm leading-normal'>{children}</pre>,
                              table: ({ children }) => <table className='mb-3 border-collapse w-full border border-white/10'>{children}</table>,
                              th: ({ children }) => <th className='border border-white/10 px-3 py-1.5 bg-white/5 font-semibold text-left'>{children}</th>,
                              td: ({ children }) => <td className='border border-white/10 px-3 py-1.5'>{children}</td>,
                            }}
                            remarkPlugins={[remarkGfm]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Premium Search Bar Panel */}
          <footer className='w-full absolute bottom-4 left-0 right-0 px-4 z-10 shrink-0'>
            <div className='max-w-3xl mx-auto'>
              <form onSubmit={handleSubmitMessage} className='relative flex flex-col w-full rounded-2xl bg-[#121215] border border-zinc-800 p-2.5 shadow-2xl transition duration-300 focus-within:border-zinc-700 focus-within:ring-2 focus-within:ring-zinc-800/10'>

                {/* Search Bar Input Row */}
                <div className='flex items-center gap-3 w-full px-2'>
                  <svg className='w-5 h-5 text-white/35 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                  <input
                    type='text'
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder='Ask anything...'
                    className='w-full bg-transparent border-none outline-none text-white text-base py-2 placeholder:text-white/35 focus:ring-0 focus:outline-none'
                  />

                  {/* Premium Send Button */}
                  <button
                    type='submit'
                    disabled={!chatInput.trim()}
                    className='rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 p-2.5 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:scale-100'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 10l7-7m0 0l7 7m-7-7v18' />
                    </svg>
                  </button>
                </div>

              </form>
            </div>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard