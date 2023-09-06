const fs = require('fs');
const process = require('process');
const axios = require('axios')



function cat(path) {

    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${path}: ${err}`);
            process.exit(1);
        }
        console.log(data);
    });
}

async function webCat(url) {
    try {
        const response = await axios.get(url);
        console.log(response.data)
    } catch (error) {
        console.error(`Error fetching ${url}: ${error.message}`);
        process.exit(1);
    }
}

function catOrWebCat(path) {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        webCat(path);
    } else {
        cat(path);
    }
}
catOrWebCat(process.argv[2])