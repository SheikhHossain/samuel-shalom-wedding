// ─────────────────────────────────────────────────────────────
//  Samuel & Shalom Wedding — RSVP Google Apps Script
//
//  Setup steps:
//  1. Open Google Sheets → create a new blank spreadsheet
//     and name it "Samuel & Shalom RSVPs"
//  2. Click Extensions → Apps Script
//  3. Delete any existing code and paste ALL of this file
//  4. Click Save (floppy disk icon)
//  5. Click Deploy → New deployment
//       • Type: Web app
//       • Execute as: Me
//       • Who has access: Anyone
//  6. Click Deploy → copy the Web App URL
//  7. In index.html, replace PASTE_YOUR_SCRIPT_URL_HERE
//     with the copied URL
// ─────────────────────────────────────────────────────────────

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Write header row on first submission
  if (sheet.getLastRow() === 0) {
    const headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Attending', 'Guests', 'Dietary / Notes'];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1e1812').setFontColor('#d4bc94');
    sheet.setFrozenRows(1);
  }

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter;
  }

  sheet.appendRow([
    new Date().toLocaleString('en-CA'),
    data.firstName  || '',
    data.lastName   || '',
    data.email      || '',
    data.attending === 'yes' ? 'Attending' : 'Declining',
    data.guests     || '',
    data.dietary    || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
