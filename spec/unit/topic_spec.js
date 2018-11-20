const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
  beforeEach( done => {
    this.topic;
    this.posts = [];
    sequelize.sync({force: true}).then( res => {
      done();
    })
    .catch( err => {
      console.log(err);
      done();
    });
  });
  describe("#create()", () => {
    it("should create a topic object with a title and description", done => {
      Topic.create({
        title: "Expeditions to Mars",
        description: "Logs and other data regarding recent visits to Mars"
      })
      .then( topic => {
        expect(topic.title).toBe("Expeditions to Mars");
        expect(topic.description).toBe("Logs and other data regarding recent visits to Mars");
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });
    it("should not create a topic with a missing title or description", done => {
      Topic.create({
        title: "Missions to Uranus"
      })
      .then( topic => {
        done();
      })
      .catch( err => {
        expect(err.message).toContain("Topic.description cannot be null");
        done();
      });
    });
  });
  describe("#getPosts()", () => {
    it("should return an array of Post objects that are associated with the topic", done => {
      Topic.create({
        title: "Expeditions to Mars",
        description: "Logs and other data regarding recent visits to Mars"
      })
      .then( newTopic => {
        Post.create({
          title: "Curiosity Rover",
          body: "Designed to explore Gale Crater on Mars as part of NASA's Mars Science Laboratory mission",
          topicId: newTopic.id
        })
        .then( post => {
          newTopic.getPosts()
          .then( posts => {
            expect(posts[0].title).toBe("Curiosity Rover");
            expect(posts[0].topicId).toBe(newTopic.id);
            done();
          });
        })
        .catch( err => {
          console.log(err);
          done();
        });
      })
      .catch( err => {
        console.log(err);
        done();
      });
    });
  });
});