const SHEET_NAME = 'Transactions';

function doGet(e) {
  return handleResponse(getTransactions());
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const data = postData.data || {};
    
    if (action === 'ADD') {
      return handleResponse(addTransaction(data));
    } else if (action === 'UPDATE') {
      return handleResponse(updateTransaction(data));
    } else if (action === 'DELETE') {
      return handleResponse(deleteTransaction(data.id));
    } else {
      throw new Error('Invalid action');
    }
  } catch (error) {
    return handleError(error.message);
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['ID', 'Date', 'Type', 'Amount', 'Description', 'Reference', 'Proof Link', 'Created At', 'Updated At']);
    const now = new Date().toISOString();
    sheet.appendRow(['INV-001', '06-Apr-2026', 'Invest', 105000.00, 'Initial Investment', '', '', now, now]);
    sheet.appendRow(['PRO-001', '11-May-2026', 'Profit', 37187.89, 'First Profit', '', '', now, now]);
    sheet.appendRow(['INV-002', '06-Jun-2026', 'Invest', 30010.00, 'Second Investment', '', '', now, now]);
    sheet.appendRow(['PRO-002', '08-Jun-2026', 'Profit', 63816.16, 'Second Profit', '', '', now, now]);
    sheet.appendRow(['PRO-003', '16-Jul-2026', 'Profit', 56862.92, 'Third Profit', '', '', now, now]);
    sheet.appendRow(['PRO-004', '12-Aug-2026', 'Profit', 51454.92, 'Fourth Profit', '', '', now, now]);
    sheet.appendRow(['INV-003', '25-Aug-2026', 'Invest', 100010.00, 'Third Investment', '', '', now, now]);
  } else {
    // Check if Proof Link column exists, if not, append it
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (headers.indexOf('Proof Link') === -1) {
      // Find where to insert it (before Created At)
      let createdAtIndex = headers.indexOf('Created At');
      if (createdAtIndex !== -1) {
        sheet.insertColumnBefore(createdAtIndex + 1);
        sheet.getRange(1, createdAtIndex + 1).setValue('Proof Link');
      } else {
        // Just append to end
        sheet.getRange(1, sheet.getLastColumn() + 1).setValue('Proof Link');
      }
    }
  }
  return sheet;
}

function getTransactions() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const transactions = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
    }
    transactions.push(item);
  }
  return transactions;
}

function generateId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function addTransaction(data) {
  const sheet = getSheet();
  const headers = getHeaders(sheet);
  const idPrefix = data.Type === 'Invest' ? 'INV-' : 'PRO-';
  const id = idPrefix + generateId();
  const now = new Date().toISOString();
  
  const rowData = new Array(headers.length).fill('');
  
  const mappings = {
    'ID': id,
    'Date': data.Date,
    'Type': data.Type,
    'Amount': data.Amount,
    'Description': data.Description || '',
    'Reference': data.Reference || '',
    'Proof Link': data.Proof || '',
    'Created At': now,
    'Updated At': now
  };
  
  headers.forEach((header, index) => {
    if (mappings[header] !== undefined) {
      rowData[index] = mappings[header];
    }
  });
  
  sheet.appendRow(rowData);
  return { success: true, id: id };
}

function updateTransaction(data) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  
  const idIndex = headers.indexOf('ID');
  if (idIndex === -1) throw new Error('ID column not found in sheet');
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === data.id) {
      const now = new Date().toISOString();
      const mappings = {
        'Date': data.Date,
        'Type': data.Type,
        'Amount': data.Amount,
        'Description': data.Description || '',
        'Reference': data.Reference || '',
        'Proof Link': data.Proof || '',
        'Updated At': now
      };
      
      headers.forEach((header, index) => {
        if (mappings[header] !== undefined) {
          sheet.getRange(i + 1, index + 1).setValue(mappings[header]);
        }
      });
      
      return { success: true };
    }
  }
  throw new Error('Transaction not found');
}

function deleteTransaction(id) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  throw new Error('Transaction not found');
}

function handleResponse(response) {
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleError(error) {
  return ContentService.createTextOutput(JSON.stringify({ error: error }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}
