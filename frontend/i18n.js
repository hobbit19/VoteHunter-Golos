const fs = require('fs');
const xml2js = require('xml2js');

fs.readFile('frontend/locales/messages.ru.xlf', (err, data) => {
    let xml = new Buffer(data).toString();

    xml2js.parseString(xml, (err, data) => {
        data.xliff.file[0].body.forEach((val) => {
            console.log(val)
        });
    });
});