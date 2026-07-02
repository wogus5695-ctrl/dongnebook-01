export const adSlots = [
  // 1. 종합청소 광고 구좌
  {
    id: "slot-clean-1",
    businessId: "clean-brand-1",
    categoryId: "general-cleaning",
    taskId: "floor-cleaning",
    regionId: "seoul-gangnam",
    position: "top-card-1",
    planType: "product-single",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    priority: 10,
    memo: "동네책자 홈케어 청소 - 강남구 바닥청소 1구좌"
  },
  {
    id: "slot-clean-2",
    businessId: "clean-brand-2",
    categoryId: "general-cleaning",
    taskId: "window-cleaning",
    regionId: "seoul-gangnam-yeoksam",
    position: "top-card-1",
    planType: "product-single",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    priority: 8,
    memo: "하이클래스 외벽유리창청소 - 역삼동 유리창청소 1구좌"
  },
  {
    id: "slot-clean-3",
    businessId: "clean-brand-3",
    categoryId: "general-cleaning",
    taskId: "fire-cleaning",
    regionId: "seoul-songpa-jamsil",
    position: "top-card-1",
    planType: "product-single",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    priority: 9,
    memo: "세이프 가드 특수화재청소 - 잠실동 화재청소 1구좌"
  },

  // 2. 창틀코킹 / 방수 광고 구좌
  {
    id: "slot-water-1",
    businessId: "waterproof-brand-1",
    categoryId: "window-caulking",
    taskId: "window-caulking-task",
    regionId: "seoul-gangnam",
    position: "top-card-1",
    planType: "product-triple",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    priority: 10,
    memo: "명가 코킹&실리콘 - 강남구 창틀코킹 1구좌"
  },
  {
    id: "slot-water-2",
    businessId: "waterproof-brand-2",
    categoryId: "waterproof-leak",
    taskId: "exterior-waterproofing",
    regionId: "seoul-songpa-jamsil",
    position: "top-card-1",
    planType: "product-single",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    priority: 9,
    memo: "가람 외벽 크랙방수 - 잠실동 외벽방수 1구좌"
  },
  {
    id: "slot-water-3",
    businessId: "waterproof-brand-3",
    categoryId: "waterproof-leak",
    taskId: "rooftop-waterproofing",
    regionId: "gyeonggi-suwon-yeongtong",
    position: "top-card-1",
    planType: "product-five",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    priority: 8,
    memo: "올인원 옥상 누수방수 - 영통구 옥상방수 1구좌"
  },

  // 3. 하수구막힘 광고 구좌 (비활성화 상태 예시)
  {
    id: "slot-drain-1",
    businessId: "drain-brand-1",
    categoryId: "drain-clog",
    taskId: "drain-clogged",
    regionId: "seoul-songpa",
    position: "top-card-1",
    planType: "product-single",
    status: "paused",
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    priority: 7,
    memo: "번개 하수구 해결사 - 송파구 하수구막힘 1구좌 (현재 일시중단)"
  }
];
