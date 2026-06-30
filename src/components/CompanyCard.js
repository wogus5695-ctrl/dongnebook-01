export function CompanyCard(listing, context = {}) {
  // "추천", "1위", "검증" 대신 허용된 표현인 "광고/제휴 등록" 또는 "입점 업체" 뱃지 1개만 작게 고정
  const badgeText = listing.badgeText || "광고/제휴 등록 업체";
  
  const tagsHTML = listing.tags
    ? listing.tags.map(tag => `<span class="company-tag">#${tag}</span>`).join('')
    : '';

  // 1. 대표 이미지 설정 (없을 시 카테고리별 기본 플레이스홀더 실 이미지 URL 매핑)
  let defaultImage = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"; // 기본 청소 이미지
  if (listing.category === 'waterproof-leak') {
    defaultImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"; // 시공/공사 이미지
  } else if (listing.category === 'window-caulking') {
    defaultImage = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"; // 실리콘/도구 이미지
  } else if (listing.category === 'drain-clog') {
    defaultImage = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"; // 배관/욕실 이미지
  }

  const cardImage = listing.thumbnail || defaultImage;

  // 2. Alt 자동 합성: {지역명} {작업명} 상담 가능 업체 {업체명}
  const regionName = context.regionName || "우리 동네";
  const taskName = context.taskName || "시공·수리";
  const imageAlt = `${regionName} ${taskName} 상담 가능 업체 ${listing.name}`;

  return `
    <article class="company-card ${listing.isAd ? 'is-ad' : ''}" id="company-card-${listing.id}" style="display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      
      <!-- 대표 이미지 영역 (모바일 상단 고정 대응) -->
      <div class="card-thumb-wrapper" style="width: 100%; height: 160px; overflow: hidden; position: relative;">
        <img src="${cardImage}" alt="${imageAlt}" class="card-thumb" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
        <!-- 작은 광고 등록 배지 -->
        <div>
          <span class="ad-badge" style="margin-bottom: 6px;">${badgeText}</span>
        </div>
        
        <!-- 업체명 -->
        <h3 style="font-size: 1.15rem; margin-bottom: 6px; color: var(--text-dark);">${listing.name}</h3>
        
        <!-- 짧은 소개 (1문장 축약) -->
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">
          ${listing.description}
        </p>

        <!-- 해시태그 3~4개 -->
        <div class="company-tags" style="margin-bottom: 16px; margin-top: auto;">
          ${tagsHTML}
        </div>

        <!-- CTA 버튼 구조 조정 (전화 -> 카카오 -> 홈페이지 순 및 강조 변경) -->
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          
          <div style="display: flex; gap: 8px; width: 100%;">
            <!-- 전화 문의 (최우선 메인 버튼) -->
            <a href="tel:${listing.phone}" class="btn btn-primary" style="font-size: 0.85rem; padding: 10px; flex: 1;">
              📞 전화 문의
            </a>
            
            <!-- 카카오 문의 (카톡 브랜드 색 적용) -->
            <a href="${listing.kakaoLink}" target="_blank" rel="noopener noreferrer" class="btn" style="font-size: 0.85rem; padding: 10px; flex: 1; background-color: #fee500; color: #191919;">
              💬 카카오 문의
            </a>
          </div>

          <!-- 홈페이지 보기 (보조형 아웃라인 버튼으로 격하 정렬) -->
          ${listing.siteLink && listing.siteLink !== "추후 입력" ? `
            <a href="${listing.siteLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.8rem; padding: 8px; width: 100%;">
              공식 홈페이지 보기
            </a>
          ` : ''}

        </div>
      </div>
    </article>
  `;
}
