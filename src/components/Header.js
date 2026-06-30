export function renderHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;

  const currentPath = window.location.pathname;
  
  // 1. 소비자 중심 적용 대상 페이지 판독 (landing.html, hub.html)
  const isConsumerPage = currentPath.includes('landing.html') || currentPath.includes('hub.html');

  let rightMenuHTML = '';

  if (isConsumerPage) {
    // 소비자 슬로건 적용 (버튼처럼 보이지 않도록 텍스트형으로 표시)
    rightMenuHTML = `
      <div class="header-slogan" style="color: var(--text-muted); font-size: 0.85rem; font-weight: 700; text-align: right;">
        <span class="slogan-pc">우리 동네 업체, 한눈에 찾고 바로 문의</span>
        <span class="slogan-mo">우리 동네 업체 바로 찾기</span>
      </div>
    `;
  } else {
    // guide.html, apply.html 및 메인(index.html)에서는 기존 광고 B2B CTA 렌더링 유지
    rightMenuHTML = `
      <div class="header-cta-group" style="display: flex; gap: 8px;">
        <a href="/guide.html" class="btn btn-outline" style="font-size: 0.75rem; padding: 6px 12px; border-color: var(--border-color); background-color: white;">광고 입점 안내</a>
        <a href="/apply.html" class="btn btn-primary" style="font-size: 0.75rem; padding: 6px 12px;">광고 신청</a>
      </div>
    `;
  }

  container.innerHTML = `
    <header class="header" style="background-color: white; border-bottom: 1px solid var(--border-color); padding: 12px 16px; position: sticky; top: 0; z-index: 100;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0;">
        
        <!-- 로고 (기존 통일성 디자인 유지) -->
        <a href="/" class="logo" style="text-decoration: none; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 1.15rem; font-weight: 900; color: var(--primary);">📖 동네책자</span>
          <span style="font-size: 0.7rem; background-color: var(--primary-light); color: var(--primary); padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid var(--border-color);">로컬매칭</span>
        </a>

        <!-- 우측 메뉴 구역 (동적 분기) -->
        ${rightMenuHTML}

      </div>
    </header>
  `;
}
