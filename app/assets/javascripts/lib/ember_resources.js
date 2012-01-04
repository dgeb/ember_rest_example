// A model class for RESTful resources
//
// Extend this class and define the following:
//
// * `name` -- the name used to contain the serialized data in this object's json
//      representation
// * `properties` -- an array of property names to be returned in this object's
//      json representation
// * `url` -- (optional) the base url of the resource (e.g. '/contacts/active');
//      will default to the `url` for `type`
//
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
  },

  save: function() {
    var self = this,
        isNew = (this.get('id') === undefined);

    return jQuery.ajax({
      url: this._url(),
      data: this.data(),
      dataType: 'json',
      type: (isNew ? 'POST' : 'PUT'),
      success: function(data) {
        if (data)
          self.setProperties(data);
      }
    });
  },

  destroy: function() {
    var self = this;

    return jQuery.ajax({
      url: this._url(),
      dataType: 'json',
      type: 'DELETE'
    });
  },

  _url: function() {
    var url = this.url,
        id = this.get('id');

    if (id !== undefined)
      return url + '/' + id;
    else
      return url;
  }
});

// A controller for RESTful resources
//
// Extend this class and define the following:
//
// * `type` -- an Ember.Resource class; the class must have a 'data' property that
//      returns a json representation of the object
// * `url` -- (optional) the base url of the resource (e.g. '/contacts/active');
//      will default to the `url` for `type`
//
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

  refresh: function() {
    var self = this;

    jQuery.getJSON(this._url(), function(data) {
      self.set("content", []);
      self.loadAll(data);
    });
  },

  create: function(data) {
    var self = this;
    var resource = this.get('type').create(data);

    return resource
      .save()
      .done(function() {
        self.pushObject(resource);
      });
  },

  destroy: function(resource) {
    var self = this;

    return resource
      .destroy()
      .done(function() {
        self.removeObject(resource);
      });
  },

  _url: function() {
    if (this.url === undefined)
      return this.get('type').prototype.url;
    else
      return this.url;
  }
});
