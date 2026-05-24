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
    ? `We can't wait to celebrate with you! | Shalom & Samuel · July 3, 2026`
    : `We're so glad you'll be joining us virtually! | Shalom & Samuel · July 3, 2026`;

  const html = attending ? buildAttendingEmail(name) : buildVirtualEmail(name);

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
        <div style="font-size:28px;color:#d4bc94;font-weight:300;letter-spacing:4px;line-height:1;">Shalom &amp; Samuel</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:4px;text-transform:uppercase;margin-top:10px;">July 3, 2026</div>
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

        <!-- Registry -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ede5d8;border-radius:2px;margin-bottom:32px;">
          <tr><td style="padding:28px 36px;text-align:center;">
            <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8a7d6e;margin:0 0 12px;">Wedding Registry</p>
            <p style="font-size:15px;color:#3a2e22;line-height:1.75;margin:0 0 6px;">
              Your presence is the greatest gift of all. For those who wish to honour us with a gift, we have set up a registry on Amazon under:
            </p>
            <p style="font-size:15px;font-style:italic;color:#1e1812;margin:0 0 20px;">
              Shalom Boogbaa Lebe &amp; Samuel Adamolekun
            </p>
            <a href="https://www.amazon.ca/wedding/guest-view/I6N7JWR3DRRT"
               style="display:inline-block;padding:12px 32px;background:#1e1812;color:#d4bc94;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;font-family:Arial,sans-serif;margin-bottom:14px;">
              View Our Registry
            </a>
            <p style="font-size:12px;color:#8a7d6e;margin:0;word-break:break-all;">
              https://www.amazon.ca/wedding/guest-view/I6N7JWR3DRRT
            </p>
          </td></tr>
        </table>

        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 36px;text-align:left;">
          Looking forward to celebrating with you!
        </p>

        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 36px;text-align:left;">
          With love,<br>
          <span style="font-style:italic;color:#1e1812;">Shalom &amp; Samuel</span>
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

function buildVirtualEmail(name) {
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
        <div style="font-size:28px;color:#d4bc94;font-weight:300;letter-spacing:4px;line-height:1;">Shalom &amp; Samuel</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:4px;text-transform:uppercase;margin-top:10px;">July 3, 2026</div>
      </td>
    </tr>

    <!-- Gold rule -->
    <tr><td style="background:#b89a6a;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>

    <!-- Body -->
    <tr>
      <td style="background:#f7f2eb;padding:52px 48px 44px;text-align:center;">
        <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#b89a6a;margin:0 0 20px;">Joining Virtually</p>
        <h1 style="font-size:38px;font-weight:300;color:#1e1812;margin:0 0 20px;line-height:1.15;">We're so glad you'll be with us, ${name}!</h1>
        <table width="40" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 28px;">
          <tr><td style="background:#b89a6a;height:1px;font-size:0;">&nbsp;</td></tr>
        </table>

        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 20px;text-align:left;">
          Hi ${name},
        </p>
        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 20px;text-align:left;">
          Thank you so much for celebrating with us virtually. Your presence and support means a lot to us, and we're truly grateful that you'll be sharing this special moment with us even from afar.
        </p>
        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 20px;text-align:left;">
          We're looking forward to having you join us and sharing the joy, love, and memories together. More details regarding the virtual ceremony access will be shared closer to the date.
        </p>
        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 32px;text-align:left;">
          We can't wait to celebrate with you.
        </p>

        <!-- Registry -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ede5d8;border-radius:2px;margin-bottom:32px;">
          <tr><td style="padding:28px 36px;text-align:center;">
            <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8a7d6e;margin:0 0 12px;">Wedding Registry</p>
            <p style="font-size:15px;color:#3a2e22;line-height:1.75;margin:0 0 6px;">
              Your presence is the greatest gift of all. For those who wish to honour us with a gift, we have set up a registry on Amazon under:
            </p>
            <p style="font-size:15px;font-style:italic;color:#1e1812;margin:0 0 20px;">
              Shalom Boogbaa Lebe &amp; Samuel Adamolekun
            </p>
            <a href="https://www.amazon.ca/wedding/guest-view/I6N7JWR3DRRT"
               style="display:inline-block;padding:12px 32px;background:#1e1812;color:#d4bc94;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;font-family:Arial,sans-serif;margin-bottom:14px;">
              View Our Registry
            </a>
            <p style="font-size:12px;color:#8a7d6e;margin:0;word-break:break-all;">
              https://www.amazon.ca/wedding/guest-view/I6N7JWR3DRRT
            </p>
          </td></tr>
        </table>

        <p style="font-size:16px;color:#3a2e22;line-height:1.85;margin:0 0 36px;text-align:left;">
          With love and appreciation,<br>
          <span style="font-style:italic;color:#1e1812;">Shalom &amp; Samuel</span>
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
