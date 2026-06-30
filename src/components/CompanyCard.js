export function CompanyCard(listing) {
  // "추천", "1위", "검증" 대신 "광고/제휴 등록 업체", "입점 업체", "상담 연결 가능 업체"
  const badgeText = listing.badgeText || "입점 광고 업체";
  
  const tagsHTML = listing.tags
    ? listing.tags.map(tag => `<span class="company-tag">#${tag}</span>`).join('')
    : '';

  return `
    <article class="company-card ${listing.isAd ? 'is-ad' : ''}" id="company-card-${listing.id}">
      <span class="ad-badge">${badgeText}</span>
      <h3>${listing.name}</h3>
      
      <div class="company-meta">
        <span>📍 활동지역: ${listing.regions.join(', ')}</span>
        ${listing.phone ? `<span>📞 문의: <a href="tel:${listing.phone}">${listing.phone}</a></span>` : ''}
      </div>
      
      <p style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 12px;">
        ${listing.description}
      </p>

      <div class="company-tags">
        ${tagsHTML}
      </div>

      <div style="display: flex; gap: 8px;">
        ${listing.siteLink ? `<a href="${listing.siteLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.85rem; padding: 8px 12px;">공식 홈페이지</a>` : ''}
        ${listing.kakaoLink ? `<a href="${listing.kakaoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.85rem; padding: 8px 12px; background-color: #fee500; color: #191919;">카카오톡 문의</a>` : ''}
      </div>
    </article>
  `;
}
