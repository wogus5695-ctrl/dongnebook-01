export function renderHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;

  const currentPath = window.location.pathname;
  
  // 1. 소비자 중심 적용 대상 페이지 판독 (landing.html, hub.html)
  const isConsumerPage = currentPath.includes('landing.html') || currentPath.includes('hub.html');

  if (isConsumerPage) {
    // [소비자용 Header 구조]: 3분할 믹스 정렬 (좌: 로고 / 중: 슬로건 / 우: 여백)
    container.innerHTML = `
      <header class="header" style="background-color: white; border-bottom: 1px solid var(--border-color); padding: 12px 16px; position: sticky; top: 0; z-index: 100;">
        <div class="header-consumer-grid" style="display: grid; grid-template-columns: 1fr; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0; gap: 8px;">
          
          <!-- 좌측: 로고 (통일성 유지) -->
          <div class="logo-area" style="justify-self: center;">
            <a href="/" class="logo" style="text-decoration: none; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 1.15rem; font-weight: 900; color: var(--primary);">📖 동네책자</span>
              <span style="font-size: 0.7rem; background-color: var(--primary-light); color: var(--primary); padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid var(--border-color);">로컬매칭</span>
            </a>
          </div>

          <!-- 중앙: 슬로건 배치 (핵심 단어 한눈에 / 바로 문의 컬러 강조 처리) -->
          <div class="slogan-area" style="justify-self: center; text-align: center;">
            <div class="header-slogan" style="color: var(--text-dark); font-size: 1.1rem; font-weight: 600; font-family: var(--font-family); letter-spacing: -0.02em;">
              <span class="slogan-pc">우리 동네 업체, <span class="highlight-word" style="color: var(--primary); font-weight: 700;">한눈에</span> 찾고 <span class="highlight-word" style="color: var(--primary); font-weight: 700;">바로 문의</span></span>
              <span class="slogan-mo" style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">우리 동네 업체 바로 찾기</span>
            </div>
          </div>

          <!-- 우측: 대칭 빈 영역 (PC 그리드 확보용) -->
          <div class="dummy-area" style="display: none;"></div>

        </div>
      </header>
    `;
  } else {
    // [B2B용 Header 구조]: 기존 광고 CTA 버튼 정렬 방식 및 메인 유지
    container.innerHTML = `
      <header class="header" style="background-color: white; border-bottom: 1px solid var(--border-color); padding: 12px 16px; position: sticky; top: 0; z-index: 100;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0;">
          
          <a href="/" class="logo" style="text-decoration: none; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 1.15rem; font-weight: 900; color: var(--primary);">📖 동네책자</span>
            <span style="font-size: 0.7rem; background-color: var(--primary-light); color: var(--primary); padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid var(--border-color);">로컬매칭</span>
          </a>

          <div class="header-cta-group" style="display: flex; gap: 8px;">
            <a href="/guide.html" class="btn btn-outline" style="font-size: 0.75rem; padding: 6px 12px; border-color: var(--border-color); background-color: white;">광고 입점 안내</a>
            <a href="/apply.html" class="btn btn-primary" style="font-size: 0.75rem; padding: 6px 12px;">광고 신청</a>
          </div>

        </div>
      </header>
    `;
  }
}
