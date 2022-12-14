const express = require("express");
const AWS = require("aws-sdk");
const awsConfig = require("./config-aws");
const uuid = require("uuid");
const app = express();
var bodyParser = require("body-parser");
// Let's try this

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

AWS.config.update({ region: awsConfig.region });

const S3_BUCKET = awsConfig.bucketName;
const s3 = new AWS.S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
  signatureVersion: "v4",
  //   useAccelerateEndpoint: true
});

const getPresignedUrl = (req, res) => {
  let fileType = req.body.fileType;
  let fileName = req.body.fileName;
  let ContentType = null;
  let mime_app = fileType.substring(1, fileType.length)
  if (fileType == ".jpg" || fileType == ".png" || fileType == ".jpeg" || fileType == ".bmp" || fileType == ".gif") {
    ContentType = "image/" + mime_app;
    // return res
    //   .status(403)
    //   .json({ success: false, message: "Image format invalid" });

  }

  else if (fileType == ".mp4") {
    ContentType = "video/" + mime_app;
  }
  else if (fileType == ".pdf" || fileType == ".json") {
    ContentType = "application/" + mime_app;
    // switch (fileType){
    //   case ".csv":{
    //     ContentType="text/"+mime_app;
    //   }
    //   case ".json":{
    //     ContentType="application/"+mime_app;
    //   }
    //   case ".txt":{
    //     ContentType="text/plain";
    //   }
    //   case ".xlsx":{
    //     ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    //   }
    //   case ".pdf": {
    //       ContentType="application/"+mime_app;
    //   }
    //   case ".mp3":{
    //     ContentType="audio/"+mime_app;
    //   }
    //   default:{
    //     return res
    //   .status(403)
    //   .json({ success: false, message: "File format submitted is invalid" });
    //   }
  }
  else if (fileType == ".mp3") {
    ContentType = "audio/" + mime_app;
  }
  else if (fileType == ".xlsx") {
    ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  else if (fileType == ".csv") {
    ContentType = "text/" + mime_app;
  }
  else if (fileType == ".txt") {
    ContentType = "text/plain";
  }
  else {
    return res
      .status(403)
      .json({ success: false, message: "File format submitted is invalid" });
  }


  // fileType = fileType.substring(1, fileType.length);

  // const fileName = uuid.v4(); // filename is supposed to come from the frontend
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60 * 60,
    ContentType: ContentType,
    ACL: "public-read",
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      success: true,
      message: "Url generated",
      uploadUrl: data,
      downloadUrl:
        `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    return res.status(201).json(returnData);
  });
};

app.post("/generatePresignedUrl", (req, res) => getPresignedUrl(req, res));




const dynamicAWS = require("aws-sdk");
var dynamicAwsConfig = null;
const dynamicPORT = 5007;
const dynamicApp = express();
var dynamicBodyParser = require("body-parser");


dynamicApp.use(dynamicBodyParser.json());
dynamicApp.use(dynamicBodyParser.urlencoded({ extended: false }));


dynamicApp.listen(dynamicPORT, () => console.log(`Listening at port ${dynamicPORT}`));





const getS3ConnectionAndPresignedUrl = async (req, res) => {
  var fileType = req.body.fileType;
  var fileName = req.body.fileName;
  var superAppId = req.body.superAppId;
  var ContentType = null;
  var mime_app = "jpg";
  if(fileType != null && fileType != undefined && fileType.length>=2) {
    mime_app = fileType.substring(1, fileType.length)
  } else {
    fileType = ".jpg";
  }
  if (fileType == ".jpg" || fileType == ".png" || fileType == ".jpeg" || fileType == ".bmp" || fileType == ".gif") {
    ContentType = "image/" + mime_app;
  }
  else if (fileType == ".mp4") {
    ContentType = "video/" + mime_app;
  }
  else if (fileType == ".pdf" || fileType == ".json") {
    ContentType = "application/" + mime_app;
  }
  else if (fileType == ".mp3") {
    ContentType = "audio/" + mime_app;
  }
  else if (fileType == ".xlsx") {
    ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  else if (fileType == ".csv") {
    ContentType = "text/" + mime_app;
  }
  else if (fileType == ".txt") {
    ContentType = "text/plain";
  }
  else {
    return res
      .status(403)
      .json({ success: false, message: "File format submitted is invalid" });
  }

  //get aws s3 info from uniapp server using the available superAppId. assign the result to dynamicAwsConfig.

  var apiresult = null;

  if (superAppId == null || superAppId.length == 0) {
    return res
      .status(403)
      .json({ success: false, message: "Oops Invalid Inpput error!!" });
  }

  var requestBody = {
    "superapp": superAppId
  };

  const axios = require('axios');
  var ans = null;
  (async () => {
    try {
      const [response1] = await axios.all([
        axios.post('http://uniapp.vassarlabs.com:9003/api/uniapp/awsconfigdata', requestBody),
      ]);

      ans = JSON.parse(response1.data.result.content);
      // console.log("ans : ",ans);
      dynamicAwsConfig = ans;
      
      dynamicAWS.config.update({ region: dynamicAwsConfig.region });

      const dynamic_S3_BUCKET = dynamicAwsConfig.bucketName;
      const dynamic_s3 = new dynamicAWS.S3({
        accessKeyId: dynamicAwsConfig.accessKey,
        secretAccessKey: dynamicAwsConfig.secretKey,
        region: dynamicAwsConfig.region,
        signatureVersion: "v4",
      });

      const dynamic_s3Params = {
        Bucket: dynamic_S3_BUCKET,
        Key: fileName,
        Expires: 60 * 60,
        ContentType: ContentType,
        ACL: "public-read",
      };
      dynamic_s3.getSignedUrl("putObject", dynamic_s3Params, (err, data) => {
        if (err) {
          console.log(err);
          return res.end();
        }
        const returnData = {
          success: true,
          message: "Url generated",
          uploadUrl: data,
          downloadUrl:
            `https://${dynamic_S3_BUCKET}.s3.amazonaws.com/${fileName}`,
        };
        return res.status(201).json(returnData);
      });




    } catch (error) {
      console.log("error.response.body : ", error);
    }
  })();



};

dynamicApp.post("/getS3ConnectionAndgeneratePresignedUrl", (req, res) => getS3ConnectionAndPresignedUrl(req, res));
