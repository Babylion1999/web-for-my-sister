var express = require('express');
var router = express.Router();
const changeName = "settings"
const mainModel = require(__path_schemas + 'settings');
const MainModel = require(__path_services + `backend/${changeName}`);
const ValidateSettings = require(__path_validates + `${changeName}`);
const folderView = __path_views_admin + 'pages/settings/';
const notify = require(__path_configs + 'notify');
const systemConfig = require(__path_configs + 'system');
const fileHelpers = require(__path_helpers + 'uploadLogo');
const uploadThumb = fileHelpers.uploadImg([
  { name: 'logoHeader', maxCount: 1 },
  { name: 'logoFooter', maxCount: 1 }
], 'backend/adminlte/images/settings');
const linkIndex = '/' + systemConfig.prefixAdmin + `/${changeName}/`;
const ValidateArticles = require(__path_validates + `${changeName}`);
/* GET home page. */
router.get('/', async function (req, res, next) {
  let item = await mainModel.findOne({});
  let errors = '';
  const { copyright, content, logoFooter } = JSON.parse(item.footer);
  const { logoHeader } = JSON.parse(item.header);
  const { facebook, instagram, email , zalo, phone, address } = JSON.parse(item.contact);
  const { map } = JSON.parse(item.script);
  item.copyright = copyright;
  item.content = content;
  item.logoFooter = logoFooter;
  item.logoHeader = logoHeader;
  item.facebook = facebook;
  item.instagram = instagram;
  item.email = email;
  item.zalo = zalo;
  item.phone = phone;
  item.address = address;
  item.map = map;

  res.render(`${folderView}form`, { item, pageTitle: 'SettingPage ', errors });
});
router.post('/save', async (req, res, next) => {
  uploadThumb(req, res, async function (errUpload) {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    // validate----------------
    ValidateSettings.validator(req);
    let errors = req.validationErrors() !== false ? req.validationErrors() : [];
    console.log(1);

    if (errUpload) {
      if (errUpload == '123') { 
        
        errors.push({ param: 'thumb', msg: 'file k hop le' });
        res.send('file k hop le');
        
      } 
      if (errUpload.code == 'LIMIT_FILE_SIZE') { 
       
        errors.push({ param: 'thumb', msg: notify.ERROR_FILE_LARGE }) }
      
    } else if (req.files == undefined) {
      errors.push({ param: 'thumb', msg: notify.ERROR_FILE_REQUIRE })
    }
    if (errors.length > 0) {

      item.logoHeader =item.image_header_old;
      item.logoFooter =item.image_footer_old;
      res.render(`${folderView}form`, { pageTitle: 'SettingPage', item, errors });
    } else {
      let footer = JSON.stringify({
        copyright: item.copyright,
        content: item.content,
        logoFooter: !req.files.logoFooter ? item.image_footer_old : req.files.logoFooter[0].filename
      })
      let header = JSON.stringify({
        logoHeader: !req.files.logoHeader ? item.image_header_old : req.files.logoHeader[0].filename
      });
      let contact = JSON.stringify({
        facebook: item.facebook,
        instagram: item.instagram,
        email: item.email,
        zalo: item.zalo,
        phone: item.phone,
        address: item.address

      });
      let script = JSON.stringify({
        map: item.map,
      });


      if (req.files.logoHeader) fileHelpers.removeImg(`public/backend/adminlte/images/${changeName}/${item.image_header_old}`);
      if (req.files.logoFooter) fileHelpers.removeImg(`public/backend/adminlte/images/${changeName}/${item.image_footer_old}`);
      console.log(7);
      mainModel.update({ _id: item.id }, { header, footer, contact, script}).then(() => {
        req.flash('success', 'Cap nhat thanh cong', false);
        res.redirect(linkIndex);
      })
    }
    // --------------------------
  });
});

module.exports = router;
