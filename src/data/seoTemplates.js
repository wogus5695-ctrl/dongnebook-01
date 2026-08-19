import { categories, resolveSeoTemplate as resolvedHelper } from './categories.js';

// 하위 호환성 준수를 위한 seoTemplates 매핑 동적 생성
export const seoTemplates = {};
categories.forEach(c => {
  if (c.seoTemplate) {
    seoTemplates[c.id] = c.seoTemplate;
  }
});

export const resolveSeoTemplate = resolvedHelper;
