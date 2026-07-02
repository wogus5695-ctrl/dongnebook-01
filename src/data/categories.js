export const categories = [
  {
    id: "general-cleaning",
    name: "종합청소",
    slug: "cleaning",
    description: "이사청소, 입주청소, 준공청소 및 상가/건물 외벽 유리창 관리 전문 업체 정보입니다.",
    mainTaskIds: ["exterior-cleaning", "window-cleaning", "floor-waxing", "post-construction-cleaning"],
    relatedTaskIds: ["fire-cleaning", "floor-cleaning", "awning-cleaning", "sign-cleaning", "interior-cleaning", "hood-cleaning"],
    hubTitle: "서울·경기 종합청소 업체 찾기",
    hubDescription: "종합청소 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    visible: true
  },
  {
    id: "waterproof-leak",
    name: "방수/누수",
    slug: "waterproofing",
    description: "아파트 베란다 누수, 옥상 우레탄 방수 공사 및 미세 누수 탐지 정밀 진단 업체 리스트입니다.",
    mainTaskIds: ["rooftop-waterproofing", "rain-leak", "rooftop-leak"],
    relatedTaskIds: ["exterior-waterproofing", "roof-waterproofing", "exterior-leak"],
    hubTitle: "서울·경기 방수·누수 업체 찾기",
    hubDescription: "방수/누수 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    visible: true
  },
  {
    id: "window-caulking",
    name: "창틀코킹/창틀누수",
    slug: "caulking",
    description: "빗물이 들이치는 아파트/빌라 창틀 실리콘 코킹 및 크랙 빗물 누수 차단 전문 지면입니다.",
    mainTaskIds: ["window-caulking-task", "window-leak", "window-rain-leak"],
    relatedTaskIds: ["window-silicon", "chassis-silicon"],
    hubTitle: "서울·경기 창틀코킹·창틀누수 업체 찾기",
    hubDescription: "창틀코킹/창틀누수 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    visible: true
  },
  {
    id: "drain-clog",
    name: "하수구막힘",
    slug: "drain",
    description: "싱크대 역류, 화장실 바닥 배수구 막힘, 빌라/상가 메인 오수관 고압세척 전문 안내입니다.",
    mainTaskIds: ["drain-clogged", "sink-clogged", "toilet-clogged"],
    relatedTaskIds: ["bathroom-drain-clogged", "main-sewer-clogged", "main-sewer-backflow"],
    hubTitle: "서울·경기 하수구막힘 업체 찾기",
    hubDescription: "하수구막힘 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    visible: false
  }
];
