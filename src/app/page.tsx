'use client'

import { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import 'leaflet/dist/leaflet.css'
import type { Map, LayerGroup } from 'leaflet'

const inter = Inter({ subsets: ['latin'] })

// Leaflet 타입 정의
interface LeafletInstance {
  map: typeof import('leaflet')
}

let leaflet: LeafletInstance['map'] | null = null

// Leaflet 초기화 함수
async function initializeLeaflet() {
  if (typeof window !== 'undefined' && !leaflet) {
    const L = await import('leaflet')
    leaflet = L
    // any 타입을 명시적인 타입으로 변경
    const icon = L.Icon.Default.prototype as {
      _getIconUrl?: () => string;
    };
    delete icon._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }
  return leaflet
}

const sigunguData = {
  "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  "부산광역시": ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"],
  "대구광역시": ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"],
  "인천광역시": ["계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"],
  "광주광역시": ["광산구", "남구", "동구", "북구", "서구"],
  "대전광역시": ["대덕구", "동구", "서구", "유성구", "중구"],
  "울산광역시": ["남구", "동구", "북구", "중구", "울주군"],
  "세종특별자치시": ["세종시"],
  "경기도": ["고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시", "가평군", "양평군", "여주시", "연천군"],
  "강원도": ["강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"],
  "충청북도": ["제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군"],
  "충청남도": ["계룡시", "공주시", "논산시", "당진시", "보령시", "서산시", "아산시", "천안시", "금산군", "부여군", "서천군", "예산군", "청양군", "태안군", "홍성군"],
  "전라북도": ["군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"],
  "전라남도": ["광양시", "나주시", "목포시", "순천시", "여수시", "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군", "보성군", "신안군", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
  "경상북도": ["경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시", "영주시", "영천시", "포항시", "고령군", "군위군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"],
  "경상남도": ["거제시", "김해시", "밀양시", "사천시", "양산시", "진주시", "창원시", "통영시", "거거창군", "고성군", "남해군", "산청군", "의창군", "창녕군", "하동군", "함안군", "함양군", "합천군"],
  "제주특별자치도": ["제주시", "서귀포시"]
};

interface Library {
  lbrrySe: string;
  lbrryNm: string;
  weekdayOperOpenHhmm: string;
  weekdayOperColseHhmm: string;
  satOperOperOpenHhmm: string;
  satOperCloseHhmm: string;
  closeDay: string;
  rdnmadr: string;
  bookCo: number;
  pblictnCo: number;
  noneBookCo: number;
  seatCo: number;
  lonCo: number;
  lonDaycnt: number;
  operInstitutionNm: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [theme, setTheme] = useState('light')
  const [menuOpen, setMenuOpen] = useState(false)
  // const [filterOpen, setFilterOpen] = useState(false)
  const [view, setView] = useState('search')
  const [searchResults, setSearchResults] = useState<Library[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null)
  const [showModal, setShowModal] = useState(false)
  const mapRef = useRef<Map | null>(null)
  const markersRef = useRef<LayerGroup | null>(null)
  const detailMapRef = useRef<Map | null>(null)

  useEffect(() => {
    const initMap = async () => {
      const L = await initializeLeaflet()
      if (L && typeof window !== 'undefined' && !mapRef.current) {
        const map = L.map('map').setView([36.5, 127.5], 7)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)
        mapRef.current = map
        markersRef.current = L.layerGroup().addTo(map)
      }
    }
    initMap()
  }, [])

  /**
   * 검색 결과가 변경될 때마다 지도에 마커를 업데이트합니다.
   * 기존 마커를 모두 지우고, 새로운 검색 결과에 기반하여 각 도서관의 위치에 마커를 추가합니다.
   * 모든 마커의 위치를 포함하도록 지도의 뷰를 조정합니다.
   */
  useEffect(() => {
    const updateMarkers = async () => {
      const L = await initializeLeaflet()
      if (markersRef.current && searchResults.length > 0 && L) {
        markersRef.current.clearLayers()
        const bounds = L.latLngBounds([])

        searchResults.forEach((library) => {
          if (library.latitude && library.longitude) {
            const marker = L.marker([library.latitude, library.longitude])
              .bindPopup(`
                <div style="min-width: 200px;">
                  <h3 style="font-weight: bold; margin-bottom: 8px;">${library.lbrryNm}</h3>
                  <p style="font-size: 0.9em; margin-bottom: 4px;">📍 ${library.rdnmadr}</p>
                  <p style="font-size: 0.9em;">⏰ ${library.weekdayOperOpenHhmm} - ${library.weekdayOperColseHhmm}</p>
                </div>
              `)
            marker.addTo(markersRef.current!)
            bounds.extend([library.latitude, library.longitude])
          }
        })

        if (bounds.isValid()) {
          mapRef.current?.fitBounds(bounds, { padding: [50, 50] })
        }
      }
    }
    updateMarkers()
  }, [searchResults])

  useEffect(() => {
    const initDetailMap = async () => {
      const L = await initializeLeaflet()
      if (showModal && selectedLibrary && !detailMapRef.current && L) {
        setTimeout(() => {
          const detailMap = L.map('detail-map').setView(
            [selectedLibrary.latitude, selectedLibrary.longitude],
            15
          )
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(detailMap)
          L.marker([selectedLibrary.latitude, selectedLibrary.longitude]).addTo(detailMap)
          detailMapRef.current = detailMap
        }, 100)
      }
    }
    initDetailMap()

    if (!showModal && detailMapRef.current) {
      detailMapRef.current.remove() // 상세 지도 제거
      detailMapRef.current = null // 상세 지도 참조 제거
    }
  }, [showModal, selectedLibrary])

  const showLibraryDetail = (library: Library) => {
    setSelectedLibrary(library)
    setShowModal(true)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // const toggleFilters = () => {
  //   setFilterOpen(!filterOpen)
  // }

  const showSearch = () => {
    setView('search')
    setMenuOpen(false)
  }

  const showCommunity = () => {
    setView('community')
    setMenuOpen(false)
  }

  const showWritePost = () => {
    alert('글쓰기 기능은 준비중입니다.')
  }

  const searchLibraries = async () => {
    setLoading(true);
    try {
      const libraryName = (document.getElementById('libraryName') as HTMLInputElement)?.value;
      const sido = (document.getElementById('sido') as HTMLSelectElement)?.value;
      const sigungu = (document.getElementById('sigungu') as HTMLSelectElement)?.value;
      const operTime = (document.getElementById('operTime') as HTMLSelectElement)?.value;
      const satOperTime = (document.getElementById('satOperTime') as HTMLSelectElement)?.value;
      const closeDay = (document.getElementById('closeDay') as HTMLSelectElement)?.value;
      
      const params = new URLSearchParams({
        ...(libraryName && { libraryName }),
        ...(sido && { sido }),
        ...(sigungu && { sigungu }),
        ...(operTime && { operTime }),
        ...(satOperTime && { satOperTime })
      });

      const response = await fetch(`/api/library?${params}`);
      const data = await response.json();
      console.log('API 응답 데이터어:', data);
      
      if (data.response?.body?.items) {
        const filteredResults = data.response.body.items.filter((library: Library) => {
          if (operTime && library.weekdayOperColseHhmm < operTime) return false;
          if (satOperTime && library.satOperCloseHhmm < satOperTime) return false;
          if (closeDay && !library.closeDay.includes(closeDay)) return false;
          return true;
        });
        
        console.log('필터링된 결과:', filteredResults);
        setSearchResults(filteredResults);
      } else {
        console.log('검색 결과 없음');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('도서관 데이터 조회 중 오류 발생:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen ${inter.className}`}>
      <style jsx global>{`
        :root {
          --bg-color: #f1f8e9;
          --text-color: #33691e;
          --header-bg: #8bc34a;
          --card-bg: rgba(255, 255, 255, 0.95);
          --border-color: #dcedc8;
          --menu-bg: rgba(255, 255, 255, 0.98);
          --shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
          --menu-icon-color: #33691e;
        }

        [data-theme="dark"] {
          --bg-color: #1a1a1a;
          --text-color: #b4d774;
          --header-bg: #2c3e50;
          --card-bg: rgba(40, 40, 40, 0.95);
          --border-color: #2c3e50;
          --menu-bg: rgba(30, 30, 30, 0.98);
          --menu-icon-color: #ffffff;
        }

        body {
          background-color: var(--bg-color);
          color: var(--text-color);
          max-width: 480px;
          margin: 0 auto;
          min-height: 100vh;
          padding: 0;
        }

        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          // background-color: var(--header-bg);
          z-index: 40;
          display: flex;
          justify-content: center;
        }

        .header {
          width: 100%;
          max-width: 480px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          // border-radius: 0 0 20px 20px;
          backdrop-filter: blur(10px);
          background-color: var(--header-bg);
        }

        .menu-button {
          color: white;
          font-size: 24px;
          padding: 8px;
          transition: transform 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
        }

        .menu-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .menu-button:active {
          transform: scale(0.95);
        }

        input, select, button {
          border-radius: 15px !important;
          transition: var(--transition);
        }

        button:active {
          transform: scale(0.98);
        }

        .library-card {
          border-radius: 20px !important;
          transition: var(--transition);
          box-shadow: var(--shadow);
        }

        .library-card:active {
          transform: scale(0.98);
        }

        .status-badge {
          border-radius: 20px !important;
          padding: 6px 12px;
        }

        .modal-content {
          border-radius: 25px !important;
          overflow: hidden;
        }

        .leaflet-container {
          width: 100%;
          height: 100%;
          z-index: 1;
          border-radius: 20px !important;
          overflow: hidden;
        }

        #map, #detail-map {
          width: 100%;
          height: 300px;
          z-index: 1;
          background-color: #f8f9fa;
          border-radius: 20px !important;
          overflow: hidden;
        }

        .map-container {
          border-radius: 20px !important;
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .filter-section {
          background: var(--card-bg);
          border-radius: 20px !important;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: var(--shadow);
          backdrop-filter: blur(10px);
        }
      `}</style>

      {/* 헤더 영역 */}
      <div className="header-container">
        <div className="header">
          <h1 className="text-xl font-semibold text-white">도서관 찾기</h1>
          <button 
            className="menu-button"
            onClick={toggleMenu}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            ☰
          </button>
        </div>
      </div>

      {/* 메뉴 오버레이 */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={toggleMenu} />
      )}

      {/* 메뉴 패널 */}
      <div className={`fixed top-0 right-0 w-[280px] h-full bg-[var(--menu-bg)] z-50 transition-transform duration-300 ease-in-out transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} rounded-l-[25px] backdrop-blur-md`}>
        <div className="flex justify-end p-4">
          <button 
            className="w-10 h-10 flex items-center justify-center text-[var(--text-color)] hover:bg-[var(--border-color)] rounded-full transition-colors"
            onClick={toggleMenu}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>
        <div className="px-4">
          <div className="p-4 hover:bg-[var(--border-color)] rounded-[15px] cursor-pointer transition-colors" onClick={showSearch}>
            <span className="mr-2">🔍</span> 도서관 검색
          </div>
          <div className="p-4 hover:bg-[var(--border-color)] rounded-[15px] cursor-pointer transition-colors" onClick={showCommunity}>
            <span className="mr-2">💬</span> 커뮤니티
          </div>
          <div className="p-4 hover:bg-[var(--border-color)] rounded-[15px] cursor-pointer transition-colors" onClick={toggleTheme}>
            <span className="mr-2">🌓</span> 다크모드
          </div>
        </div>
      </div>

      {view === 'search' && (
        <div className="pt-20 pb-6">
          <div className="filter-section">
            <div className="filter-group space-y-4">
              <input
                type="text"
                id="libraryName"
                placeholder="도서관 이름 검색"
                className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] text-[var(--text-color)]"
              />
              <select 
                id="sido" 
                className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] text-[var(--text-color)]"
                onChange={(e) => {
                  const sigunguSelect = document.getElementById('sigungu') as HTMLSelectElement;
                  sigunguSelect.innerHTML = '<option value="">시/군/구 선택</option>';
                  
                  const selectedSido = e.target.value;
                  const sigunguList = sigunguData[selectedSido as keyof typeof sigunguData] || [];
                  
                  sigunguList.forEach(sigungu => {
                    const option = document.createElement('option');
                    option.value = sigungu;
                    option.textContent = sigungu;
                    sigunguSelect.appendChild(option);
                  });
                }}
              >
                <option value="">시/도 선택</option>
                <option value="서울특별시">서울특별시</option>
                <option value="부산광역시">부산광역시</option>
                <option value="대구광역시">대구광역시</option>
                <option value="인천광역시">인천광역시</option>
                <option value="광주광역시">광주광역시</option>
                <option value="대전광역시">대전광역시</option>
                <option value="울산광역시">울산광역시</option>
                <option value="세종특별자치시">세종특별자치시</option>
                <option value="경기도">경기도</option>
                <option value="강원도">강원도</option>
                <option value="충청북도">충청북도</option>
                <option value="충청남도">충청남도</option>
                <option value="전라북도">전라북도</option>
                <option value="전라남도">전라남도</option>
                <option value="경상북도">경상북도</option>
                <option value="경상남도">경상남도</option>
                <option value="제주시특별자치도">제주시특별자치도</option>
              </select>
              <select 
                id="sigungu" 
                className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] text-[var(--text-color)]"
              >
                <option value="">시/군/구 선택</option>
              </select>
              <select 
                id="operTime"
                className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] text-[var(--text-color)]"
              >
                <option value="">평일 운영시간 선택</option>
                <option value="13:00">13시까지</option>
                <option value="14:00">14시까지</option>
                <option value="15:00">15시까지</option>
                <option value="16:00">16시까지</option>
                <option value="17:00">17시까지</option>
                <option value="18:00">18시까지</option>
                <option value="19:00">19시까지</option>
                <option value="20:00">20시까지</option>
                <option value="21:00">21시까지</option>
                <option value="22:00">22시까지</option>
                <option value="23:00">23시까지</option>
              </select>
              <select 
                id="satOperTime"
                className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] text-[var(--text-color)]"
              >
                <option value="">토요일 운영시간 선택</option>
                <option value="13:00">13시까지</option>
                <option value="14:00">14시까지</option>
                <option value="15:00">15시까지</option>
                <option value="16:00">16시까지</option>
                <option value="17:00">17시까지</option>
                <option value="18:00">18시까지</option>
                <option value="19:00">19시까지</option>
                <option value="20:00">20시까지</option>
                <option value="21:00">21시까지</option>
                <option value="22:00">22시까지</option>
                <option value="23:00">23시까지</option>
              </select>
              <select 
                id="closeDay"
                className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] text-[var(--text-color)]"
              >
                <option value="">휴관일 선택</option>
                <option value="월">월요일</option>
                <option value="화">화요일</option>
                <option value="수">수요일</option>
                <option value="목">목요일</option>
                <option value="금">금요일</option>
                <option value="토">토요일</option>
                <option value="일">일요일</option>
              </select>
              <button
                className="w-full p-4 bg-[var(--header-bg)] text-white rounded-lg font-medium"
                onClick={searchLibraries}
              >
                도서관 검색하기
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="map-container mb-4">
              <div id="map" />
            </div>
            {loading ? (
              <div className="text-center p-4 bg-[var(--card-bg)] rounded-[20px] shadow-md">검색중...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((library, index) => (
                  <div
                    key={index}
                    className="library-card p-4"
                    onClick={() => showLibraryDetail(library)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{library.lbrrySe}</span>
                      <h2 className="text-lg font-semibold">{library.lbrryNm}</h2>
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">운영중</span>
                    </div>
                    <div className="bg-[var(--bg-color)] rounded-lg p-2 mb-2">
                      <p>⏰ 평일: {library.weekdayOperOpenHhmm} - {library.weekdayOperColseHhmm}</p>
                      <p>📅 토요일: {library.satOperOperOpenHhmm} - {library.satOperCloseHhmm}</p>
                      <p>🚫 휴관일: {library.closeDay}</p>
                    </div>
                    <p>📍 {library.rdnmadr}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-[var(--card-bg)] rounded-[20px] shadow-md">검색 결과가 없습니다</div>
            )}
          </div>
        </div>
      )}

      {showModal && selectedLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="modal-content bg-white mx-4 my-8 max-w-2xl md:mx-auto">
            <div className="bg-[var(--header-bg)] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedLibrary.lbrryNm}</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">&times;</button>
            </div>
            <div id="detail-map" />
            <div className="p-6 space-y-4">
              <div className="bg-[var(--bg-color)] rounded-lg p-3">
                <p>⏰ 평일: {selectedLibrary.weekdayOperOpenHhmm} - {selectedLibrary.weekdayOperColseHhmm}</p>
                <p>📅 토요일: {selectedLibrary.satOperOperOpenHhmm} - {selectedLibrary.satOperCloseHhmm}</p>
                <p>🚫 휴관일: {selectedLibrary.closeDay}</p>
              </div>
              <p>📍 {selectedLibrary.rdnmadr}</p>
              <p>📚 총 장서: {selectedLibrary.bookCo.toLocaleString()}권</p>
              <p>📰 연속간행물: {selectedLibrary.pblictnCo.toLocaleString()}종</p>
              <p>💿 비도서자료: {selectedLibrary.noneBookCo.toLocaleString()}점</p>
              <p>💺 열람좌석: {selectedLibrary.seatCo.toLocaleString()}석</p>
              <p>🎫 대출권수: {selectedLibrary.lonCo}권 / {selectedLibrary.lonDaycnt}일</p>
              <p>🏢 운영기관: {selectedLibrary.operInstitutionNm}</p>
              <p>📞 {selectedLibrary.phoneNumber}</p>
            </div>
          </div>
        </div>
      )}

      {view === 'community' && (
        <div className="pt-16 px-4">
          <div className="bg-[var(--card-bg)] rounded-lg p-4 shadow-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">우리 동네 도서관 신간 들어왔어요!</h2>
              <span className="text-sm text-[var(--text-color)] opacity-70">작성자 • 5분 전</span>
            </div>
            <p className="mb-4">오늘 도서관에 새로운 책들이 들어왔네요. 특히 IT 섹션이 많이 업데이트되었어요.</p>
            <div className="flex gap-4 text-sm text-[var(--text-color)] opacity-70">
              <span>👍 5</span>
              <span>💬 3</span>
            </div>
          </div>
          <button
            className="fixed bottom-5 right-5 w-14 h-14 bg-[var(--header-bg)] text-white rounded-full text-2xl shadow-lg flex items-center justify-center"
            onClick={showWritePost}
          >
            ✏️
          </button>
        </div>
      )}
    </main>
  )
}