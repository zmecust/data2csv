'use strict';

//--------------middleware.js---------------//

const data2csv = require('data2csv');

const double = (data, defaultValue) => {
  return data && (data+data) || defaultValue;
};

// 'method' is option
const fields = [
  { label: 'Code', value: 'code', method: double, default: '-' },
  { label: 'Name', value: 'name', default: '-' },
];

const handler = async (data, req, res) => {
  // data = [{}, {}, ...];
  // for ex. => data = [{ code: '123', name: 'name123' }, { code: '', name: 'name456' } ];
  const csv = data2csv.convertJsonToCSV(data, fields);

  // newData = 'Code,Name\n123123,name123\n-,name456\n'
  // Code   Name
  // 123123 name123
  // -      name456

  const filename = 'the export csv file name you want to call';

  return { csv, filename };
};

module.exports = data2csv.mw(handler);

//-----------------app.js------------------//

// app.use(require('./middleware.js'));
