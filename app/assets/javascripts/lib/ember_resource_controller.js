// A controller for RESTful resources
//
// Override this controller and include the following:
//
// * `type` -- an Ember.Object class; the class must have a 'data' property that
//      returns a json representation of the object
// * `url` -- the base url of the resource (e.g. '/contacts')
// * `resourceUrl` -- (optional) overrides `url` with a url to individual resources
//      in this collection (e.g. '/contacts/%@'). Set this property if individual resources
//      can not be found at `url/id`.
Ember.ResourceController = Ember.ArrayController.extend({
  url:     Ember.required(),
  type:    Ember.required(),
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

    jQuery.getJSON(this.url, function(data) {
      self.set("content", []);
      self.loadAll(data);
    });
  },

  updateResource: function(resource) {
    return jQuery.ajax({
      url: this._resourceUrl(resource.get('id')),
      data: resource.get('data'),
      dataType: 'json',
      type: 'PUT'
    });
  },

  createResource: function(resource) {
    var self = this;

    return jQuery.ajax({
      url: this._resourceUrl(''),
      data: resource.get('data'),
      dataType: 'json',
      type: 'POST',
      success: function(data) { self.load(data); }
    });
  },

  destroyResource: function(resource) {
    var self = this;

    return jQuery.ajax({
      url: this._resourceUrl(resource.get('id')),
      dataType: 'json',
      type: 'DELETE',
      success: function() { self.removeObject(resource); }
    });
  },

  _resourceUrl: function(id) {
    var resourceUrl = this.resourceUrl;
    if (resourceUrl === undefined)
      resourceUrl = this.url + '/%@';
    return resourceUrl.fmt(id);
  }
});
