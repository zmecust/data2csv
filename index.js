'use strict';

let data2csv = {};

const hasSpecialChar = value => {
  const thisValue = value.toString();

  return (
    thisValue.includes('\n') ||
    thisValue.includes('\t') ||
    thisValue.includes(',') ||
    thisValue.includes('"') ||
    thisValue.includes("'") ||
    thisValue.length === 0
  );
};

const sanitizeString = value => {
  return value.replace(/"/g, '""');
};

// Convert json to CSV string
data2csv.convertJsonToCSV = (json, fields) => {
  let csv = fields.map(v => v.label).join(',') + '\n';
  const separator = ',';

  json.forEach(row => {
    fields.forEach((v, i) => {
      const value = row[v.value];
      let thisValue;

      if (v.method && typeof v.method === 'function') {
        thisValue = v.method(value, v.default);
      } else {
        thisValue = value || (value === 0 ? 0 : v.default);
      }

      const hasSpecial = hasSpecialChar(thisValue);
      const isLastColumn = fields.length - 1 === i;

      csv += hasSpecial ? `"${sanitizeString(thisValue)}"` : thisValue;
      csv += isLastColumn ? '\n' : separator;
    });
  });

  return csv;
};

const onError = (err, req, res) => {
  res
    .status(500)
    .set('content-language', 'en')
    .json({ message: err.message });
  return res;
};

data2csv.mw = (fn, options) => {
  return (req, res, next) => {
    if (
      (req.headers['Accept'] && req.headers['Accept'].includes('text/csv')) ||
      (req.headers['accept'] && req.headers['accept'].includes('text/csv'))
    ) {
      const original = res.json;
      options = options || {};

      const json_hook = async json => {
        const originalJson = json;
        res.json = original;

        if (res.headersSent) return res;
        if (res.statusCode >= 400) return original.call(this, json);

        try {
          // call handler fucntion
          const data = await fn(json, req, res);

          if (res.headersSent) return res;

          // If null, then 204 No Content
          if (data === null) return res.status(204).end();

          // If munged scalar value, then text/plain
          if (data !== originalJson) {
            // res.attachment(`${data.filename}-${Number(new Date())}.csv`);
            res.set({
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="${data.filename}.csv"`,
            });
            return res.send(data.csv);
          }

          return original.call(this, json);
        } catch (e) {
          onError(e, req, res);
        }
      };

      res.json = json_hook;
    }

    next && next();
  };
};

module.exports = data2csv;
