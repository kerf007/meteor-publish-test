import { Meteor } from "meteor/meteor";

const Posts = new Mongo.Collection("posts");

Posts.remove({});
Posts.insert({
  title: "Some title",
  content: "some content"
});

Meteor.publish("posts", function() {
  const self = this;
  this.autorun(function() {
    const transform = doc => {
      doc.foo = "foo";
      doc.bar = "bar";
      return doc;
    };
    // let cursor = null;
    let cursor = Posts.find({});
    let handle = cursor.observe({
      added: doc => {
        this.added("posts", doc._id, transform(doc));
      },
      changed: (newDoc, oldDoc) => {
        this.changed("posts", oldDoc._id, transform(newDoc));
      },
      removed: oldDoc => {
        this.removed("posts", oldDoc._id);
      }
    });

    this.onStop(() => handle.stop());
    return cursor;
  });
});

Meteor.startup(() => {
  // code to run on server at startup
});
