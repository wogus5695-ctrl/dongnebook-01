/**
 * 동네책자 광고 구좌 통합 검증 유틸리티 (adValidator.js)
 * 
 * [광고 구좌 핵심 정책]
 * 1. 동일 업체 중복 등록 차단: 동일한 (businessId + categoryId + purchaseRegionId)의 활성 구좌는 단 1개만 허용됩니다.
 * 2. 최대 4구좌 제한: 동일한 (categoryId + purchaseRegionId) 조합 내 활성 광고주는 최대 4개로 제한됩니다.
 * 3. 비활성 업체 배제: status가 'active'가 아닌 구좌(예: migrated, disabled, inactive)는 통계 및 가용 검사에서 제외합니다.
 * 4. 노출 분할 중복 계산 방지: 하나의 구좌가 동 단위 노출 및 다중 테스크에 노출되어도 등록 구좌 개수는 항상 1개로 계산됩니다.
 */

/**
 * 특정 업종(categoryId)과 구 단위 지역(districtId)의 현재 구좌 점유 상태를 조회합니다.
 * @param {Array} slots - 전체 광고 슬롯 리스트
 * @param {string} categoryId - 카테고리 ID
 * @param {string} districtId - 구 단위 지역 ID
 * @returns {Array} - 매칭된 고유 활성 구좌 리스트
 */
export function getSlotOccupancy(slots, categoryId, districtId) {
  if (!slots || !Array.isArray(slots)) return [];

  // 활성 상태('active')의 구좌만 카운트
  const activeSlots = slots.filter(s => 
    s.status === 'active' && 
    s.categoryId === categoryId && 
    s.purchaseRegionId === districtId
  );

  // 동일 업체(businessId) 중복 제거하여 고유 업체 수 기준 점유 계산
  const seenBusinesses = new Set();
  const uniqueOccupied = [];

  for (const slot of activeSlots) {
    if (!seenBusinesses.has(slot.businessId)) {
      seenBusinesses.add(slot.businessId);
      uniqueOccupied.push(slot);
    }
  }

  return uniqueOccupied;
}

/**
 * 신규 광고 구좌 추가 또는 데이터 무결성 검증을 수행합니다.
 * @param {Array} currentSlots - 현재 등록된 전체 광고 슬롯 리스트
 * @param {Object} newSlot - 신규 추가하려는 광고 슬롯 객체
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export function validateAdSlot(currentSlots, newSlot) {
  if (!newSlot) {
    return { isValid: false, error: "검증 대상 광고 슬롯 데이터가 누락되었습니다." };
  }

  // 필수 속성 검증
  if (!newSlot.businessId || !newSlot.categoryId || !newSlot.purchaseRegionId) {
    return { isValid: false, error: "필수 정보(businessId, categoryId, purchaseRegionId)가 부족합니다." };
  }

  // 추가하려는 슬롯이 활성 상태가 아니면 무조건 허용 (노출되지 않으므로 검증 불필요)
  if (newSlot.status !== 'active') {
    return { isValid: true, error: null };
  }

  // 1. 동일 업체 중복 등록 검증
  const isDuplicate = currentSlots.some(s => 
    s.status === 'active' &&
    s.businessId === newSlot.businessId &&
    s.categoryId === newSlot.categoryId &&
    s.purchaseRegionId === newSlot.purchaseRegionId &&
    s.id !== newSlot.id // 자기 자신 검출 제외
  );

  if (isDuplicate) {
    return { 
      isValid: false, 
      error: `[중복 등록 차단] 업체(${newSlot.businessId})는 이미 해당 업종(${newSlot.categoryId}) 및 지역(${newSlot.purchaseRegionId})에 광고 구좌를 점유하고 있습니다.` 
    };
  }

  // 2. 최대 4구좌 초과 검증
  const occupied = getSlotOccupancy(currentSlots, newSlot.categoryId, newSlot.purchaseRegionId);
  
  // 이미 점유하고 있는 업체의 추가 슬롯은 (중복 체크에서 걸러지므로) 신규 업체 기준 카운트
  if (occupied.length >= 4) {
    return { 
      isValid: false, 
      error: `[최대 구좌 초과 차단] 해당 지역(${newSlot.purchaseRegionId})의 업종(${newSlot.categoryId})은 이미 최대 허용 구좌 수(4개)가 매진되었습니다.` 
    };
  }

  return { isValid: true, error: null };
}

/**
 * 전체 광고 슬롯 데이터베이스(adSlots.js)의 전체 무결성을 검증합니다.
 * @param {Array} slots - 전체 광고 슬롯 리스트
 * @returns {Array} - 발견된 위반 사항 에러 메시지 리스트
 */
export function validateDatabaseIntegrity(slots) {
  const errors = [];
  const checkedSlots = [];

  for (const slot of slots) {
    // 순차적으로 자기 이전까지 쌓인 데이터와 비교 검증 수행
    const result = validateAdSlot(checkedSlots, slot);
    if (!result.isValid) {
      errors.push(`[Slot ID: ${slot.id}] ${result.error}`);
    }
    checkedSlots.push(slot);
  }

  return errors;
}
