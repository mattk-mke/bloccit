const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {
  beforeEach( done => {
    this.ad;
    sequelize.sync({force: true}).then( res => {
      Advertisement.create({
        title: "Local Lawyer",
        description: "Lawyer slogan"
      })
      .then( ad => {
        this.ad = ad;
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });
  });
  describe("GET /advertisements", () => {
    it("should return a status code 200 and all advertisements", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Advertisements");
        expect(body).toContain("Local Lawyer");
        done();
      });
    });
  });
  describe("GET /advertisements/new", () => {
    it("should render a new ad form", done => {
      request.get(base + "new", (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Advertisement");
        done();
      });
    });    
  });
  describe("POST /advertisements/create", () => {
    const options = {
      url: base + "create",
      form: {
        title: "MobCraft Brewery",
        description: "Crowdsourced beer"
      }
    };
    it("should create a new ad and redirect", (done) => {
      request.post(options, (err, res, body) => {
        Advertisement.findOne({where: {title: "MobCraft Brewery"}})
        .then( ad => {
          expect(res.statusCode).toBe(303);
          expect(ad.title).toBe("MobCraft Brewery");
          expect(ad.description).toBe("Crowdsourced beer");
          done();
        })
        .catch( err => {
          console.log(err);
          done();
        });
      });
    });
  });
  describe("GET /advertisements/:id", () => {
    it("should render a view with the selected ad", done => {
      request.get(base + this.ad.id, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Local Lawyer");
        done();
      });
    });
  });
  describe("POST /advertisements/:id/destroy", () => {
    it("should delete the ad with the associated ID", done => {
      Advertisement.all()
      .then( ads => {
        const adCountBeforeDelete = ads.length;
        expect(adCountBeforeDelete).toBe(1);
        request.post(base + this.ad.id + "/destroy", (err, res, body) => {
          Advertisement.all()
          .then( ads => {
            expect(err).toBeNull();
            expect(ads.length).toBe(adCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });
  describe("GET /advertisements/:id/edit", () => {
    it("should render a view with an edit ad form", done => {
      request.get(base + this.ad.id + "/edit", (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Advertisement");
        expect(body).toContain("Local Lawyer");
        done();
      });
    });
  });
  describe("POST /advertisements/:id/update", () => {
    it("should update the ad with the given value", done => {
      const options = {
        url: base + this.ad.id + "/update",
        form: {
          title: "David Gruber",
          description: "One call, that's all"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Advertisement.findOne({
          where: { id: this.ad.id }
        })
        .then( ad => {
          expect(ad.title).toBe("David Gruber");
          done();
        });
      });
    });
  });
});