'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, Search, Clock, Calendar, Info, Facebook, Twitter, Instagram, Menu } from 'lucide-react'

const libraries = [
  { id: 1, name: '중앙도서관', weekdayOpen: '09:00', weekdayClose: '22:00', weekendOpen: '09:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['일'], address: '서울시 중구 세종대로 110', phone: '02-1234-5678' },
  { id: 2, name: '디지털도서관', weekdayOpen: '09:00', weekdayClose: '21:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['월'], address: '서울시 강남구 테헤란로 152', phone: '02-2345-6789' },
  { id: 3, name: '어린이도서관', weekdayOpen: '10:00', weekdayClose: '19:00', weekendOpen: '10:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['일', '월'], address: '서울시 송파구 올림픽로 300', phone: '02-3456-7890' },
  { id: 4, name: '과학도서관', weekdayOpen: '08:30', weekdayClose: '20:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '09:00', holidayClose: '18:00', closedDays: ['토', '일'], address: '대전시 유성구 대학로 291', phone: '042-1234-5678' },
  { id: 5, name: '역사도서관', weekdayOpen: '09:00', weekdayClose: '18:00', weekendOpen: '10:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['월', '화'], address: '경주시 불국로 26', phone: '054-2345-6789' },
  { id: 6, name: '대학도서관', weekdayOpen: '08:00', weekdayClose: '23:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '09:00', holidayClose: '18:00', closedDays: [], address: '서울시 관악구 관악로 1', phone: '02-3456-7890' },
  { id: 7, name: '예술도서관', weekdayOpen: '10:00', weekdayClose: '20:00', weekendOpen: '10:00', weekendClose: '19:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['월'], address: '서울시 종로구 삼청로 30', phone: '02-4567-8901' },
  { id: 8, name: '법률도서관', weekdayOpen: '09:00', weekdayClose: '21:00', weekendOpen: '09:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['일'], address: '서울시 서초구 서초대로 219', phone: '02-5678-9012' },
  { id: 9, name: '음악도서관', weekdayOpen: '10:00', weekdayClose: '20:00', weekendOpen: '10:00', weekendClose: '18:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['월', '화'], address: '서울시 서대문구 연세로 50', phone: '02-6789-0123' },
  { id: 10, name: '의학도서관', weekdayOpen: '08:30', weekdayClose: '22:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '09:00', holidayClose: '18:00', closedDays: ['일'], address: '서울시 종로구 대학로 101', phone: '02-7890-1234' },
  { id: 11, name: '환경도서관', weekdayOpen: '09:00', weekdayClose: '18:00', weekendOpen: '10:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['토', '일'], address: '세종시 도움6로 11', phone: '044-1234-5678' },
  { id: 12, name: '청소년도서관', weekdayOpen: '09:00', weekdayClose: '21:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['월'], address: '부산시 해운대구 센텀중앙로 79', phone: '051-2345-6789' },
  { id: 13, name: '영어도서관', weekdayOpen: '10:00', weekdayClose: '20:00', weekendOpen: '10:00', weekendClose: '19:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['일', '월'], address: '인천시 연수구 컨벤시아대로 153', phone: '032-3456-7890' },
  { id: 14, name: '기술도서관', weekdayOpen: '08:30', weekdayClose: '21:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '09:00', holidayClose: '18:00', closedDays: ['토', '일'], address: '대전시 유성구 정로 217', phone: '042-4567-8901' },
  { id: 15, name: '여행도서관', weekdayOpen: '09:00', weekdayClose: '18:00', weekendOpen: '10:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['월', '화'], address: '제주시 첨단로 242', phone: '064-5678-9012' },
  { id: 16, name: '요리도서관', weekdayOpen: '10:00', weekdayClose: '20:00', weekendOpen: '10:00', weekendClose: '19:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['월'], address: '서울시 중구 을지로 311', phone: '02-6789-0123' },
  { id: 17, name: '경제도서관', weekdayOpen: '09:00', weekdayClose: '21:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['일'], address: '서울시 영등포구 여의대로 38', phone: '02-7890-1234' },
  { id: 18, name: '철학도서관', weekdayOpen: '09:00', weekdayClose: '20:00', weekendOpen: '10:00', weekendClose: '17:00', holidayOpen: '10:00', holidayClose: '17:00', closedDays: ['월', '화'], address: '서울시 성북구 성북로 52', phone: '02-8901-2345' },
  { id: 19, name: '건축도서관', weekdayOpen: '08:30', weekdayClose: '22:00', weekendOpen: '09:00', weekendClose: '18:00', holidayOpen: '09:00', holidayClose: '18:00', closedDays: ['일'], address: '서울시 종로구 율곡로 190', phone: '02-9012-3456' },
  { id: 20, name: '영화도서관', weekdayOpen: '10:00', weekdayClose: '21:00', weekendOpen: '10:00', weekendClose: '19:00', holidayOpen: '10:00', holidayClose: '18:00', closedDays: ['월'], address: '부산시 해운대구 수영강변대로 120', phone: '051-0123-4567' },
]

const days = ['월', '화', '수', '목', '금', '토', '일']

type Library = typeof libraries[0]  // 라이브러리 타입 정의

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

  useEffect(() => {
    const filtered = libraries.filter(library => {
      const nameMatch = library.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // 시간을 숫자로 변환하는 헬퍼 함수
      const timeToNumber = (time: string) => parseInt(time.replace(':', ''))
      
      // 평일 시간 비교 로직 수정
      const weekdayOpenMatch = !filters.weekdayOpen || 
        timeToNumber(library.weekdayOpen) >= timeToNumber(filters.weekdayOpen)
      const weekdayCloseMatch = !filters.weekdayClose || 
        timeToNumber(library.weekdayClose) <= timeToNumber(filters.weekdayClose)
      
      // 주말 시간 비교 로직 수정
      const weekendOpenMatch = !filters.weekendOpen || 
        timeToNumber(library.weekendOpen) >= timeToNumber(filters.weekendOpen)
      const weekendCloseMatch = !filters.weekendClose || 
        timeToNumber(library.weekendClose) <= timeToNumber(filters.weekendClose)
      
      // 공휴일 시간 비교 로직 수정
      const holidayOpenMatch = !filters.holidayOpen || 
        timeToNumber(library.holidayOpen) >= timeToNumber(filters.holidayOpen)
      const holidayCloseMatch = !filters.holidayClose || 
        timeToNumber(library.holidayClose) <= timeToNumber(filters.holidayClose)
      
      // 휴관일 비교 로직은 이미 잘 작동하고 있습니다
      const closedDaysMatch = filters.closedDays.length === 0 || 
        filters.closedDays.every(day => library.closedDays.includes(day))

      return nameMatch && weekdayOpenMatch && weekdayCloseMatch && 
             weekendOpenMatch && weekendCloseMatch && 
             holidayOpenMatch && holidayCloseMatch && closedDaysMatch
    })
    setFilteredLibraries(filtered)
  }, [searchTerm, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'closedDays') {
      const input = e.target as HTMLInputElement
      setFilters(prev => ({
        ...prev,
        closedDays: input.checked
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F5C8] text-[#2B2B2B]">
      <div className="max-w-[768px] mx-auto w-full shadow-lg">
        <header className="bg-[#90B77D] text-white p-4">
          <div className="flex justify-between items-center">
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

        <main className="flex-grow p-4 bg-white">
          <div>
            <div className="mb-4 flex flex-col gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto bg-[#90B77D] text-white px-4 py-2 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#42855B]"
              >
                필터 {showFilters ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
              </button>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="도서관 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-0 py-2 rounded-full border-2 border-[#90B77D] focus:outline-none focus:border-[#42855B]"
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
                      <select name="weekdayOpen" value={filters.weekdayOpen} onChange={handleFilterChange} className="border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                        <option value="">시작</option>
                        {generateTimeOptions()}
                      </select>
                      <select name="weekdayClose" value={filters.weekdayClose} onChange={handleFilterChange} className="border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                        <option value="">종료</option>
                        {generateTimeOptions()}
                      </select>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center"><Clock className="mr-2" /> 주말 운영시간</h3>
                    <div className="flex space-x-2">
                      <select name="weekendOpen" value={filters.weekendOpen} onChange={handleFilterChange} className="border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                        <option value="">시작</option>
                        {generateTimeOptions()}
                      </select>
                      <select name="weekendClose" value={filters.weekendClose} onChange={handleFilterChange} className="border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                        <option value="">종료</option>
                        {generateTimeOptions()}
                      </select>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center"><Clock className="mr-2" /> 공휴일 운영시간</h3>
                    <div className="flex space-x-2">
                      <select name="holidayOpen" value={filters.holidayOpen} onChange={handleFilterChange} className="border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
                        <option value="">시작</option>
                        {generateTimeOptions()}
                      </select>
                      <select name="holidayClose" value={filters.holidayClose} onChange={handleFilterChange} className="border rounded-full px-3 py-1 focus:outline-none focus:border-[#90B77D]">
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
                <button onClick={resetFilters} className="bg-[#90B77D] text-white px-4 py-2 rounded-full hover:bg-[#42855B] transition-colors duration-300">
                  필터 초기화
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </main>

        <footer className="bg-[#42855B] text-white p-4">
          <div className="flex flex-col items-center">
            <div className="mb-4">
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
    </div>
  )
}