/**
 * Google Apps Script (GAS) Web App - 동네책자 광고 신청서 연동 및 관리 스크립트
 * 
 * [탑재 방법]:
 * 1. 관리용 Google Sheets를 생성합니다.
 * 2. 확장 프로그램 -> Apps Script를 클릭하여 편집기를 엽니다.
 * 3. 본 스크립트 파일 내용을 복사하여 붙여넣고 저장합니다.
 * 4. 우측 상단 '배포' -> '새 배포'를 누르고 유형을 '웹 앱'으로 지정합니다.
 * 5. 액세스 권한을 '모든 사용자(Anyone)'로 설정하여 배포 후 획득한 Web App URL을
 *    apply.html 내의 GOOGLE_SCRIPT_URL 변수에 대입합니다.
 */

// 관리자 알림을 받을 Slack Webhook URL (추후 슬랙 활성화 시 대입)
const SLACK_WEBHOOK_URL = ""; 

function doPost(e) {
  try {
    // 1. 전송 데이터 수집 및 파싱 (JSON 및 Form URL Encoding 포맷 상호 호환 보완)
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(jsErr) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }
    
    // 2. 관리 대상 Google Sheets 로드
    const sheetApp = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1번 탭: "광고 신청 접수" 시트 확인 및 자동 생성
    let receiptSheet = sheetApp.getSheetByName("광고 신청 접수");
    if (!receiptSheet) {
      receiptSheet = sheetApp.insertSheet("광고 신청 접수");
      
      // 시트가 처음 생성되었을 때 헤더(Header) 칼럼 빌드
      const headers = [
        // A ~ Q: apply.html 제출 데이터 (17개 컬럼)
        "제출일시", "업체명", "담당자명", "연락처", "선택 업종", 
        "희망 구 단위 지역", "희망 작업명", "선택 구좌명", "포함 동단위 지역 목록", "희망 상품", 
        "카카오톡 채널 링크", "홈페이지 URL", "네이버 블로그 URL", "인스타그램 URL", 
        "사업자등록 여부", "추가 요청사항", "개인정보 동의 여부",
        
        // R ~ AA: 운영 관리용 추가 컬럼 (10개 컬럼)
        "처리 상태", "상담일", "결제 안내 여부", "결제 완료 여부", 
        "등록 완료 여부", "등록된 대표 URL", "광고 시작일", "광고 종료일", "월 광고비", "운영자 메모",

        // AB ~ AJ: 신규 확장 요청 및 썸네일 이미지 컬럼 (9개 컬럼)
        "요청 유형", "기타 입력 업종명", "기타 입력 지역명", "신청 고유 ID", "썸네일 URL",
        "썸네일 스토리지 키", "썸네일 원본파일명", "썸네일 MIME타입", "썸네일 용량"
      ];
      receiptSheet.appendRow(headers);
      receiptSheet.getRange("1:1").setFontWeight("bold").setBackground("#f3f3f3");
    }

    // 3. 기록용 로우(Row) 생성 (17개 제출 데이터 + 10개 운영 컬럼 초기치 + 9개 확장 필드)
    const newRow = [
      data.submittedAt || new Date().toISOString(),
      data.companyName || "",
      data.ownerName || "",
      data.phone || "",
      data.categoryName || data.category || "",
      data.targetRegion || "",
      data.targetWork || "",
      data.adSlotName || "",
      data.coverageList ? (Array.isArray(data.coverageList) ? data.coverageList.join(", ") : data.coverageList) : "",
      data.adProductName || data.adProduct || "",
      data.kakaoLink || "",
      data.homepageUrl || "",
      data.blogUrl || "",
      data.instaUrl || "",
      data.hasBizLicense === "yes" ? "보유" : "무등록",
      data.additionalMessage || "",
      data.privacyConsent ? "동의함" : "미동의",
      
      // 운영 컬럼 초기 데이터 주입
      "신규 접수",  // 처리 상태 (옵션: 신규 접수, 상담 중, 결제 안내, 결제 완료, 등록 완료, 보류, 거절, 만료)
      "",           // 상담일
      "N",          // 결제 안내 여부
      "N",          // 결제 완료 여부
      "N",          // 등록 완료 여부
      "",           // 등록된 대표 URL
      "",           // 광고 시작일
      "",           // 광고 종료일
      "",           // 월 광고비
      "",           // 운영자 메모

      // AB ~ AJ: 신규 확장 컬럼 매핑
      data.requestType || "standard-slot",
      data.customCategoryName || "",
      data.customRegionName || "",
      data.submissionId || "",
      data.thumbnailUrl || "",
      data.thumbnailStorageKey || "",
      data.thumbnailOriginalName || "",
      data.thumbnailMimeType || "",
      data.thumbnailSize || ""
    ];
    
    // 시트에 새 라인 누적 기록
    receiptSheet.appendRow(newRow);
    
    // 4. 슬랙 알림 확장 지원 (SLACK_WEBHOOK_URL이 기입되었을 시 비동기 송출)
    if (SLACK_WEBHOOK_URL && SLACK_WEBHOOK_URL !== "") {
      sendSlackNotification(data);
    }
    
    // 5. 클라이언트에 성공 리턴 반환
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    // 예외 발생 시 에러 정보 로깅 및 실패 응답 반환
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 추후 Slack 알림 연동을 원할 때 활성화할 웹훅 연동 확장 함수
 */
function sendSlackNotification(data) {
  try {
    const coverageText = data.coverageList && data.coverageList.length > 0 
      ? data.coverageList.join(", ") 
      : "없음";

    const payload = {
      text: `📢 *동네책자 새로운 B2B 광고 신청이 접수되었습니다.*\n\n` +
            `• *업체명*: ${data.companyName}\n` +
            `• *담당자*: ${data.ownerName} (${data.phone})\n` +
            `• *신청 업종*: ${data.categoryName} (${data.targetWork})\n` +
            `• *선택 구좌*: *${data.adSlotName}*\n` +
            `• *하위 노출 동*: ${coverageText}\n` +
            `• *선택 상품*: ${data.adProductName}\n` +
            `• *추가 메시지*: ${data.additionalMessage || "없음"}\n` +
            `\n스프레드시트를 확인하여 상담 및 결제 안내를 진행해 주세요.`
    };
    
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
  } catch (err) {
    Logger.log("Slack Notification Error: " + err.toString());
  }
}
