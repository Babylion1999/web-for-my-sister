var express = require('express');
var router = express.Router();

const folderView	 = __path_views_admin + 'pages/setting/';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(`${folderView}index`, { pageTitle   : 'SettingPage ' });
});

module.exports = router;
