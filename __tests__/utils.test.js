const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../db/seeds/utils");

const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoint = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("Northcoders News API", () => {
  describe("api/", () => {
    describe("Status health check", () => {
      test("200 - respond with the 200 status code", () => {
        return request(app).get("/api/healthcheck").expect(200);
      });
    });

    describe("/api/topics/", () => {
      test("200 - responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            const expectedOutput = response.body.map((elem) => {
              expect(elem.hasOwnProperty("slug")).toBe(true);
              expect(elem.hasOwnProperty("description")).toBe(true);
            });
          });
      });
    });

    describe("/api", () => {
      test("200- respond with an object describing the available endpoints", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body.endpoint).toEqual(endpoint);
          });
      });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    it("200 - respond with the correct article ID depening in it ID", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            body: "some gifs",
            topic: "mitch",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    it("404 - return appropriate error if the user enters an ID that is not in the database", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article does not exist");
        });
    });

    it("400- responds with an error message when entered invalid input", () => {
      return request(app)
        .get("/api/articles/katherine")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("GET /api/articles", () => {
    it("200 - responds with an articles array of articles objects with no body and in decending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.article.map((key) => {
            expect(key.hasOwnProperty("body")).toBe(false);
            expect(key.hasOwnProperty("comment_count")).toBe(true);
          });
          expect(body.article.length).toBe(5);
          expect(body.article).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    it("200 - respond with an array of properties for the given ID", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.length).toBe(2);
          expect(body.article).toBeSortedBy("created_at");
          body.article.map((keys) => {
            expect(keys.hasOwnProperty("randomKey")).toBe(false);
            expect(keys.hasOwnProperty("comment_id")).toBe(true);
            expect(keys.hasOwnProperty("votes")).toBe(true);
            expect(keys.hasOwnProperty("created_at")).toBe(true);
            expect(keys.hasOwnProperty("author")).toBe(true);
            expect(keys.hasOwnProperty("body")).toBe(true);
            expect(keys.hasOwnProperty("article_id")).toBe(true);
          });
        });
    });

    it("404 - respond stating that the id does not exists", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found");
        });
    });

    it("400 - respond with a bad request message", () => {
      return request(app)
        .get("/api/articles/one/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("CORE: POST /api/articles/:article_id/comments", () => {
    it("201 - respond with the new comment that is posted and the ID matches as well", () => {
      const newComt = {
        username: "icellusedkars",
        body: "No comment...",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComt)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.body).toBe(newComt.body);
          expect(body.comment.article_id).toBe(1);
        });
    });

    it("201 - check if the username and body exists or not", () => {
      const newComt = {
        username: "icellusedkars",
        body: "No comment...",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComt)
        .expect(201)
        .then(({ body }) => {
          expect("author" in body.comment).toBe(true);
          expect("body" in body.comment).toBe(true);
        });
    });

    it("201 - Return a 201 status if an extra key is added in the newComt Object", () => {
      const newComt = {
        username: "icellusedkars",
        body: "No comment...",
        thisIsANewKey: "A new extra value added just for testing",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComt)
        .expect(201);
    });

    it("404 - respond with an appropriate error message when entered an username that does not exists", () => {
      const newComt = {
        username: "petsarebest",
        body: "No comment...",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComt)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    it("404 - respond with an appropriate error message when entered an non existent article_id", () => {
      const newComt = {
        username: "petsarebest",
        body: "No comment...",
      };
      return request(app)
        .post("/api/articles/1000/comments")
        .send(newComt)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    it("400 - respond with an appropriate error message if the user does not post a body key ", () => {
      const newComt = {
        username: "petsarebest",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComt)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    it("400 - respond with an appropriate error message if the user enters a invalid article_id ", () => {
      const newComt = {
        username: "petsarebest",
        body: "No comment...",
      };
      return request(app)
        .post("/api/articles/nonsense/comments")
        .send(newComt)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("CORE: PATCH /api/articles/:article_id", () => {
    it("200 - Respond with the votes column being added with article_id 1", () => {
      const voteObj = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(voteObj)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBe(110);
          expect(body.article.article_id).toBe(1);
          expect(body.article.title).toBe(
            "Living in the shadow of a great man"
          );
          expect(body.article.author).toBe("butter_bridge");
          expect(body.article.body).toBe("I find this existence challenging");
          expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
        });
    });

    it("200 - Respond with the votes column being subtracted with article_id 2", () => {
      const voteObj = {
        inc_votes: -10,
      };
      return request(app)
        .patch("/api/articles/2")
        .send(voteObj)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBe(voteObj.inc_votes);
        });
    });

    it("400 - respond with a bad request if the user forgets to enter a vote count", () => {
      const voteObj = {
        inc_votes: "",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(voteObj)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
          expect(response.badRequest).toBe(true);
          expect(response.statusCode).toBe(400);
        });
    });

    it("400 - respond and inform that an invalid article has been entered", () => {
      const voteObj = {
        inc_votes: -10,
      };

      return request(app)
        .patch("/api/articles/mountain")
        .send(voteObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    it("404 - respond with the appopriate message letting the user know that the article is not found if entered an article_id that is not there", () => {
      const voteObj = {
        inc_votes: 10,
      };

      return request(app)
        .patch("/api/articles/99")
        .send(voteObj)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found");
        });
    });
  });

  describe("CORE: DELETE /api/comments/:comment_id", () => {
    it("204 - deletes the specified comment by given ID and returns no body back", () => {
      return request(app).delete("/api/comments/3").expect(204);
    });

    it("404 - responds with appopriate error when passed with a id that does not exists", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment does not exist");
        });
    });

    /*  test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .delete('/api/teams/not-a-team')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  }); */
  });

  describe("CORE: GET /api/users", () => {
    it("200 - respond with the data that are inside the users table", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(4);
          const expectedOutput = body.users.forEach((elements) => {
            expect(elements.hasOwnProperty("username")).toBe(true);
            expect(elements.hasOwnProperty("name")).toBe(true);
            expect(elements.hasOwnProperty("avatar_url")).toBe(true);
            expect(elements.hasOwnProperty("notInsideUsers")).toBe(false);
          });
        });
    });

    it("404 - respond with a bad request if the ented invalid endpoint", () => {
      return request(app).get("/api/non-existent-user").expect(404)
    });
  });



});

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRef", () => {
  test("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = createRef(input);
    const expected = {};
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with a single items", () => {
    const input = [{ title: "title1", article_id: 1, name: "name1" }];
    let actual = createRef(input, "title", "article_id");
    let expected = { title1: 1 };
    expect(actual).toEqual(expected);
    actual = createRef(input, "name", "title");
    expected = { name1: "title1" };
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with many items", () => {
    const input = [
      { title: "title1", article_id: 1 },
      { title: "title2", article_id: 2 },
      { title: "title3", article_id: 3 },
    ];
    const actual = createRef(input, "title", "article_id");
    const expected = { title1: 1, title2: 2, title3: 3 };
    expect(actual).toEqual(expected);
  });
  test("does not mutate the input", () => {
    const input = [{ title: "title1", article_id: 1 }];
    const control = [{ title: "title1", article_id: 1 }];
    createRef(input);
    expect(input).toEqual(control);
  });
});

describe("formatComments", () => {
  test("returns an empty array, if passed an empty array", () => {
    const comments = [];
    expect(formatComments(comments, {})).toEqual([]);
    expect(formatComments(comments, {})).not.toBe(comments);
  });
  test("converts created_by key to author", () => {
    const comments = [{ created_by: "ant" }, { created_by: "bee" }];
    const formattedComments = formatComments(comments, {});
    expect(formattedComments[0].author).toEqual("ant");
    expect(formattedComments[0].created_by).toBe(undefined);
    expect(formattedComments[1].author).toEqual("bee");
    expect(formattedComments[1].created_by).toBe(undefined);
  });
  test("replaces belongs_to value with appropriate id when passed a reference object", () => {
    const comments = [{ belongs_to: "title1" }, { belongs_to: "title2" }];
    const ref = { title1: 1, title2: 2 };
    const formattedComments = formatComments(comments, ref);
    expect(formattedComments[0].article_id).toBe(1);
    expect(formattedComments[1].article_id).toBe(2);
  });
  test("converts created_at timestamp to a date", () => {
    const timestamp = Date.now();
    const comments = [{ created_at: timestamp }];
    const formattedComments = formatComments(comments, {});
    expect(formattedComments[0].created_at).toEqual(new Date(timestamp));
  });
});
