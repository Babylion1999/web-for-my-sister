var path = require('path');
var multer = require('multer');
var randomstring = require("randomstring");

let uploadImg = (id,savePath) => {
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
                                fileSize: 8 * 1024 * 1024,
                            },
                            fileFilter: function (req, file, cb) {
                                const extension = path.extname(file.originalname).toLowerCase();
                                const mimetyp = file.mimetype;
                                console.log(extension);
                                if (
                                    extension !== '.jpg' &
                                    extension !== '.jpeg' &
                                    extension !== '.png' &
                                    mimetyp !== 'image/png' &
                                    mimetyp !== 'image/jpg' &
                                    mimetyp !== 'image/jpeg'
                                ) {
                                    cb('It too large');
                                }
                                    return cb(null,true)
                            },
                        }).single(id);

	return upload
}

module.exports = {
    uploadImg
}