const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("Post", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;
    this.vote;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user; //store the user
        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
        })
        .then((topic) => {
          this.topic = topic; //store the topic
          Post.create({
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id,
            topicId: this.topic.id,
            votes: [{
              value: 1,
              userId: this.user.id,
            }]
          }, {
            include: {
              model: Vote,
              as: "votes"
            }
          })
          .then( post => {
            this.post = post;
            this.vote = this.post.votes[0];
            done();
          })
        });
      });
    });
  });
  describe("#create()", () => {
    it("should create a post object with a title, body, and assigned topic and user", done => {
      Post.create({
        title: "Pros of Cryosleep during the long journey",
        body: "1. Not having to answer the 'are we there yet?' question.",
        topicId: this.topic.id,
        userId: this.user.id
      })
      .then( post => {
        expect(post.title).toBe("Pros of Cryosleep during the long journey");
        expect(post.body).toBe("1. Not having to answer the 'are we there yet?' question.");
        expect(post.topicId).toBe(this.topic.id);
        expect(post.userId).toBe(this.user.id);
        done();
      })
      .catch( err=> {
        console.log(err);
        done();
      });
    });
    it("should not create a post with missing title, body, or assigned topic", done => {
      Post.create({
        title: "Pros of Cryosleep during the long journey"
      })
      .then( post => {
        done();
      })
      .catch( err => {
        expect(err.message).toContain("Post.body cannot be null");
        expect(err.message).toContain("Post.topicId cannot be null");
        done();
      });
    });
  });
  describe("#setTopic()", () => {
    it("should associate a topoic and a post together", done => {
      Topic.create({
        title: "Challenges of interstellar travel",
        description: "1. The Wi-Fi is terrible"
      })
      .then( newTopic => {
        expect(this.post.topicId).toBe(this.topic.id);
        this.post.setTopic(newTopic)
        .then( post => {
          expect(post.topicId).toBe(newTopic.id);
          done();
        });
      });
    });
  });
  describe("#getTopic()", () => {
    it("should return the associated topic", done => {
      this.post.getTopic()
      .then( associatedTopic => {
        expect(associatedTopic.title).toBe("Expeditions to Alpha Centauri");
        done();
      });
    });
  });
  describe("#setUser()", () => {
    it("should associate a post and a user together", done => {
      User.create({
        email: "ada@example.com",
        password: "password"
      })
      .then( newUser => {
        expect(this.post.userId).toBe(this.user.id);
        this.post.setUser(newUser)
        .then( post => {
          expect(this.post.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });
  describe("#getUser()", () => {
    it("should return the associated topic", done => {
      this.post.getUser()
      .then( associatedUser => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });
    });
  });

  describe("#getPoints()", () => {
    it("should return a value of 1 if there is one vote", done => {
      expect(this.post.getPoints()).toBe(1);
      User.create({
        email: "member@example.com",
        password: "password123"
      })
      .then( user => {
        Vote.create({
          value: 1,
          userId: user.id,
          postId: this.post.id
        })
        .then( vote => {
          this.post.votes.push(vote);
          this.post.save()
          .then( post => {
            expect(post.getPoints()).toBe(2);
            done();
          })
          .catch( err => {
            console.log(err);
            done();
          });
        });
      });
    });
  });

  describe("#hasUpvoteFor()", () => {
    it("should return true if the user with the matching userId has an upvote for the post", done => {
      expect(this.post.hasUpvoteFor(this.user.id)).toBe(true);
      this.vote.value = -1;
      this.vote.save()
      .then( vote => {
        expect(this.post.hasUpvoteFor(this.user.id)).toBe(false);
        done();
      })
      .catch( err => {
        console.log(err);
        expect(err).toBeNull();
        done();
      });
    });
  });

  describe("#hasDownvoteFor()", () => {
    it("should return true if the user with the matching userId has a downvote for the post", done => {
      expect(this.post.hasDownvoteFor(this.user.id)).toBe(false);
      this.vote.value = -1;
      this.vote.save()
      .then( vote => {
        expect(this.post.hasDownvoteFor(this.user.id)).toBe(true);
        done();
      })
      .catch( err => {
        console.log(err);
        expect(err).toBeNull();
        done();
      });
    });
  });

});
