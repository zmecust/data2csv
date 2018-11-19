# data2csv &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zmecust/data2csv/blob/master/LICENSE) [![Build Status](https://travis-ci.org/zmecust/data2csv.svg)](https://travis-ci.org/zmecust/data2csv) [![npm version](https://badge.fury.io/js/data2csv.svg)](https://badge.fury.io/js/data2csv)

Middleware for export data list to csv file.

If you have a api for getting data lists, but if you want to export these data lists to csv file, then only one thing you can do is to using this middleware package, but no need to refactor your api code.


## Getting started

    $ npm install data2csv --save


## Usage

First, you neend to set request headers: 'Accept' to 'text/csv', but not to 'application/json'.

and then add middleware
````javascript
'use strict';

const data2csv = require('data2csv');

const double = (data, defaultValue) => {
  return data && (data+data) || defaultValue;
};

// 'method' is option attribute
const fields = [
  { label: 'Code', value: 'code', method: double, default: '-' },
  { label: 'Name', value: 'name', default: '-' }
];

const handler = async (data, req, res) => {
  // data = [{}, {}, ...];
  // for ex. => data = [{ code: '123', name: 'name123' }, { code: '', name: 'name456' } ];
  const csv = data2csv.convertJsonToCSV(data, fields);

  // csv = 'Code,Name\n123123,name123\n-,name456\n'
  // Code   Name
  // 123123 name123
  // -      name456

  const filename = 'the export csv file name you want to call';

  return { csv, filename };
};

module.exports = data2csv.mw(handler);
````

then add middleware to your `app.js` file (before the route handling middleware)
````javascript
app.use(require('./middleware.js'));
````

# Contact

If you have any questions, please contact me **`root@laravue.org`**

# License
The MIT license
