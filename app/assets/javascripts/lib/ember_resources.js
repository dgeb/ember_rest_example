// A model class for RESTful resources
Ember.Resource = Ember.Object.extend({
  name:       Ember.required(),
  properties: Ember.required(),
  url:        Ember.required(),

  data: function() {
    var ret = {},
        prop;

    ret[this.name] = {};
    for(var i = 0; i < this.properties.length; i++) {
      prop = this.properties[i];
      ret[this.name][prop] = this.get(prop);
    }
    return ret;
  }
});

// A controller for RESTful resources
//
// Override this controller and include the following:
//
// * `type` -- an Ember.Resource class; the class must have a 'data' property that
//      returns a json representation of the object
// * `url` -- (optional) the base url of the resource (e.g. '/contacts')
Ember.ResourceController = Ember.ArrayController.extend({
  type:     Ember.required(),
  content:  [],

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
      data: resource.data(),
      dataType: 'json',
      type: 'PUT'
    });
  },

  createResource: function(resource) {
    var self = this;

    return jQuery.ajax({
      url: this._resourceUrl(''),
      data: resource.data(),
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

  _url: function() {
    if (this.url === undefined)
      return this.get('type').prototype.url;
    else
      return this.url;
  },

  _resourceUrl: function(id) {
    var typeUrl = this.get('type').prototype.url;
    return (typeUrl !== undefined ? typeUrl : this.url) + '/' + id;
  }
});
