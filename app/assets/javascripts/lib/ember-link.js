Ember.Link = Ember.View.extend(Ember.TargetActionSupport, {
  classNames:        ['ember-link'],
  tagName:           'a',
  attributeBindings: ['href'],
  href:              '#',
  target:            'parentView',
  propagateEvents:   false,

  click: function(evt) {
    if (this.triggerAction()) {
      evt.preventDefault();
      return Ember.get(this, 'propagateEvents');
    }
  }
});
