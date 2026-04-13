/**
 * Google Apps Script - Sensor API (Insert + Get Data)
 * Sheet: DataSensor
 * Kolom: [waktu, adc, kelembaban, status]
 */
function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var mode = (params.mode || '').toLowerCase();

  var hasInput = params.adc !== undefined || params.kelembaban !== undefined || params.status !== undefined;

  if (mode === 'insert' || hasInput) {
    return insertData_(params);
  }

  return getData_();
}

function insertData_(params) {
  var sheet = getSheet_();
  var waktu = new Date();
  var adc = params.adc || '';
  var kelembaban = params.kelembaban || '';
  var status = (params.status || 'unknown').toLowerCase();

  sheet.appendRow([waktu, adc, kelembaban, status]);

  return jsonOutput_({
    success: true,
    mode: 'insert',
    message: 'Data berhasil disimpan',
    inserted: {
      waktu: waktu.toISOString(),
      adc: adc,
      kelembaban: kelembaban,
      status: status,
    },
  });
}

function getData_() {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();

  // Jika baris pertama adalah header, lewati otomatis.
  var startRow = 0;
  if (values.length > 0) {
    var firstRow = values[0].map(String).map(function(v){ return v.toLowerCase(); });
    if (firstRow.indexOf('waktu') !== -1) startRow = 1;
  }

  var data = [];
  for (var i = startRow; i < values.length; i++) {
    var row = values[i];
    if (!row[0] && !row[1] && !row[2] && !row[3]) continue;

    data.push({
      waktu: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
      adc: Number(row[1]) || 0,
      kelembaban: Number(row[2]) || 0,
      status: String(row[3] || 'unknown').toLowerCase(),
    });
  }

  data.sort(function(a, b) {
    return new Date(b.waktu).getTime() - new Date(a.waktu).getTime();
  });

  return jsonOutput_({
    success: true,
    mode: 'getData',
    meta: {
      total: data.length,
      generatedAt: new Date().toISOString(),
      sheet: 'DataSensor',
    },
    data: data,
  });
}

function getSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('DataSensor');

  if (!sheet) {
    sheet = spreadsheet.insertSheet('DataSensor');
    sheet.appendRow(['waktu', 'adc', 'kelembaban', 'status']);
  }

  return sheet;
}

function jsonOutput_(obj) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
