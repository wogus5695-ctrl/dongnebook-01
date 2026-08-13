export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  const currentPath = window.location.pathname;
  const isAdminPage = currentPath.includes('hub.html'); // 관리자 지면

  let footerHTML = '';

  if (isAdminPage) {
    // 관리자 페이지용 초간소화 Footer
    footerHTML = `
      <footer class="site-footer" style="background-color: #f8f9fa; border-top: 1px solid var(--border-color); padding: 16px 0; font-family: var(--font-family);">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 16px; text-align: center;">
          <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">© 2026 동네책자 관리자 시스템. All rights reserved.</p>
        </div>
      </footer>
    `;
  } else {
    // 일반 서비스 페이지용 표준 Footer
    footerHTML = `
      <footer class="site-footer" style="background-color: #f8f9fa; border-top: 1px solid var(--border-color); padding: 40px 0; font-family: var(--font-family);">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
          
          <div class="footer-nav" style="display: flex; flex-wrap: wrap; gap: 40px; margin-bottom: 30px; justify-content: space-between;">
            
            <!-- 왼쪽 컬럼: 브랜드 정보 -->
            <div class="footer-section" style="flex: 1; min-width: 200px;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-dark); margin-bottom: 12px;">📖 동네책자</h4>
              <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
                우리 동네 우수 전문 업체를 구 단위 지역별로 한눈에 비교하고 다이렉트로 문의할 수 있는 투명한 광고 디렉토리 플랫폼입니다.
              </p>
            </div>

            <!-- 중간 컬럼: 카테고리 -->
            <div class="footer-section" style="flex: 1; min-width: 150px;">
              <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin-bottom: 12px;">서비스 카테고리</h4>
              <ul class="footer-links" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <li><a href="/hub.html?cat=general-cleaning" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none;">종합청소</a></li>
                <li><a href="/hub.html?cat=waterproof-leak" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none;">방수/누수</a></li>
                <li><a href="/hub.html?cat=window-caulking" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none;">창틀코킹/창틀누수</a></li>
              </ul>
            </div>

            <!-- 오른쪽 컬럼: 약관 및 규정 -->
            <div class="footer-section" style="flex: 1; min-width: 150px;">
              <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin-bottom: 12px;">약관 및 정책</h4>
              <ul class="footer-links" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <li><a href="/policy.html?tab=privacy" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none;">개인정보처리방침</a></li>
                <li><a href="/policy.html?tab=terms" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none;">이용약관</a></li>
                <li><a href="/policy.html?tab=ad-standards" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none;">광고 표시/입점 기준</a></li>
                <li><a href="/policy.html?tab=refund" style="font-size: 0.75rem; color: var(--text-muted); text-decoration: none;">환불/취소 안내</a></li>
              </ul>
            </div>

          </div>

          <!-- 하단: 카피라이트 및 책임 고지 -->
          <div class="footer-bottom" style="border-top: 1px solid var(--border-color); padding-top: 20px; font-size: 0.7rem; color: var(--text-muted); line-height: 1.6;">
            <p style="margin: 0 0 6px 0;">© 2026 동네책자. All rights reserved.</p>
            <p style="margin: 0;">
              동네책자는 통신판매중개자로서 광고 입점 업체의 정보 및 서비스 품질에 대하여 일체의 책임을 지지 않으며, 모든 거래는 고객과 업체 간의 직접 계약 및 협의로 진행됩니다.
            </p>
          </div>

        </div>
      </footer>
    `;
  }

  container.innerHTML = footerHTML;
}
