function generateCredentialCards() {
 //Template doc ID. This retrieves a copy of the template with unique placeholders (such as {{Name}}).
 const YOUR_TEMPLATE_ID = '1IL1ihhh_xxXGEnUS4Dal-GcC8dTV2T0PHzBn7KRZAN0';


 // creates names of master folder which holds a folder of docs and a separate folder for PDFs
 // the names inside the quotations CAN BE CHANGED depending on what you're creating the pdfs for
 const masterFolderName = "Generated Credential Documents";
 const docFolderName = "Docs";
 const pdfFolderName = "PDFs";
  let masterFolder;
 let docFolder, pdfFolder;
  // finds master folder anywhere in Drive
 const masterFolderSearch = DriveApp.getFoldersByName(masterFolderName);
 if (masterFolderSearch.hasNext()) {
   masterFolder = masterFolderSearch.next();
 } else {
   // safety fallback: if it doesn't find it, it creates it in your root Drive
   masterFolder = DriveApp.createFolder(masterFolderName);
 }


 // locates or creates the Docs subfolder directly INSIDE the master folder
 const docFolderSearch = masterFolder.getFoldersByName(docFolderName);
 if (docFolderSearch.hasNext()) {
   docFolder = docFolderSearch.next();
 } else {
   docFolder = masterFolder.createFolder(docFolderName);
 }
  // locates or creates the PDFs subfolder directly INSIDE the master folder
 const pdfFolderSearch = masterFolder.getFoldersByName(pdfFolderName);
 if (pdfFolderSearch.hasNext()) {
   pdfFolder = pdfFolderSearch.next();
 } else {
   pdfFolder = masterFolder.createFolder(pdfFolderName);
 }


 // opens the Google Spreadsheet to access the data (expected to be a spreadsheet from a Google Form)
 const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 const data = sheet.getDataRange().getValues();


 // extract headers and rows
 const headers = data[0];
 const rows = data.slice(1);


 // finds column indices based on headers; these CAN BE CHANGED but must match the headers of the spreadsheet!
 const firstNameIdx = headers.indexOf('First Name');
 const lastNameIdx = headers.indexOf('Last Name');
 const eventDateIdx = headers.indexOf('Event Date'); // make sure the date is a standard regular date object in the sheet (see lines 66-70)
 const locationIdx = headers.indexOf('Location');


 //gets the template file
 const templateFile = DriveApp.getFileById(YOUR_TEMPLATE_ID);


 //loops through each row of data
 rows.forEach((row, index) => {
   //skip rows that are empty
   if(!row[firstNameIdx]) return;


   const firstName = row[firstNameIdx];
   const lastName = row[lastNameIdx];
   const fullName = `${firstName} ${lastName}`;
   const location = row[locationIdx];


   // format date (assuming it's a standard regular date object in sheets)
   let eventDate = row[eventDateIdx];
   if(eventDate instanceof Date){
     eventDate = Utilities.formatDate(eventDate, Session.getScriptTimeZone(), "MMMM dd, yyyy");
   }


   // define the file names exactly how they are saved. // these names CAN BE CHANGED but must follow JavaScript!
   const docName = `Event Document - ${fullName} (${location})`;
   const pdfName = `${lastName}_${location.replace(/\s+/g, '')}.pdf`; // pdf name format is lastName_location without any whitespace


   // checks for duplicates
   const existingDocs = docFolder.getFilesByName(docName);
   if(existingDocs.hasNext()) {
     Logger.log(`Skipping duplicate: Google Doc for ${fullName} already exists.`);
     return; // "backtracks" and skips to the next row
   }


   // create a copy of the template file, put inside the Google Docs folder
   const copiedFile = templateFile.makeCopy(docName, docFolder);
   const copiedDocId = copiedFile.getId();


   // open the copied document and replace placeholders
   const doc = DocumentApp.openById(copiedDocId);
   const body = doc.getBody();


   body.replaceText('\\{\\{Name\\}\\}', fullName);
   body.replaceText('\\{\\{Event Date\\}\\}', String(eventDate));
   body.replaceText('\\{\\{Location\\}\\}', String(location));


   // bold the newly inserted name
   const nameElement = body.findText(fullName);
   if(nameElement){
     nameElement.getElement().setBold(true);
     }


   // bold newly inserted election day date
   const dateElement = body.findText(eventDate);
   if(dateElement){
     dateElement.getElement().setBold(true);
     }


   // save and close new doc
   doc.saveAndClose();


   // convert the updated Google Doc into a PDF and save it in the PDF folder
   const pdfBlob = copiedFile.getAs('application/pdf');
   pdfBlob.setName(pdfName); // sets pdf filename
   pdfFolder.createFile(pdfBlob);


   Logger.log(`Created document for ${fullName}`);
 });


 SpreadsheetApp.getUi().alert('Finished generating credential cards!');
 }


 // adds a custom menu from the sheet to run the script easily
 function onOpen() {
   const ui = SpreadsheetApp.getUi();
   ui.createMenu('Automation')
   .addItem('Generate Cards', 'generateCredentialCards')
   .addToUi();
 }
