export function renderHeader() {
  const headerHTML = `
    <header class="site-header">
      <div class="container header-container">
        <a href="/" class="logo">
          동네<span>책자</span>
        </a>
        <div class="header-actions">
          <a href="/guide.html" class="btn btn-outline header-btn" id="nav-guide-btn">광고 입점 안내</a>
          <a href="/apply.html" class="btn btn-accent header-btn" id="nav-apply-btn">광고 신청</a>
        </div>
      </div>
    </header>
  `;
  
  const container = document.getElementById('header-container');
  if (container) {
    container.innerHTML = headerHTML;
  }
}
