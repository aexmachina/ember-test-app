import Ember from 'ember';

var TestModel = DS.Model.extend({
  belongsTo: DS.belongsTo('testmodel', {inverse: 'belongsTo'}),
  hasMany: DS.hasMany('testmodel', {inverse: 'hasMany'})
});

TestModel.reopenClass({
  typeKey: 'testmodel',
  FIXTURES: [
    {id: 1, hasMany: [2, 3]},
    {id: 2, belongsTo: 1},
    {id: 3},
    {id: 4}
  ]
});

var helper, subject, store;
module('example', {
  setup: function() {
    var container = new Ember.Container();
    container.register('model:testmodel', TestModel);
    container.register('adapter:application', DS.FixtureAdapter);
    setupContainer(container);
    store = container.lookup('store:main');
  }
});

test('handles added belongsTo', function() {
  run(function() {
    return store.findAll('testmodel').then(function(models) {
      subject = store.createRecord('testmodel');
      subject.set('belongsTo', models.findBy('id', '1'));
      equal(subject.get('belongsTo.id'), 1);

      subject.set('belongsTo', null);
      equal(subject.get('belongsTo.id'), null);

      subject.set('belongsTo', models.findBy('id', '2'));
      equal(subject.get('belongsTo.id'), 2);
    });
  });
});

test('handles loaded belongsTo', function() {
  run(function() {
    return store.findAll('testmodel').then(function(models) {
      subject = models.findBy('id', '2');
      equal(subject.get('belongsTo.id'), 1);

      subject.set('belongsTo', null);
      equal(subject.get('belongsTo.id'), null);

      subject.set('belongsTo', models.findBy('id', '2'));
      equal(subject.get('belongsTo.id'), 2); // this assertion fails
    });
  });
});

test('handles created hasMany', function() {
  run(function() {
    return store.findAll('testmodel').then(function(models) {
      subject = store.createRecord('testmodel');

      var relation = subject.get('hasMany');
      relation.pushObject(models.findBy('id', '1'));
      ok(relation.contains(models.findBy('id', '1')));
    });
  });
});

export function setupContainer(container) {
  container.register('store:main', DS.Store);
  container.register('transform:boolean', DS.BooleanTransform);
  container.register('transform:date', DS.DateTransform);
  container.register('transform:number', DS.NumberTransform);
  container.register('transform:string', DS.StringTransform);
}

export function run(fn) {
  stop();
  Ember.run(function() {
    if (fn.length === 0) {
      start();
    }
    var rv = fn.call(this, start);
    if (rv.then) {
      stop();
      rv.then(start);
    }
  });
}
