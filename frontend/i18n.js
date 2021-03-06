const fs = require('fs');

let dirname = 'frontend/locales/';

fs.readdir(dirname, function(err, filenames) {
    filenames.forEach(function(filename) {
        fs.readFile(dirname + filename, 'utf-8', function(err, data) {
            let xml = new Buffer(data).toString();

            xml = xml.replace(/<source>(.*?)<\/source>/gi, '<source>$1</source>\n<target>$1</target>');

            fs.writeFile(dirname + filename, xml, (err, data) => {});
        });
    });
});