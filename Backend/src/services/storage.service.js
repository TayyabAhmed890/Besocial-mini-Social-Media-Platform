const ImageKit = require("imagekit");
const dotenv = require("dotenv");
dotenv.config();

// ImageKit Instance Initialization
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// 1. Upload Function
async function uploadFile(buffer, fileName = "image.jpg") {
  try {
    const result = await imagekit.upload({
      file: buffer.toString("base64"),
      fileName: fileName,
    });

    // Is result me se fileId aur url dono milte hain
    return {
      fileId: result.fileId, // 🔥 DB me save karna zaroori hai
      url: result.url,
    };
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
}

// 2. Delete Function
async function deleteFile(fileId) {
  try {
    const response = await imagekit.deleteFile(fileId);
    return response;
  } catch (error) {
    console.error("ImageKit Delete Error:", error);
    throw error;
  }
}

module.exports = {
  uploadFile,
  deleteFile,
};