export function renderHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;

  const currentPath = window.location.pathname;
  
  // 페이지 유형 판별
  const isMainPage = currentPath === '/' || currentPath.endsWith('index.html');
  const isLandingPage = currentPath.includes('landing.html');
  const isGuidePage = currentPath.includes('guide.html');
  const isApplyPage = currentPath.includes('apply.html');
  const isAdminPage = currentPath.includes('hub.html'); // 관리자 지면

  // 우측 버튼 분기 처리
  let ctaButtonsHTML = '';
  if (isMainPage) {
    ctaButtonsHTML = `
      <a href="/guide.html" class="btn btn-outline" style="font-size: 0.75rem; padding: 6px 12px; border-color: var(--border-color); background-color: white; color: var(--text-dark);">광고 입점 안내</a>
      <a href="/apply.html" class="btn btn-accent" style="font-size: 0.75rem; padding: 6px 12px; background-color: var(--primary); color: white; border: none;">광고 신청</a>
    `;
  } else if (isLandingPage) {
    // 동적 랜딩 지면은 상단 광고 노출을 최소화하기 위해 비워둠
    ctaButtonsHTML = '';
  } else if (isGuidePage) {
    ctaButtonsHTML = `
      <a href="/apply.html" class="btn btn-accent" style="font-size: 0.75rem; padding: 6px 12px; background-color: var(--primary); color: white; border: none;">광고 신청</a>
    `;
  } else if (isApplyPage) {
    ctaButtonsHTML = `
      <a href="/guide.html" class="btn btn-outline" style="font-size: 0.75rem; padding: 6px 12px; border-color: var(--border-color); background-color: white; color: var(--text-dark);">광고 입점 안내</a>
    `;
  } else if (isAdminPage) {
    ctaButtonsHTML = `
      <span style="font-size: 0.7rem; background-color: #e67e22; color: white; padding: 3px 8px; border-radius: 4px; font-weight: bold; display: inline-block;">관리자</span>
    `;
  } else {
    // 기타 정책 지면 (policy.html 등)의 경우 기본 CTA 노출
    ctaButtonsHTML = `
      <a href="/guide.html" class="btn btn-outline" style="font-size: 0.75rem; padding: 6px 12px; border-color: var(--border-color); background-color: white; color: var(--text-dark);">광고 입점 안내</a>
    `;
  }

  container.innerHTML = `
    <header class="header" style="background-color: white; border-bottom: 1px solid var(--border-color); padding: 12px 16px; position: sticky; top: 0; z-index: 100; font-family: var(--font-family);">
      <div style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; max-width: 1200px; margin: 0 auto; gap: 12px; width: 100%;">
        
        <!-- 좌측: 로고 -->
        <div class="logo-area" style="display: flex; align-items: center;">
          <a href="/" class="logo" style="text-decoration: none; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 1.15rem; font-weight: 900; color: var(--primary);">📖 동네책자</span>
          </a>
        </div>

        <!-- 중앙: 브랜드 슬로건 (반응형 대응) -->
        <div class="slogan-area" style="justify-self: center; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 4px;">
          <div class="header-slogan" style="color: var(--text-dark); font-weight: 600; letter-spacing: -0.02em;">
            <style>
              .slogan-pc-text { display: inline; font-size: 0.95rem; }
              .slogan-mo-text { display: none; }
              .highlight-word-primary { color: var(--primary); font-weight: 700; }
              
              @media (max-width: 768px) {
                .slogan-pc-text { display: none; }
                .slogan-mo-text { display: inline; font-size: 0.8rem; color: var(--text-muted); }
              }
            </style>
            <span class="slogan-pc-text">우리 동네 업체, <span class="highlight-word-primary">한눈에</span> 찾고 <span class="highlight-word-primary">바로 문의</span></span>
            <span class="slogan-mo-text">우리 동네 업체 바로 찾기</span>
          </div>
        </div>

        <!-- 우측: 페이지별 대응 버튼 그룹 -->
        <div class="header-cta-group" style="display: flex; gap: 8px; justify-content: flex-end; align-items: center; min-width: 60px;">
          ${ctaButtonsHTML}
        </div>

      </div>
    </header>
  `;
}
