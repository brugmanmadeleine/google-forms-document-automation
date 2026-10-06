# Google Forms Document Automation

A Google Apps Script that turns Google Form response data in a linked spreadsheet into personalized Google Docs and PDFs, then organizes the generated files in Google Drive.

I built this automation to reduce repetitive document preparation. This portfolio version uses a generic event template and fictional participant data.

## Features

- Reads participant names, event dates, and locations from Google Sheets.
- Creates a copy of a Google Docs template for each participant.
- Replaces template placeholders with spreadsheet values.
- Finds or creates folders for Google Docs and PDF outputs.
- Skips records when a document with the same generated filename already exists.
- Adds an **Automation** menu to the spreadsheet for manual execution.

## Example Files

The `examples/` folder contains:

- `sample-data.csv` — fictional participant data.
- `template.pdf` — a preview of the document template.
- `sample-output.pdf` — an example generated document.
- `generated-files.png` — a screenshot of the generated files in Google Drive.

## Setup

1. Create a Google Sheet or use a spreadsheet linked to a Google Form.
2. Add these exact column headers:

   | First Name | Last Name | Event Date | Location |
   |---|---|---|---|
   | John | Public | 2026-08-04 | Sample Location |

3. Create a Google Docs template containing these exact placeholders:

   ```text
   Name: {{Name}}
   Event Date: {{Event Date}}
   Location: {{Location}}
   ```

   The included template PDF is a preview; the script requires a Google Docs template.

4. In the spreadsheet, open **Extensions → Apps Script** and paste the contents of `Code.gs`.
5. Replace `YOUR_TEMPLATE_ID` with your Google Docs template ID—the value between `/d/` and `/edit` in its URL.
6. Save the script, select the tab containing your response data, and run `generateCredentialCards`. Approve the requested Google permissions.
7. Check the **Generated Documents** folder in Google Drive for the **Docs** and **PDFs** subfolders.

Reloading the spreadsheet makes the custom **Automation** menu available.

## Automatic Execution

The script can be configured to run after each Google Form submission using an installable **From spreadsheet → On form submit** trigger.

Before using it in the background, remove the final `SpreadsheetApp.getUi().alert(...)` call and explicitly select the response sheet in the code rather than relying on the active tab.

## Current Limitations

- Each run checks all rows in the selected sheet.
- Duplicate detection uses the generated document filename.
- Existing documents are skipped rather than updated.
- If a run creates a Google Doc but fails before creating its PDF, the existing Doc must be removed before retrying that record.

## Privacy

All participant data included in this repository is fictional. The public code uses a placeholder template ID and contains no private form responses or organization-specific credentials.

## Built With

JavaScript and Google Apps Script, using Google Sheets, Google Docs, and Google Drive services.
