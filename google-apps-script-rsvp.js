/**
 * Google Apps Script for Wedding Invitation RSVP
 *
 * How to use:
 * 1. Open Google Sheets (create a new sheet e.g. "Wedding RSVPs").
 * 2. Add header row: Timestamp | Slug | Name | Attending | Guests | Message | Dietary
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this code, save, then click Deploy > New Deployment.
 * 5. Select "Web app", Execute as: "Me", Who has access: "Anyone".
 * 6. Copy the Web app URL and paste it into src/invitations/<slug>.json under rsvp.endpoint.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.slug || '',
      data.name || '',
      data.attending ? 'Yes' : 'No',
      data.guests || 1,
      data.message || '',
      data.dietary || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
