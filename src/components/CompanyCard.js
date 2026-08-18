export function CompanyCard(listing, context = {}) {
  // \"추천\", \"검증\", \"1위\", \"우수\", \"최고\" 사용 금지 규정 준수
  // 허용된 3대 배지 중 기본값으로 \"광고/제휴 포함\" 적용
  const badgeText = listing.badgeText || "광고/제휴 포함";
  
  // 데이터 객체 내 hashtags가 명시되어 있으면 우선적으로 사용하고, 없을 시 기존 작업명 리스트(tags) 사용
  const finalTags = listing.hashtags && listing.hashtags.length > 0
    ? listing.hashtags
    : (listing.tags || []);

  const tagsHTML = finalTags.map(tag => `<span class="company-tag">#${tag}</span>`).join('');

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
      
      <!-- 1. 대표 이미지 영역 ( object-fit: cover 적용 및 고정 비율 ) -->
      <div class="card-thumb-wrapper" style="width: 100%; height: 160px; overflow: hidden; position: relative;">
        <img src="${cardImage}" alt="${imageAlt}" class="card-thumb" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
        
        <!-- 2. 작은 배지 (허용 규격 준수) -->
        <div>
          <span class="ad-badge" style="margin-bottom: 6px;">${badgeText}</span>
        </div>
        
        <!-- 3. 업체명 -->
        <h3 style="font-size: 1.15rem; margin-bottom: 6px; color: var(--text-dark);">${listing.name}</h3>
        
        <!-- 4. 짧은 소개 1문장 (긴 설명 지양) -->
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">
          ${listing.description}
        </p>

        <!-- 5. 해시태그 3~4개 -->
        <div class="company-tags" style="margin-bottom: 16px; margin-top: auto;">
          ${tagsHTML}
        </div>

        <!-- CTA 버튼 리스트 (우선순위: 전화 -> 카카오 -> 홈페이지) -->
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          
          <div style="display: flex; gap: 8px; width: 100%;">
            <!-- 6. 전화 문의 (메인 CTA - 파란색 강조) -->
            <a href="tel:${listing.phone}" class="btn btn-primary" style="font-size: 0.85rem; padding: 12px; flex: 1.1; text-align: center; font-weight: bold; text-decoration: none;">
              📞 전화 문의
            </a>
            
            <!-- 7. 카카오 문의 (보조 강조 - 카카오 브랜드 노란색 적용) -->
            <a href="${listing.kakaoLink}" target="_blank" rel="noopener noreferrer" class="btn" style="font-size: 0.85rem; padding: 12px; flex: 0.9; background-color: #fee500; color: #191919; text-align: center; text-decoration: none; font-weight: bold; border-radius: var(--border-radius);">
              💬 카카오 문의
            </a>
          </div>

          <!-- 8. 홈페이지 보기 (보조형 아웃라인 버튼) -->
          ${listing.siteLink && listing.siteLink !== "추후 입력" ? `
            <a href="${listing.siteLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.8rem; padding: 8px; width: 100%; text-align: center; text-decoration: none; background-color: white; border-color: var(--border-color); color: var(--text-dark);">
              공식 홈페이지 보기
            </a>
          ` : ''}

        </div>
      </div>
    </article>
  `;
}
