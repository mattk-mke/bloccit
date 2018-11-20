const advertisementQueries = require("../db/queries.advertisements.js");

module.exports = {
  index(req, res, next) {
    advertisementQueries.getAllAdvertisements( (err, ads) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("advertisements/index", {ads});
      }
    });
  },
  new(req, res, next) {
    res.render("advertisements/new");
  },
  create(req, res, next) {
    let newAdvertisement = {
      title: req.body.title,
      description: req.body.description
    };
    advertisementQueries.addAdvertisement(newAdvertisement, (err, ad) => {
      if (err) {
        res.redirect(500, "/advertisements/new");
      } else {
        res.redirect(303, "/advertisements/" + ad.id);
      }
    });
  },
  show(req, res, next) {
    advertisementQueries.getAdvertisement(req.params.id, (err, ad) => {
      if (err || ad == null) {
        res.redirect(404, "/");
      } else {
        res.render("advertisements/show", {ad});
      }
    });
  },
  destroy(req, res, next) {
    advertisementQueries.deleteAdvertisement(req.params.id, (err, ad) => {
      if (err) {
        res.redirect(500, "/advertisements/" + ad.id);
      } else {
        res.redirect(303, "/advertisements");
      }
    });
  },
  edit(req, res, next) {
    advertisementQueries.getAdvertisement(req.params.id, (err, ad) => {
      if (err || ad == null) {
        res.redirect(404, "/");
      } else {
        res.render("advertisements/edit", {ad});
      }
    });
  },
  update(req, res, next) {
    advertisementQueries.updateAdvertisement(req.params.id, req.body, (err, ad) => {
      if (err || ad == null) {
        res.redirect(404, "/advertisements/" + req.params.id + "/edit");
      } else {
        res.redirect("/advertisements/" + ad.id);
      }
    });
  }
}