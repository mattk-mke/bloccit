const Advertisement = require("./models").Advertisement;

module.exports = {
  getAllAdvertisements(callback) {
    return Advertisement.all()
    .then( ads => {
      callback(null, ads);
    })
    .catch( err => {
      callback(err);
    });
  },
  addAdvertisement(newAdvertisement, callback) {
    return Advertisement.create({
      title: newAdvertisement.title,
      description: newAdvertisement.description
    })
    .then( ad => {
      callback(null, ad);
    })
    .catch( err => {
      callback(err);
    });
  },
  getAdvertisement(id, callback) {
    return Advertisement.findById(id)
    .then( ad => {
      callback(null, ad);
    })
    .catch( err => {
      callback(err);
    });
  },
  deleteAdvertisement(id, callback) {
    return Advertisement.destroy({
      where: {id}
    })
    .then( ad => {
      callback(null, ad);
    })
    .catch( err => {
      callback(err);
    });
  },
  updateAdvertisement(id, updatedAdvertisement, callback) {
    return Advertisement.findById(id)
    .then( ad => {
      if (!ad) {
        return callback("Advertisement not found");
      }
      ad.update(updatedAdvertisement, {
        fields: Object.keys(updatedAdvertisement)
      })
      .then( () => {
        callback(null, ad);
      })
      .catch( err => {
        callback(err);
      });
    });
  }
}