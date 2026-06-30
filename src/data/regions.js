export const regions = [
  // 1. 서울 특별시 계층 데이터
  {
    province: "서울",
    city: "",
    district: "강남구",
    neighborhood: "",
    displayName: "서울 강남구",
    slug: "seoul/gangnam",
    regionLevel: "district",
    parentRegion: "seoul",
    nearbyRegions: ["seoul/seocho", "seoul/songpa", "seoul/seongdong"]
  },
  {
    province: "서울",
    city: "",
    district: "강남구",
    neighborhood: "논현동", // 논현1동, 논현2동 -> 논현동 통합 표기 규칙
    displayName: "서울 강남구 논현동",
    slug: "seoul/gangnam/nonhyeon",
    regionLevel: "neighborhood",
    parentRegion: "seoul/gangnam",
    nearbyRegions: ["seoul/gangnam/yeoksam", "seoul/gangnam/sinsa"]
  },
  {
    province: "서울",
    city: "",
    district: "강남구",
    neighborhood: "역삼동",
    displayName: "서울 강남구 역삼동",
    slug: "seoul/gangnam/yeoksam",
    regionLevel: "neighborhood",
    parentRegion: "seoul/gangnam",
    nearbyRegions: ["seoul/gangnam/nonhyeon", "seoul/gangnam/samseong"]
  },
  {
    province: "서울",
    city: "",
    district: "송파구",
    neighborhood: "",
    displayName: "서울 송파구",
    slug: "seoul/songpa",
    regionLevel: "district",
    parentRegion: "seoul",
    nearbyRegions: ["seoul/gangnam", "seoul/gangdong"]
  },
  {
    province: "서울",
    city: "",
    district: "송파구",
    neighborhood: "잠실동",
    displayName: "서울 송파구 잠실동",
    slug: "seoul/songpa/jamsil",
    regionLevel: "neighborhood",
    parentRegion: "seoul/songpa",
    nearbyRegions: ["seoul/songpa/samjeon", "seoul/gangnam/daechi"]
  },

  // 2. 경기도 계층 데이터 (수원시 등)
  {
    province: "경기",
    city: "수원시",
    district: "",
    displayName: "경기 수원시",
    slug: "gyeonggi/suwon",
    regionLevel: "city",
    parentRegion: "gyeonggi",
    nearbyRegions: ["gyeonggi/yongin", "gyeonggi/hwaseong", "gyeonggi/uicheang"]
  },
  {
    province: "경기",
    city: "수원시",
    district: "장안구",
    neighborhood: "",
    displayName: "경기 수원시 장안구",
    slug: "gyeonggi/suwon/jangan",
    regionLevel: "district",
    parentRegion: "gyeonggi/suwon",
    nearbyRegions: ["gyeonggi/suwon/gwonseon", "gyeonggi/suwon/paldal"]
  },
  {
    province: "경기",
    city: "수원시",
    district: "영통구",
    neighborhood: "",
    displayName: "경기 수원시 영통구",
    slug: "gyeonggi/suwon/yeongtong",
    regionLevel: "district",
    parentRegion: "gyeonggi/suwon",
    nearbyRegions: ["gyeonggi/suwon/paldal", "gyeonggi/yongin/suji"]
  },
  {
    province: "경기",
    city: "파주시",
    district: "",
    neighborhood: "운정동", // 운정1, 2, 3동 -> 운정동 통합 규칙
    displayName: "경기 파주시 운정동",
    slug: "gyeonggi/paju/unjeong",
    regionLevel: "neighborhood",
    parentRegion: "gyeonggi/paju",
    nearbyRegions: ["gyeonggi/paju/geumchon", "gyeonggi/goyang/ilsanseo"]
  }
];
