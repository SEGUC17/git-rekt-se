const clientAuthAPI = require('./api/v1/client/auth');
const businessAuthAPI = require('./api/v1/business/auth');
const adminAuthAPI = require('./api/v1/admin/auth');
var multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './service_gallery/');
  },
  filename: function (req, file, cb) {
    const buf = crypto.randomBytes(16);
    cb(null, Date.now() + buf.toString('hex') + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

module.exports = (app) => {
  /**
   * Visitor Routes
   */

  /**
   * Client Routes
   */
  app.use('/api/v1/client/auth', clientAuthAPI);

  /**
   * Business Routes
   */
  app.use('/api/v1/client/auth', businessAuthAPI);

  /**
   * Admin Routes
   */
  app.use('/api/v1/admin/auth', adminAuthAPI);

  router.get("/addServiceImage", function (req, err) {
    res.render("addServiceImage");
  });

  router.post("/addServiceImage", uploads.any(), function (req, res, next) { //ensureauthenticated
    var Image = ({
      path: req.files[0],
      description: req.body.description,
    }).save((err, data) => {
      if (err) {
        throw err;
      }
      req.service.gallery.push(data);
      req.service.save((err) => {

        req.flash("info", "Image added successfully!");
        res.redirect("/addServiceImage");
      })
    });
  });


  /**
   * Service Routes
   */
};
