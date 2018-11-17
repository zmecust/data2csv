'use strict';

const data2csv = require('../');
const should = require('should');
const httpMocks = require('node-mocks-http');

describe('data to csv', () => {
  const data = [
    { code: '123', name: 'name123' },
    { code: '', name: 'name456' },
  ];

  it('check convert json to csv', done => {
    const double = (data, defaultValue) => {
      return data && (data + data) || defaultValue;
    };

    const fields = [
      { label: 'Code', value: 'code', method: double, default: '-' },
      { label: 'Name', value: 'name', default: '-' },
    ];

    const newDate = data2csv.convertJsonToCSV(data, fields);

    newDate.should.equal('Code,Name\n123123,name123\n-,name456\n');

    done();
  });

  it('should return the munged JSON result', async () => {
    const inspect = async (json, req, res) => {
      return { csv: JSON.stringify(json.data[0]), filename: 'test' };
    }

    const req = httpMocks.createRequest({ headers: { Accept: 'text/csv' } });
    const res = httpMocks.createResponse();

    data2csv.mw(inspect)(req, res, () => { });
    await res.json({ data });

    res.statusCode.should.equal(200);
    res._getData().should.equal(JSON.stringify(data[0]));
    res._getHeaders()['content-type'].should.equal('text/csv; charset=utf-8');
  });
})
