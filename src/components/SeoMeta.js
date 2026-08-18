/**
 * SEO 메타데이터 동적 설정 헬퍼
 */
export function updateSeoMeta({ title, description, h1Text, canonical, ogTitle, ogDescription, ogUrl, ogImage, noindex }) {
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

  if (canonical) {
    let canonLink = document.querySelector("link[rel='canonical']");
    if (!canonLink) {
      canonLink = document.createElement('link');
      canonLink.rel = 'canonical';
      document.head.appendChild(canonLink);
    }
    canonLink.href = canonical;
  }

  // Open Graph 태그 주입
  const ogMappings = [
    { selector: "meta[property='og:title']", attr: "content", value: ogTitle || title },
    { selector: "meta[property='og:description']", attr: "content", value: ogDescription || description },
    { selector: "meta[property='og:url']", attr: "content", value: ogUrl || canonical },
    { selector: "meta[property='og:image']", attr: "content", value: ogImage }
  ];

  ogMappings.forEach(mapping => {
    if (mapping.value) {
      let metaNode = document.querySelector(mapping.selector);
      if (!metaNode) {
        metaNode = document.createElement('meta');
        const parts = mapping.selector.match(/property='(.*?)'/);
        if (parts && parts[1]) {
          metaNode.setAttribute('property', parts[1]);
        }
        document.head.appendChild(metaNode);
      }
      metaNode.setAttribute(mapping.attr, mapping.value);
    }
  });

  // noindex 처리 토글
  let robotsNode = document.querySelector("meta[name='robots']");
  if (noindex) {
    if (!robotsNode) {
      robotsNode = document.createElement('meta');
      robotsNode.name = 'robots';
      document.head.appendChild(robotsNode);
    }
    robotsNode.content = "noindex, nofollow";
  } else {
    if (robotsNode) {
      robotsNode.content = "index, follow";
    }
  }
}
