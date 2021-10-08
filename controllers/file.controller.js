const uploadFile = require("../middelware/upload.js");
const fs = require("fs");
const baseUrl = "http://localhost:3000/files/";

const upload = async (req, res) => {
  //let file = req.file.originalname;
  //console.log(files);
  try {
    //console.log(file.originalname);
    await uploadFile(req, res);


    if (req.file == undefined) {
      //if (!file) {
      //return res.status(400).send({ message: "Please upload a file!" });
      //console.log(req.file.fileName);
       return res.send('Please uplo');
    }

    /*res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });*/
    return res.send('Uploaded the file succes');
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      /*return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });*/
      return res.send('canot size');

    }

    /*res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });*/
    return res.send('canot sizeeee');

  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/public/emploi/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      /*res.status(500).send({
        message: "Unable to scan files!",
      });*/
      return res.send('cunable');

    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    res.render('pages/afficheemploi',{
      
      fileInfos:fileInfos
  });
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/public/emploi/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      return res.send('ould not download' );
    }
  });
};



module.exports = {
  upload,
  getListFiles,
  download,
};
