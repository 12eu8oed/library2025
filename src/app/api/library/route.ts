import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const libraryName = searchParams.get('libraryName');
    const sido = searchParams.get('sido');
    const sigungu = searchParams.get('sigungu');
    const operTime = searchParams.get('operTime');
    const satOperTime = searchParams.get('satOperTime');
    
    const serviceKey = process.env.NEXT_PUBLIC_LIBRARY_API_KEY;
    if (!serviceKey) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    let url = `http://api.data.go.kr/openapi/tn_pubr_public_lbrry_api`;
    url += `?serviceKey=${encodeURIComponent(serviceKey)}`;
    url += `&pageNo=0&numOfRows=1000&type=json`;
    
    if (libraryName) url += `&lbrryNm=${encodeURIComponent(libraryName)}`;
    if (sido) url += `&CTPRVN_NM=${encodeURIComponent(sido)}`;
    if (sigungu) url += `&SIGNGU_NM=${encodeURIComponent(sigungu)}`;
    if (operTime) url += `&weekdayOperColseHhmm=${encodeURIComponent(operTime)}`;
    if (satOperTime) url += `&satOperCloseHhmm=${encodeURIComponent(satOperTime)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.response?.body?.items) {
      data.response.body.items = data.response.body.items.map((item: any) => ({
        ...item,
        latitude: item.latitude || item.refine_WGS84_LAT,
        longitude: item.longitude || item.refine_WGS84_LOGT
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('도서관 API 에러:', error);
    return NextResponse.json({ error: '도서관 데이터 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 