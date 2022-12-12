var path = require('path');
var multer = require('multer');
var randomstring = require("randomstring");
const fs = require('fs');

let uploadImg = (fields,savePath) => {
    let storage = multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, __path_public + savePath);
        },
        filename: function(req, file, cb) {
          cb(null, randomstring.generate(7)+ path.extname(file.originalname) );
        },
      });
      
    let upload = multer({ storage: storage,
                            limits:{
                                fileSize: 1 * 1024 * 1024,
                            },
                            fileFilter: function (req, file, cb) {
                                const extension = path.extname(file.originalname).toLowerCase();
                                const mimetyp = file.mimetype;
                                console.log(file.mimetype);
                                if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' &&file.mimetype !== 'image/jpeg') {
                                  req.fileValidationError = 'goes wrong on the mimetype';
                                  return cb('123', false, new Error('goes wrong on the mimetype'));
                                 }
                                 cb(null, true);
                                
                            },
                        }).fields(fields)

	return upload
}
removeImg=(path)=>{
    if(fs.existsSync(path)){
            fs.unlink(path, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted /tmp/hello');
                      });
                    }
}

module.exports = {
    uploadImg,
    removeImg
}