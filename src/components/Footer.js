export function renderFooter() {
  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-nav">
          <div class="footer-section">
            <h4>서비스 카테고리</h4>
            <ul class="footer-links">
              <li><a href="/hub.html?cat=general-cleaning">종합청소</a></li>
              <li><a href="/hub.html?cat=waterproof-leak">방수/누수</a></li>
              <li><a href="/hub.html?cat=window-caulking">창틀코킹/창틀누수</a></li>
              <li><a href="/hub.html?cat=drain-clog">하수구막힘</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>약관 및 정책</h4>
            <ul class="footer-links">
              <li><a href="/policy.html?tab=privacy">개인정보처리방침</a></li>
              <li><a href="/policy.html?tab=terms">이용약관</a></li>
              <li><a href="/policy.html?tab=ad-standards">광고 표시/입점 기준</a></li>
              <li><a href="/policy.html?tab=refund">환불/취소 안내</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 동네책자. All rights reserved.</p>
          <p style="margin-top: 8px; font-size: 0.75rem;">동네책자는 통신판매중개자로서 광고 입점 업체의 정보 및 서비스 품질에 대하여 일체의 책임을 지지 않으며, 모든 거래는 고객과 업체 간의 직접 계약으로 진행됩니다.</p>
        </div>
      </div>
    </footer>
  `;
  
  const container = document.getElementById('footer-container');
  if (container) {
    container.innerHTML = footerHTML;
  }
}
