import fs from 'fs';
import path from 'path';
import { categories } from '../../data/categories.js';

// 1. 활성 카테고리 데이터 필터링
const activeCategories = categories.filter(c => c.visible !== false);

// 2. 지역 데이터 (예시 대상지 - 빌드타임 생성 대상)
const targetRegions = [
  { name: "서울 강남구" },
  { name: "서울 송파구" },
  { name: "경기 수원시 영통구" },
  { name: "경기 성남시" }
];

const templatePath = path.resolve(process.cwd(), 'landing.html');
const outputDir = path.resolve(process.cwd(), 'dist/seo-pages');

console.log("동적 SEO 페이지 빌드 타임 사전 생성 시작...");

// 폴더가 없으면 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 템플릿 파일 읽기
if (fs.existsSync(templatePath)) {
  const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  // 모든 지역 * 모든 활성 카테고리 조합에 대하여 HTML 정적 파일 생성
  targetRegions.forEach(region => {
    activeCategories.forEach(cat => {
      // SEO 친화적 URL/파일명 구조화
      const fileName = `${region.name.replace(' ', '-')}-${cat.id}.html`;
      const outputPath = path.join(outputDir, fileName);

      // 클라이언트 단에서 파라미터가 없어도 동작하도록, HTML 내용 일부 치환 주입 가능
      let customizedHtml = htmlTemplate
        .replace('[지역명]', region.name)
        .replace('[작업명]', cat.name)
        .replace('// 쿼리 파라미터에서 지역(reg) 및 업종(cat) 가져옴', `
          // 빌드 타임 사전 정의 데이터 강제 주입
          const regParam = "${region.name}";
          const catParam = "${cat.id}";
        `);

      fs.writeFileSync(outputPath, customizedHtml, 'utf-8');
    });
  });

  console.log(`성공: 총 ${targetRegions.length * activeCategories.length}개의 정적 SEO 랜딩 페이지가 생성되었습니다. (${outputDir})`);
} else {
  console.error("오류: landing.html 템플릿 파일을 찾을 수 없습니다.");
}
