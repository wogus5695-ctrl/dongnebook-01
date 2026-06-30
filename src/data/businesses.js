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
    serviceRegions: ["seoul/gangnam", "seoul/songpa", "gyeonggi/suwon"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "아파트 입주청소부터 상가 바닥 왁스코팅 및 준공청소까지 정직하게 직접 시공하는 청소 브랜드입니다.",
    badge: "광고/제휴 등록 업체",
    isInternalBrand: true,
    adStatus: "active",
    adStartDate: "2026-01-01",
    adEndDate: "2027-12-31",
    priority: 10,
    logo: "/assets/logos/clean1.png",
    thumbnail: "/assets/thumbs/clean1.jpg",
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
    serviceRegions: ["seoul/gangnam", "seoul/gangnam/yeoksam", "seoul/gangnam/nonhyeon", "gyeonggi/suwon/yeongtong"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "고층 아파트 외부 유리창 청소 및 건물 상가 전면 간판/어닝 세척 전문 로프 세정 파트너입니다.",
    badge: "입점 업체",
    isInternalBrand: true,
    adStatus: "active",
    adStartDate: "2026-01-01",
    adEndDate: "2027-12-31",
    priority: 8,
    logo: "/assets/logos/clean2.png",
    thumbnail: "/assets/thumbs/clean2.jpg",
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
    serviceRegions: ["seoul/songpa", "seoul/songpa/jamsil", "gyeonggi/suwon/jangan"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "화재 그을음 제거 및 유독 냄새 탈취, 공사 완료 후 정밀 준공청소를 책임지는 특수 환경 전문 브랜드입니다.",
    badge: "상담 연결 가능 업체",
    isInternalBrand: true,
    adStatus: "active",
    adStartDate: "2026-01-01",
    adEndDate: "2027-12-31",
    priority: 9,
    logo: "/assets/logos/clean3.png",
    thumbnail: "/assets/thumbs/clean3.jpg",
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
    serviceRegions: ["seoul/gangnam", "seoul/gangnam/nonhyeon", "gyeonggi/suwon"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "아파트 베란다 창틀 빗물 누수 원천 차단. 낡은 실리콘 칼 탈거 후 프리미엄 실란트 정석 재코킹 브랜드.",
    badge: "광고/제휴 등록 업체",
    isInternalBrand: true,
    adStatus: "active",
    adStartDate: "2026-01-01",
    adEndDate: "2027-12-31",
    priority: 10,
    logo: "/assets/logos/water1.png",
    thumbnail: "/assets/thumbs/water1.jpg",
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
    serviceRegions: ["seoul/songpa", "seoul/songpa/jamsil", "gyeonggi/suwon/jangan"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "건물 외벽 균열 실리콘 보수 및 특수 콘크리트 침투형 외벽 발수 코팅 시공 전문 로프 공정 업체입니다.",
    badge: "입점 업체",
    isInternalBrand: true,
    adStatus: "active",
    adStartDate: "2026-01-01",
    adEndDate: "2027-12-31",
    priority: 9,
    logo: "/assets/logos/water2.png",
    thumbnail: "/assets/thumbs/water2.jpg",
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
    serviceRegions: ["seoul/gangnam", "seoul/songpa", "gyeonggi/suwon", "gyeonggi/suwon/yeongtong"],
    phone: "추후 입력",
    kakaoUrl: "추후 입력",
    websiteUrl: "추후 입력",
    description: "옥상 우레탄 방수 공사, 옥상 바닥 연삭 그라인딩 및 미세 누수 지점 정밀 진단 탑클래스 전문 시공점.",
    badge: "상담 연결 가능 업체",
    isInternalBrand: true,
    adStatus: "active",
    adStartDate: "2026-01-01",
    adEndDate: "2027-12-31",
    priority: 8,
    logo: "/assets/logos/water3.png",
    thumbnail: "/assets/thumbs/water3.jpg",
    visible: true
  }
];
