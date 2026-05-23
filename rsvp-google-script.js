// ─────────────────────────────────────────────────────────────
//  Samuel & Shalom Wedding — RSVP Google Apps Script
//
//  Setup steps:
//  1. Log into Google with samueladamolekun@gmail.com
//  2. Open Google Sheets → create a new blank spreadsheet
//     and name it "Samuel & Shalom RSVPs"
//  3. Click Extensions → Apps Script
//  4. Delete any existing code and paste ALL of this file
//  5. Click Save (floppy disk icon)
//  6. Click Deploy → New deployment
//       • Type: Web app
//       • Execute as: Me
//       • Who has access: Anyone
//  7. Click Deploy → authorise when prompted (this grants
//     permission to write to Sheets and send Gmail)
//  8. Copy the Web App URL
//  9. In index.html, replace PASTE_YOUR_SCRIPT_URL_HERE
//     with the copied URL
//
//  Emails will be sent FROM samueladamolekun@gmail.com
//  because the script runs as that logged-in account.
// ─────────────────────────────────────────────────────────────

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Write header row on first submission
  if (sheet.getLastRow() === 0) {
    const headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Attending', 'Guests', 'Dietary / Notes'];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#1e1812')
      .setFontColor('#d4bc94');
    sheet.setFrozenRows(1);
  }

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter;
  }

  const attending = data.attending === 'yes';

  sheet.appendRow([
    new Date().toLocaleString('en-CA'),
    data.firstName || '',
    data.lastName  || '',
    data.email     || '',
    attending ? 'Attending' : 'Declining',
    data.guests    || '',
    data.dietary   || ''
  ]);

  if (data.email) {
    sendConfirmationEmail(data, attending);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendConfirmationEmail(data, attending) {
  const name = data.firstName || 'Friend';

  const subject = attending
    ? `We can't wait to celebrate with you! | Samuel & Shalom · July 3, 2026`
    : `We'll miss you | Samuel & Shalom · July 3, 2026`;

  const html = attending ? buildAttendingEmail(name) : buildDecliningEmail(name);

  GmailApp.sendEmail(data.email, subject, '', {
    htmlBody: html,
    name: 'Samuel & Shalom'
  });
}

function buildAttendingEmail(name) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:40px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- Header -->
    <tr>
      <td style="background:#1e1812;padding:44px 40px 36px;text-align:center;">
        <div style="font-size:38px;color:#d4bc94;font-weight:300;letter-spacing:6px;line-height:1;">S &amp; S</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:4px;text-transform:uppercase;margin-top:10px;">Samuel &amp; Shalom</div>
      </td>
    </tr>

    <!-- Gold rule -->
    <tr><td style="background:#b89a6a;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>

    <!-- Body -->
    <tr>
      <td style="background:#f7f2eb;padding:52px 48px 44px;text-align:center;">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#b89a6a;margin:0 0 20px;">RSVP Confirmed</p>
        <h1 style="font-size:38px;font-weight:300;color:#1e1812;margin:0 0 20px;line-height:1.15;">Thank you, ${name}!</h1>
        <table width="40" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 28px;">
          <tr><td style="background:#b89a6a;height:1px;font-size:0;">&nbsp;</td></tr>
        </table>

        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 20px;text-align:left;">
          Hi ${name},
        </p>
        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 20px;text-align:left;">
          Thank you so much for your RSVP. We're so excited to celebrate this special day with you. It means a lot to us to have you there, and we can't wait to share the moment together.
        </p>
        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 20px;text-align:left;">
          As the date gets closer, we'll send along any additional details you might need. In the meantime, be kindly reminded that the wedding is by invite only — please do not share the link except if you're adding a guest to RSVP. If you have any questions, feel free to reach out anytime.
        </p>
        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 36px;text-align:left;">
          Looking forward to celebrating with you!
        </p>

        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 36px;text-align:left;">
          With love,<br>
          <span style="font-style:italic;color:#1e1812;">Samuel &amp; Shalom</span>
        </p>

        <p style="font-size:15px;color:#8a7d6e;font-style:italic;line-height:1.85;margin:0;text-align:center;">
          "He who finds a wife finds a good thing,<br>and obtains favor from the <span style="font-variant:small-caps;">Lord</span>."<br>
          <span style="font-size:12px;letter-spacing:2px;font-style:normal;text-transform:uppercase;">Proverbs 18:22 · NKJV</span>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#1e1812;padding:28px 40px;text-align:center;">
        <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8a7d6e;margin:0;">
          July 3, 2026 &nbsp;·&nbsp; Winnipeg, Manitoba
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}

function buildDecliningEmail(name) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:40px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- Header -->
    <tr>
      <td style="background:#1e1812;padding:44px 40px 36px;text-align:center;">
        <div style="font-size:38px;color:#d4bc94;font-weight:300;letter-spacing:6px;line-height:1;">S &amp; S</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:4px;text-transform:uppercase;margin-top:10px;">Samuel &amp; Shalom</div>
      </td>
    </tr>

    <!-- Gold rule -->
    <tr><td style="background:#b89a6a;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>

    <!-- Body -->
    <tr>
      <td style="background:#f7f2eb;padding:52px 48px 44px;text-align:center;">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#b89a6a;margin:0 0 20px;">RSVP Received</p>
        <h1 style="font-size:38px;font-weight:300;color:#1e1812;margin:0 0 20px;line-height:1.15;">We'll miss you, ${name}.</h1>
        <table width="40" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 28px;">
          <tr><td style="background:#b89a6a;height:1px;font-size:0;">&nbsp;</td></tr>
        </table>
        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 36px;">
          We're sorry you won't be able to join us, but we completely understand. Thank you so much for letting us know — you will be in our hearts and prayers on our special day.
        </p>
        <p style="font-size:15px;color:#8a7d6e;font-style:italic;line-height:1.85;margin:0;">
          "He who finds a wife finds a good thing,<br>and obtains favor from the <span style="font-variant:small-caps;">Lord</span>."<br>
          <span style="font-size:12px;letter-spacing:2px;font-style:normal;text-transform:uppercase;">Proverbs 18:22 · NKJV</span>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#1e1812;padding:28px 40px;text-align:center;">
        <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8a7d6e;margin:0;">
          July 3, 2026 &nbsp;·&nbsp; Winnipeg, Manitoba
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}
