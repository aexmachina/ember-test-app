export default Ember.ObjectController.extend({
  test: function() {
    this.get('comments').mapBy('post');
  }.observes('comments.[]')
});
