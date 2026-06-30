/**
 * ===================================================================================
 * [구글 앱스 스크립트 코드 스니펫 - Google Apps Script (GAS)]
 * ===================================================================================
 * 
 * [사용 방법]:
 * 1. Google Sheets(스프레드시트)를 생성합니다.
 * 2. 상단 메뉴에서 [확장 프로그램] > [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 지우고 본 스크립트 내용을 복사하여 붙여넣습니다.
 * 4. 아래 SLACK_WEBHOOK_URL 플레이스홀더에 실제 슬랙 웹훅 주소를 입력합니다.
 * 5. 우측 상단 [배포] > [새 배포]를 클릭합니다.
 *    - 유형: 웹 앱 (Web App)
 *    - 설명: 동네책자 광고 신청 폼 수신함
 *    - 웹 앱을 실행할 사용자: 나 (본인의 구글 계정)
 *    - 액세스 권한이 있는 사용자: 모든 사용자 (Anyone) - 외부 폼 전송을 위해 필수
 * 6. 배포가 완료되면 생성된 "웹 앱 URL"을 복사하여 apply.html 파일 내의 GOOGLE_SCRIPT_URL 상수에 넣어주세요.
 */

// 실제 연동 시 발급받은 슬랙 웹훅 주소를 기입하세요. (프론트엔드 코드에 노출하지 않으므로 안전함)
var SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/YOUR_REAL_SLACK_WEBHOOK_URL_HERE";

function doPost(e) {
  try {
    // 1. 수신 데이터 파싱
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    // 2. 스프레드시트 열기 (본 스크립트가 귀속된 현재 시트)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 첫 실행 시 헤더 세팅
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "제출일시", "업체명", "담당자명", "연락처", "업종", "원하는 지역", 
        "원하는 작업명", "희망 상품", "카카오톡 링크", "홈페이지 URL", 
        "블로그 URL", "인스타그램 URL", "사업자등록 여부", "추가 요청사항", "개인정보 동의 여부"
      ]);
    }
    
    // 3. 스프레드시트에 로우 추가
    sheet.appendRow([
      data.submittedAt,
      data.companyName,
      data.ownerName,
      data.phone,
      data.categoryName,
      data.targetRegion,
      data.targetWork,
      data.adProductName,
      data.kakaoLink || "미기재",
      data.homepageUrl || "미기재",
      data.blogUrl || "미기재",
      data.instaUrl || "미기재",
      data.hasBizLicense === "yes" ? "등록" : "미등록",
      data.additionalMessage || "없음",
      data.privacyConsent ? "동의함" : "동의안함"
    ]);
    
    // 4. 슬랙 채널 알림 발송 릴레이 호출
    sendSlackNotification(data);
    
    // 5. 성공 응답 리턴 (CORS 지원)
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Successfully saved to sheet and relayed to Slack." }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendSlackNotification(data) {
  if (!SLACK_WEBHOOK_URL || SLACK_WEBHOOK_URL.indexOf("YOUR_REAL_SLACK") !== -1) {
    return; // 플레이스홀더 상태면 발송 건너뜀
  }

  var payload = {
    "text": "🔔 *[동네책자] 신규 광고 입점 신청이 접수되었습니다!*",
    "attachments": [
      {
        "color": "#2563eb", // 메인 블루
        "fields": [
          { "title": "🏢 업체명", "value": data.companyName, "short": true },
          { "title": "👤 담당자", "value": data.ownerName, "short": true },
          { "title": "📞 연락처", "value": data.phone, "short": true },
          { "title": "🏷️ 신청 업종", "value": data.categoryName, "short": true },
          { "title": "📍 노출 지역", "value": data.targetRegion, "short": false },
          { "title": "🛠️ 노출 작업", "value": data.targetWork, "short": false },
          { "title": "💰 희망 플랜", "value": data.adProductName, "short": true },
          { "title": "💼 사업자여부", "value": data.hasBizLicense === "yes" ? "등록 사업자" : "미등록/상담 필요", "short": true },
          { "title": "💬 추가 문의", "value": data.additionalMessage || "없음", "short": false }
        ],
        "footer": "동네책자 수동 입점 관리 시스템 - 접수일: " + data.submittedAt
      }
    ]
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
}
