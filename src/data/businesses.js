export const businesses = [
  // ==========================================
  // [청소 브랜드 3개]
  // ==========================================
  {
    id: "clean-brand-1",
    brandName: "동네책자 홈케어 청소",
    categoryIds: ["general-cleaning"],
    taskIds: [
      "floor-cleaning",
      "post-construction-cleaning",
      "interior-cleaning",
      "hood-cleaning",
      "floor-waxing",
      "awning-cleaning"
    ],
    serviceRegionIds: ["seoul-gangnam", "seoul-songpa", "gyeonggi-suwon-yeongtong"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "아파트 입주청소부터 상가 바닥 왁스코팅 및 준공청소까지 정직하게 직접 시공하는 청소 브랜드입니다.",
    hashtags: ["아파트청소", "바닥코팅", "준공청소"],
    image: "/assets/thumbs/clean1.jpg",
    logo: "/assets/logos/clean1.png",
    isInternalBrand: true,
    status: "active",
    priority: 10,
    visible: true
  },
  {
    id: "clean-brand-2",
    brandName: "하이클래스 외벽유리창청소",
    categoryIds: ["general-cleaning"],
    taskIds: [
      "exterior-cleaning",
      "window-cleaning",
      "awning-cleaning",
      "sign-cleaning"
    ],
    serviceRegionIds: ["seoul-gangnam", "seoul-gangnam-yeoksam", "seoul-gangnam-nonhyeon", "seoul-songpa", "gyeonggi-suwon-yeongtong"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "고층 아파트 외부 유리창 청소 및 건물 상가 전면 간판/어닝 세척 전문 로프 세정 파트너입니다.",
    hashtags: ["외벽청소", "유리창청소", "로프세척"],
    image: "/assets/thumbs/clean2.jpg",
    logo: "/assets/logos/clean2.png",
    isInternalBrand: true,
    status: "active",
    priority: 8,
    visible: true
  },
  {
    id: "clean-brand-3",
    brandName: "세이프 가드 특수화재청소",
    categoryIds: ["general-cleaning"],
    taskIds: [
      "fire-cleaning",
      "post-construction-cleaning",
      "interior-cleaning",
      "hood-cleaning"
    ],
    serviceRegionIds: ["seoul-songpa", "seoul-songpa-jamsil", "gyeonggi-suwon-yeongtong-gwanggyo"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "화재 그을음 제거 및 유독 냄새 탈취, 공사 완료 후 정밀 준공청소를 책임지는 특수 환경 전문 브랜드입니다.",
    hashtags: ["화재복구", "그을음제거", "준공전문"],
    image: "/assets/thumbs/clean3.jpg",
    logo: "/assets/logos/clean3.png",
    isInternalBrand: true,
    status: "active",
    priority: 9,
    visible: true
  },

  // ==========================================
  // [로프공/방수 브랜드 3개]
  // ==========================================
  {
    id: "waterproof-brand-1",
    brandName: "명가 코킹&실리콘",
    categoryIds: ["window-caulking", "waterproof-leak"],
    taskIds: [
      "window-caulking-task",
      "window-leak",
      "window-silicon",
      "chassis-silicon",
      "window-rain-leak"
    ],
    serviceRegionIds: ["seoul-gangnam", "seoul-gangnam-nonhyeon", "gyeonggi-suwon-yeongtong"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "아파트 베란다 창틀 빗물 누수 원천 차단. 낡은 실리콘 칼 탈거 후 프리미엄 실란트 정석 재코킹 브랜드.",
    hashtags: ["창틀코킹", "실리콘교체", "베란다방수"],
    image: "/assets/thumbs/water1.jpg",
    logo: "/assets/logos/water1.png",
    isInternalBrand: true,
    status: "active",
    priority: 10,
    visible: true
  },
  {
    id: "waterproof-brand-2",
    brandName: "가람 외벽 크랙방수",
    categoryIds: ["waterproof-leak", "window-caulking"],
    taskIds: [
      "exterior-waterproofing",
      "exterior-leak",
      "window-rain-leak",
      "rain-leak"
    ],
    serviceRegionIds: ["seoul-songpa", "seoul-songpa-jamsil", "gyeonggi-suwon-yeongtong-mangpo", "gyeonggi-paju"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "건물 외벽 균열 실리콘 보수 및 특수 콘크리트 침투형 외벽 발수 코팅 시공 전문 로프 공정 업체입니다.",
    hashtags: ["외벽방수", "크랙보수", "로프시공"],
    image: "/assets/thumbs/water2.jpg",
    logo: "/assets/logos/water2.png",
    isInternalBrand: true,
    status: "active",
    priority: 9,
    visible: true
  },
  {
    id: "waterproof-brand-3",
    brandName: "올인원 옥상 누수방수",
    categoryIds: ["waterproof-leak"],
    taskIds: [
      "rooftop-waterproofing",
      "rooftop-leak",
      "rain-leak"
    ],
    serviceRegionIds: ["seoul-gangnam", "seoul-songpa", "gyeonggi-suwon-yeongtong"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "옥상 우레탄 방수 공사, 옥상 바닥 연삭 그라인딩 및 미세 누수 지점 정밀 진단 전문 시공점.",
    hashtags: ["옥상방수", "우레탄시공", "누수정밀진단"],
    image: "/assets/thumbs/water3.jpg",
    logo: "/assets/logos/water3.png",
    isInternalBrand: true,
    status: "active",
    priority: 8,
    visible: true
  },

  // ==========================================
  // [하수구막힘 브랜드 1개 - 비활성화]
  // ==========================================
  {
    id: "drain-brand-1",
    brandName: "번개 하수구 해결사",
    categoryIds: ["drain-clog"],
    taskIds: [
      "drain-clogged",
      "sink-clogged",
      "toilet-clogged",
      "bathroom-drain-clogged",
      "main-sewer-clogged",
      "main-sewer-backflow"
    ],
    serviceRegionIds: ["seoul-songpa", "seoul-songpa-jamsil", "gyeonggi-suwon-yeongtong"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "최신 내시경 카메라 및 고압세척 장비로 꽉 막힌 하수구를 신속하게 뚫어드립니다.",
    hashtags: ["하수구막힘", "변기역류", "고압세척"],
    image: "/assets/thumbs/drain1.jpg",
    logo: "/assets/logos/drain1.png",
    isInternalBrand: true,
    status: "active",
    priority: 7,
    visible: false
  },
  {
    id: "bareumspace-elastic-coating",
    brandName: "바름공간",
    categoryIds: ["elastic-coating"],
    taskIds: [
      "elastic-coating",
      "elastic-coating-work",
      "veranda-elastic-coating",
      "laundry-room-elastic-coating",
      "apartment-elastic-coating",
      "elastic-coating-company"
    ],
    serviceRegionIds: [
      "seoul-eunpyeong",
      "seoul-seodaemun"
    ],
    phone: "010-4667-5568",
    telUrl: "tel:01046675568",
    kakaoUrl: "http://pf.kakao.com/_LfhxnX",
    websiteUrl: "https://www.barumspace.co.kr/",
    description: "아파트 베란다, 세탁실, 다용도실 등 실내 결로·곰팡이 예방을 위한 탄성코트 시공 상담이 가능한 업체입니다.",
    hashtags: ["#탄성코트", "#베란다탄성코트", "#세탁실탄성코트", "#아파트탄성코트"],
    image: "/assets/thumbs/elastic-coating-bareumspace.jpg",
    logo: "",
    isInternalBrand: true,
    status: "active",
    priority: 1,
    visible: true
  }
];
