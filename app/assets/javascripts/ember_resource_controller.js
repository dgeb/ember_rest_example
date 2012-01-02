Ember.ResourceController = Ember.ArrayController.extend({
  type: Ember.required(),

  content: [],

  load: function(json) {
    this.pushObject(this.get('type').create(json));
  },

  loadAll: function(jsonArray) {
    for (var i=0; i < jsonArray.length; i++)
      this.load(jsonArray[i]);
  },

  findAll: function() {
    var self = this;

    jQuery.getJSON(this._collectionUrl(), function(data) {
      self.set("content", []);
      self.loadAll(data);
    });
  },

  updateResource: function(resource) {
    return jQuery.ajax({
      url: this._resourceUrl().fmt(resource.get('id')),
      data: resource.get('data'),
      dataType: 'json',
      type: 'PUT'
    });
  },

  createResource: function(resource) {
    var self = this;

    return jQuery.ajax({
      url: this._collectionUrl(),
      data: resource.get('data'),
      dataType: 'json',
      type: 'POST',
      success: function(data) { self.load(data); }
    });
  },

  destroyResource: function(resource) {
    var self = this;

    return jQuery.ajax({
      url: this._resourceUrl().fmt(resource.get('id')),
      dataType: 'json',
      type: 'DELETE',
      success: function() { self.removeObject(resource); }
    });
  },

  _collectionUrl: function() {
    if (this.collectionUrl !== undefined)
      return this.collectionUrl;
    else
      return this.url;
  },

  _resourceUrl: function() {
    if (this.resourceUrl !== undefined)
      return this.resourceUrl;
    else
      return this._collectionUrl() + '/%@';
  }
});
