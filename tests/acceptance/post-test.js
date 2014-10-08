import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: Post', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /post', function() {
  visit('/post');
  andThen(function() {
    App.__container__.lookup('controller:post').get('model').save();
  });
});

$.mockjax({
  url: '/posts',
  type: 'POST',
  responseText: {
    post: {
      id: 1,
      comments: [1, 2]
    },
    comments: [
      {id: 1, post: 1},
      {id: 2, post: 1}
    ]
  }
});
