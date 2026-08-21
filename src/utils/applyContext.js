/**
 * 동네책자 광고 입점 신청 Context 관리 공통 helper
 * sessionStorage를 이용하여 URL Query Parameter 없이 광고 신청 유입 정보를 안전하게 전달합니다.
 */

const STORAGE_KEY = 'dongnebook_apply_context';
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 60분 (MS 단위)

/**
 * 1. Apply Context 저장
 * @param {Object} contextData - 저장할 유입 컨텍스트 정보
 * @param {string} contextData.sourceType - 유입 유형 ("landing", "hub", "guide" 등)
 * @param {string} [contextData.reg] - 유입 지역
 * @param {string} [contextData.cat] - 유입 카테고리 ID
 * @param {string} [contextData.task] - 유입 작업명 ID
 * @param {string} [contextData.prod] - 유입 광고 상품 코드
 */
export function saveApplyContext(contextData) {
  try {
    if (!contextData || typeof contextData !== 'object') {
      return false;
    }

    // 개인정보 보호 조치 (허용된 안전 필드만 필터링하여 저장)
    const safeData = {
      version: 1,
      sourceType: contextData.sourceType || 'unknown',
      reg: contextData.reg ? String(contextData.reg).trim() : undefined,
      cat: contextData.cat ? String(contextData.cat).trim() : undefined,
      task: contextData.task ? String(contextData.task).trim() : undefined,
      prod: contextData.prod ? String(contextData.prod).trim() : undefined,
      sourcePath: window.location.pathname + window.location.search,
      createdAt: Date.now()
    };

    // undefined 속성 제거
    Object.keys(safeData).forEach(key => {
      if (safeData[key] === undefined) {
        delete safeData[key];
      }
    });

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    return true;
  } catch (error) {
    console.warn('[Apply Context Save Failed]:', error);
    return false;
  }
}

/**
 * 2. Apply Context 읽기 및 3. 유효성 검사 (TTL 판별 포함)
 * @returns {Object|null} 유효한 컨텍스트 객체 또는 null
 */
export function getApplyContext() {
  try {
    const rawData = sessionStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return null;
    }

    const context = JSON.parse(rawData);

    // 버전 및 기본 구조 유효성 검사
    if (!context || typeof context !== 'object' || context.version !== 1) {
      clearApplyContext();
      return null;
    }

    // TTL 유효성 검사 (60분 기준)
    const age = Date.now() - (context.createdAt || 0);
    if (age > DEFAULT_TTL_MS || age < 0) {
      console.log('[Apply Context Expired]: Clearing context');
      clearApplyContext();
      return null;
    }

    return context;
  } catch (error) {
    console.warn('[Apply Context Load/Validation Failed]:', error);
    // 비정상 데이터 적재 시 초기화 처리
    clearApplyContext();
    return null;
  }
}

/**
 * 4. 오래된 Context 삭제 & 5. Apply Context 초기화
 */
export function clearApplyContext() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('[Apply Context Clear Failed]:', error);
    return false;
  }
}
