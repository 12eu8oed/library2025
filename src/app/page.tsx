'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, Search, Clock, Calendar, Info, Facebook, Twitter, Instagram, Menu, MessageCircle, Send, Heart } from 'lucide-react'

type Post = {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: { id: number; author: string; content: string; }[];
}

type Library = typeof libraries[0]  // 라이브러리 타입 추출

const libraries = [
  { id: 1, name: '중앙도서관', weekdayOpen: '09:00', weekdayClose: '22:00', weekendOpen: '09:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['일'], address: '서울시 중구 세종대로 110', phone: '02-1234-5678' },
  { id: 2, name: '디지털도서관', weekdayOpen: '09:00', weekdayClose: '21:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['월'], address: '서울시 강남구 테헤란로 152', phone: '02-2345-6789' },
  { id: 3, name: '어린이도서관', weekdayOpen: '10:00', weekdayClose: '19:00', weekendOpen: '10:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['일', '월'], address: '서울시 송파구 올림픽로 300', phone: '02-3456-7890' },
  { id: 4, name: '과학도서관', weekdayOpen: '08:30', weekdayClose: '20:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '09:00', holidayClose: '18:00', closedDays: ['토', '일'], address: '대전시 유성구 대학로 291', phone: '042-1234-5678' },
  { id: 5, name: '역사도서관', weekdayOpen: '09:00', weekdayClose: '18:00', weekendOpen: '10:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['월', '화'], address: '경주시 불국로 26', phone: '054-2345-6789' },
]

const days = ['월', '화', '수', '목', '금', '토', '일']

export default function Component() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{
    weekdayOpen: string;
    weekdayClose: string;
    weekendOpen: string;
    weekendClose: string;
    holidayOpen: string;
    holidayClose: string;
    closedDays: string[];
  }>({
    weekdayOpen: '',
    weekdayClose: '',
    weekendOpen: '',
    weekendClose: '',
    holidayOpen: '',
    holidayClose: '',
    closedDays: [],
  })
  const [filteredLibraries, setFilteredLibraries] = useState(libraries)
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeView, setActiveView] = useState('home')
  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, author: '김도서', content: '새로 개관한 디지털도서관 정말 좋네요!', likes: 5, comments: [
      { id: 1, author: '이독서', content: '저도 그렇게 생각해요! 시설이 정말 좋더라구요.' },
      { id: 2, author: '박책읽기', content: '디지털 자료가 특히 잘 구비되어 있어서 좋았어요.' }
    ]},
    { id: 2, author: '이독서', content: '주말 독서모임 함께하실 분 계신가요?', likes: 3, comments: [
      { id: 1, author: '최문학', content: '저도 관심 있어요! 어떤 책을 읽으실 예정인가요?' }
    ]},
  ])
  const [newPost, setNewPost] = useState('')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState('')
  const [newCommentAuthor, setNewCommentAuthor] = useState('') // Added new state

  useEffect(() => {
    const filtered = libraries.filter(library => {
      const nameMatch = library.name.toLowerCase().includes(searchTerm.toLowerCase())
      const weekdayOpenMatch = !filters.weekdayOpen || library.weekdayOpen >= filters.weekdayOpen
      const weekdayCloseMatch = !filters.weekdayClose || library.weekdayClose <= filters.weekdayClose
      const weekendOpenMatch = !filters.weekendOpen || library.weekendOpen >= filters.weekendOpen
      const weekendCloseMatch = !filters.weekendClose || library.weekendClose <= filters.weekendClose
      const holidayOpenMatch = !filters.holidayOpen || library.holidayOpen >= filters.holidayOpen
      const holidayCloseMatch = !filters.holidayClose || library.holidayClose <= filters.holidayClose
      const closedDaysMatch = filters.closedDays.length === 0 || filters.closedDays.every(day => library.closedDays.includes(day))

      return nameMatch && weekdayOpenMatch && weekdayCloseMatch && weekendOpenMatch && weekendCloseMatch && holidayOpenMatch && holidayCloseMatch && closedDaysMatch
    })
    setFilteredLibraries(filtered)
  }, [searchTerm, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (e.target.type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        closedDays: checked
          ? [...prev.closedDays, value]
          : prev.closedDays.filter(day => day !== value)
      }))
    } else {
      setFilters(prev => ({ ...prev, [name]: value }))
    }
  }

  const resetFilters = () => {
    setFilters({
      weekdayOpen: '',
      weekdayClose: '',
      weekendOpen: '',
      weekendClose: '',
      holidayOpen: '',
      holidayClose: '',
      closedDays: [],
    })
    setSearchTerm('')
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        options.push(<option key={time} value={time}>{time}</option>)
      }
    }
    return options
  }

  const handleNewPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPost.trim()) {
      setCommunityPosts([
        { id: Date.now(), author: '익명', content: newPost, likes: 0, comments: [] },
        ...communityPosts
      ])
      setNewPost('')
    }
  }

  const handleLike = (postId: number) => {
    setCommunityPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    )
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prevPost => prevPost ? { ...prevPost, likes: prevPost.likes + 1 } : null)
    }
  }

  const handleNewComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newComment.trim() && selectedPost) {
      const newCommentObj = { id: Date.now(), author: newCommentAuthor || '익명', content: newComment }
      setCommunityPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === selectedPost.id
            ? {
                ...post,
                comments: [...post.comments, newCommentObj]
              }
            : post
        )
      )
      setSelectedPost(prevPost => prevPost ? {
        ...prevPost,
        comments: [...prevPost.comments, newCommentObj]
      } : null)
      setNewComment('')
      setNewCommentAuthor('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F5C8] text-[#2B2B2B]">
      <header className="bg-[#90B77D] text-white p-4">
        <div className="max-w-[768px] mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-2xl font-bold">도서관 운영시간 필터</h1>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50 relative bg-[#42855B] p-2 rounded-full">
            {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>
      <nav className={`fixed right-0 top-0 h-full w-64 bg-[#42855B] z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button 
          onClick={() => setIsMenuOpen(false)} 
          className="absolute top-4 right-4 bg-[#90B77D] p-2 rounded-full"
        >
          <X size={24} className="text-white" />
        </button>
        <div className="flex flex-col space-y-4 p-4 mt-20">
          <button onClick={() => { setActiveView('home'); setIsMenuOpen(false); }} className="bg-[#90B77D] hover:bg-[#2D5D3D] text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            홈
          </button>
          <button onClick={() => { setActiveView('libraries'); setIsMenuOpen(false); }} className="bg-[#90B77D] hover:bg-[#2D5D3D] text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            도서관 목록
          </button>
          <button onClick={() => { setActiveView('info'); setIsMenuOpen(false); }} className="bg-[#90B77D] hover:bg-[#2D5D3D] text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            이용안내
          </button>
          <button onClick={() => { setActiveView('community'); setIsMenuOpen(false); }} className="bg-[#90B77D] hover:bg-[#2D5D3D] text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            커뮤니티
          </button>
        </div>
      </nav>

      <main className="flex-grow p-4">
        <div className="max-w-[768px] mx-auto">
          {activeView === 'home' && (
            <>
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full sm:w-auto bg-[#90B77D] text-white px-4 py-2 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#42855B]"
                >
                  필터 {showFilters ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                </button>
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="도서관 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full border-2 border-[#90B77D] focus:outline-none focus:border-[#42855B]"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90B77D]" />
                </div>
              </div>

              {showFilters && (
                <div className="bg-white p-4 rounded-3xl shadow-lg mb-6 transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center"><Clock className="mr-2" /> 평일 운영시간</h3>
                      <div className="flex space-x-2">
                        <select name="weekdayOpen" value={filters.weekdayOpen} onChange={handleFilterChange} className="w-full border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                          <option value="">시작</option>
                          {generateTimeOptions()}
                        </select>
                        <select name="weekdayClose" value={filters.weekdayClose} onChange={handleFilterChange} className="w-full border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                          <option value="">종료</option>
                          {generateTimeOptions()}
                        </select>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center"><Clock className="mr-2" /> 주말 운영시간</h3>
                      <div className="flex space-x-2">
                        <select name="weekendOpen" value={filters.weekendOpen} onChange={handleFilterChange} className="w-full border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                          <option value="">시작</option>
                          {generateTimeOptions()}
                        </select>
                        <select name="weekendClose" value={filters.weekendClose} onChange={handleFilterChange} className="w-full border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                          <option value="">종료</option>
                          {generateTimeOptions()}
                        </select>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center"><Clock className="mr-2" /> 공휴일 운영시간</h3>
                      <div className="flex space-x-2">
                        <select name="holidayOpen" value={filters.holidayOpen} onChange={handleFilterChange} className="w-full border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                          <option value="">시작</option>
                          {generateTimeOptions()}
                        </select>
                        <select name="holidayClose" value={filters.holidayClose} onChange={handleFilterChange} className="w-full border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                          <option value="">종료</option>
                          {generateTimeOptions()}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 flex items-center"><Calendar className="mr-2" /> 휴관일</h3>
                    <div className="flex flex-wrap gap-2">
                      {days.map(day => (
                        <label key={day} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={day}
                            checked={filters.closedDays.includes(day)}
                            onChange={handleFilterChange}
                            className="rounded text-[#90B77D] focus:ring-[#42855B]"
                          />
                          <span>{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button onClick={resetFilters} className="w-full sm:w-auto bg-[#90B77D] text-white px-4 py-2 rounded-full hover:bg-[#42855B] transition-colors duration-300">
                    필터 초기화
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLibraries.map(library => (
                  <div key={library.id} className="bg-white p-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedLibrary(library)}>
                    <h2 className="text-xl font-bold mb-2 text-[#42855B]">{library.name}</h2>
                    <p className="text-sm mb-1"><strong>평일:</strong> {library.weekdayOpen} - {library.weekdayClose}</p>
                    <p className="text-sm mb-1"><strong>주말:</strong> {library.weekendOpen} - {library.weekendClose}</p>
                    <p className="text-sm mb-1"><strong>공휴일:</strong> {library.holidayOpen} - {library.holidayClose}</p>
                    <p className="text-sm"><strong>휴관일:</strong> {library.closedDays.join(', ') || '없음'}</p>
                  </div>
                ))}
              </div>

              {filteredLibraries.length === 0 && (
                <p className="text-center mt-8 text-lg">검색 결과가 없습니다.</p>
              )}

              {selectedLibrary && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white p-6 rounded-3xl max-w-md w-full">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-[#42855B]">{selectedLibrary.name}</h2>
                      <button onClick={() => setSelectedLibrary(null)} className="text-[#90B77D] hover:text-[#42855B]">
                        <X />
                      </button>
                    </div>
                    <p className="mb-2"><strong>주소:</strong> {selectedLibrary.address}</p>
                    <p className="mb-2"><strong>전화번호:</strong> {selectedLibrary.phone}</p>
                    <p className="mb-2"><strong>평일:</strong> {selectedLibrary.weekdayOpen} - {selectedLibrary.weekdayClose}</p>
                    <p className="mb-2"><strong>주말:</strong> {selectedLibrary.weekendOpen} - {selectedLibrary.weekendClose}</p>
                    <p className="mb-2"><strong>공휴일:</strong> {selectedLibrary.holidayOpen} - {selectedLibrary.holidayClose}</p>
                    <p><strong>휴관일:</strong> {selectedLibrary.closedDays.join(', ') || '없음'}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeView === 'community' && (
            <div className="bg-white p-4 rounded-3xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-[#42855B]">커뮤니티</h2>
              <form onSubmit={handleNewPost} className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="새 게시글 작성..."
                    className="flex-grow p-2 border rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#90B77D]"
                  />
                  <button type="submit" className="bg-[#90B77D] text-white p-2 rounded-r-full hover:bg-[#42855B]">
                    <Send size={24} />
                  </button>
                </div>
              </form>
              {communityPosts.map(post => (
                <div key={post.id} className="bg-[#F2F5C8] p-4 rounded-2xl mb-4 cursor-pointer" onClick={() => setSelectedPost(post)}>
                  <p className="font-bold">{post.author}</p>
                  <p className="mt-2">{post.content}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <button className="flex items-center mr-4" onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}>
                      <Heart size={16} className="mr-1" fill={post.likes > 0 ? 'currentColor' : 'none'} />
                      {post.likes}
                    </button>
                    <div className="flex items-center">
                      <MessageCircle size={16} className="mr-1" />
                      {post.comments.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-[#42855B]">{selectedPost.author}의 게시글</h2>
              <button onClick={() => setSelectedPost(null)} className="text-[#90B77D] hover:text-[#42855B]">
                <X />
              </button>
            </div>
            <p className="mb-4">{selectedPost.content}</p>
            <div className="flex items-center mb-4">
              <button className="flex items-center mr-4" onClick={() => handleLike(selectedPost.id)}>
                <Heart size={16} className="mr-1" fill={selectedPost.likes > 0 ? 'currentColor' : 'none'} />
                {selectedPost.likes}
              </button>
              <div className="flex items-center">
                <MessageCircle size={16} className="mr-1" />
                {selectedPost.comments.length}
              </div>
            </div>
            <h3 className="font-bold mb-2">댓글</h3>
            {selectedPost.comments.map(comment => (
              <div key={comment.id} className="bg-[#F2F5C8] p-2 rounded-xl mb-2">
                <p className="font-bold text-sm">{comment.author}</p>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
            <form onSubmit={handleNewComment} className="mt-4">
              <div className="flex flex-col space-y-2"> {/* Updated comment form */}
                <input
                  type="text"
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  placeholder="닉네임 (선택사항)"
                  className="p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#90B77D]"
                />
                <div className="flex">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글 작성..."
                    className="flex-grow p-2 border rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#90B77D]"
                  />
                  <button type="submit" className="bg-[#90B77D] text-white p-2 rounded-r-full hover:bg-[#42855B]">
                    <Send size={24} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#42855B] text-white p-4">
        <div className="max-w-[768px] mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 도서관 운영시간 필터. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#90B77D] transition-colors duration-300">
              <Facebook />
            </a>
            <a href="#" className="hover:text-[#90B77D] transition-colors duration-300">
              <Twitter />
            </a>
            <a href="#" className="hover:text-[#90B77D] transition-colors duration-300">
              <Instagram />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}