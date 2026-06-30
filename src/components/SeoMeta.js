/**
 * SEO 메타데이터 동적 설정 헬퍼
 * 검색 엔진이 HTML을 읽을 수 있도록 각 물리적 페이지에 직접 하드코딩되거나,
 * 빌드/렌더링 시 최상위 헤더에서 동적으로 주입됩니다.
 */
export function updateSeoMeta({ title, description, h1Text }) {
  if (title) {
    document.title = title;
  }
  
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }

  if (h1Text) {
    const h1Element = document.querySelector('h1');
    if (h1Element) {
      h1Element.textContent = h1Text;
    }
  }
}
