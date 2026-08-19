import { OPERATED_CATEGORIES } from '../data/categories.js';

/**
 * Index Quality Gate - 동적 페이지의 검색엔진 색인 및 사이트맵 노출 여부를 판정
 * @param {Object} region 지역 데이터 객체
 * @param {Object} category 카테고리 데이터 객체
 * @param {Object} task 작업 데이터 객체
 * @param {Boolean} hasActiveListing 활성 매칭 업체 존재 여부
 * @returns {Object} { indexable: Boolean, reason: String }
 */
export function checkIndexQuality(region, category, task, hasActiveListing) {
  // 1. 필수 파라미터 유효성 검증
  if (!region || !category || !task) {
    return { indexable: false, reason: "Parameter missing" };
  }

  // 2. 운영 대상 업종 여부 검증
  if (!OPERATED_CATEGORIES.includes(category.id) || !category.landingEnabled || !category.visible) {
    return { indexable: false, reason: "Non-operated category" };
  }

  // 3. 작업이 해당 카테고리에 속하는지 검증
  if (!task.categoryIds.includes(category.id) || !task.visible) {
    return { indexable: false, reason: "Invalid task-category combination" };
  }

  // 4. 지역 노출 가능 여부 검증
  if (region.visible === false) {
    return { indexable: false, reason: "Hidden region" };
  }

  // 5. 전용 SEO 템플릿 존재 여부 검증 (Generic Fallback 방지)
  if (!category.seoTemplate) {
    return { indexable: false, reason: "No SEO template (generic fallback)" };
  }

  // 6. 업체 수 기반 필터링 (Thin Content / Doorway Page 리스크 제어)
  if (!hasActiveListing) {
    // 업체가 0개인 경우: 구 단위(district)는 유용한 로컬 정보 제공 지면으로 색인을 허용하되, 
    // 동 단위(neighborhood)는 검색엔진 저품질 패널티(Doorway) 예방을 위해 색인 대상에서 배제(noindex)
    if (region.level === "neighborhood") {
      return { indexable: false, reason: "Neighborhood page with zero matching businesses (Doorway Page Protection)" };
    }
  }

  return { indexable: true, reason: "Passes Index Quality Gate" };
}
