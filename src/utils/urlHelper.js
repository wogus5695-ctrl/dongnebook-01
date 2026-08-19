/**
 * 동네책자 플랫폼 공통 landing URL 빌더
 * 표준 URL 규칙: /landing.html?reg={regionName}&cat={categoryId}&task={taskId} 순서 고정
 */
export function buildLandingUrl(regionName, categoryId, taskId) {
  // URI Component 인코딩 시 대문자 인코딩 포맷 준수 및 공백 %20 포맷 통일
  const encodedReg = encodeURIComponent(regionName).replace(/\+/g, '%20');
  return `/landing.html?reg=${encodedReg}&cat=${categoryId}&task=${taskId}`;
}
