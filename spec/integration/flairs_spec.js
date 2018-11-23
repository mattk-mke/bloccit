const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/flairs";

const sequelize = require("../../src/db/models/index").sequelize;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
  beforeEach( done => {
    this.flair;
    sequelize.sync({force: true}).then( res => {
      Flair.create({
        name: "Important",
        color: "red"
      })
      .then( flair => {
        this.flair = flair;
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });
  });
  describe("GET /flairs/new", () => {
    it("should render a new flair form", done => {
      request.get(base + "/new", (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });
  });
  describe("POST /flairs/create", () => {
    it("should create a new flair and redirect", done => {
      const options = {
        url: base + "/create",
        form: {
          name: "New",
          color: "orange"
        }
      };
      request.post(options, (req, res, body) => {
        Flair.findOne({where: {name: "New"}})
        .then( flair => {
          expect(flair).not.toBeNull();
          expect(flair.name).toBe("New");
          expect(flair.color).toBe("orange");
          done();
        })
        .catch( err => {
          console.log(err);
          done();
        });
      });
    });
  });
  describe("GET /flairs/:id", () => {
    it("should render a view with the selected flair", done => {
      request.get(base + "/" + this.flair.id, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Important");
        done();
      });
    });
  });
  describe("POST /flairs/:id/destroy", () => {
    it("should delete the flair with the associated ID", done => {
      expect(this.flair.id).toBe(1);
      request.post(base + "/" + this.flair.id + "/destroy", (err, res, body) => {
        Flair.findById(1)
        .then( flair => {
          expect(err).toBeNull();
          expect(flair).toBeNull();
          done();
        });
      });
    });
  });
  describe("GET /flairs/:id/edit", () => {
    it("should render a view with an edit flair form", done => {
      request.get(base + "/" + this.flair.id + "/edit", (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Flair");
        expect(body).toContain("Important");
        done();
      });
    });
  });
  describe("POST /flairs/:id/update", () => {
    it("should return status code 302", done => {
      request.post({
        url: base + "/" + this.flair.id + "/update",
        form: {
          name: "Not Important",
          color: "blue"
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });
    it("should update the flair with the given values", done => {
      const options = {
        url: base + "/" + this.flair.id + "/update",
        form: {
          name: "Sort of important"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Flair.findOne({
          where: {id: this.flair.id}
        })
        .then( flair => {
          expect(flair.name).toBe("Sort of important");
          done();
        });
      });
    });
  });
});