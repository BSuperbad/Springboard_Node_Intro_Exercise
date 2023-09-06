const fs = require('fs');
const process = require('process');
const axios = require('axios')



function cat(path, outputFile) {

    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${path}: ${err}`);
            process.exit(1);
        }
        if (outputFile) {
            fs.writeFile(outputFile, data, {
                encoding: 'utf8',
                flag: 'a'
            }, (err) => {
                if (err) {
                    console.error(`Error writing to ${outputFile}: ${err}`);
                    process.exit(1);
                }
                console.log(`Data written to ${outputFile}`);
            })
        } else {
            console.log(data);
        }
    });
}

async function webCat(url, outputFile) {
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (outputFile) {
            fs.writeFile(outputFile, data, {
                encoding: 'utf8',
                flag: 'a'
            }, (err) => {
                if (err) {
                    console.error(`Error writing to ${outputFile}: ${err}`);
                    process.exit(1);
                }
                console.log(`Data written to ${outputFile}`);
            });
        } else {
            console.log(data)
        }
    } catch (error) {
        console.error(`Error fetching ${url}: ${error.message}`);
        process.exit(1);
    }
}

function catOrWebCat(path, outputFile) {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        webCat(path, outputFile);
    } else {
        cat(path, outputFile);
    }
}

const args = process.argv.slice(2);
const outputFileIndex = args.indexOf('--out');

if (outputFileIndex !== -1 && args[outputFileIndex + 1]) {
    const outputFileName = args[outputFileIndex + 1];
    const pathOrURL = args.filter((arg, index) => index !== outputFileIndex && index !== outputFileIndex + 1)[0];
    catOrWebCat(pathOrURL, outputFileName);
} else {
    const pathOrURL = args[0];
    catOrWebCat(pathOrURL);
}