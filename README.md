[![Build Status](https://travis-ci.org/zmecust/data2csv.svg)](https://travis-ci.org/zmecust/data2csv) [![npm version](https://www.npmjs.com/package/data2csv.svg)](https://www.npmjs.com/package/data2csv)

# data-to-csv

Middleware for export data list to csv file.

If you have a api for getting data lists, but if you want to export these data lists to csv file, then only one thing you can do is to using this middleware package, but on need to refactor your api code.


## Getting started

    $ npm install data2csv --save


## Usage

First, you neend to set request headers: 'Accept' to 'text/csv', but not to 'application/json'.

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
  const newData = data2csv.convertJsonToCSV(data, fields);

  // newData = 'Code,Name\n123123,name123\n-,name456\n'
  // Code   Name
  // 123123 name123
  // -      name456

  return newData;
};

module.exports = data2csv.mw(handler);
````

then add to your `app.js` file (before the route handling middleware)
````javascript
app.use(require('./middleware.js'));
````

# Contact

If you have any questions, please contact me **`root@laravue.org`**

# License
The MIT license
