const {ImageKit} = require('@imagekit/nodejs')
const dotenv = require('dotenv')
dotenv.config();

const PrivateKey = process.env.PRIVATE_KEY;

const client = new ImageKit({
    privateKey: PrivateKey
})

async function uploadFile(buffer){
    const result = await client.files.upload({
        file: buffer.toString("base64"),
        fileName: "image.jpg"
    })

    return result;
}

module.exports = uploadFile;