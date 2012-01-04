// A model class for RESTful resources
//
// Extend this class and define the following properties:
//
// * `name` -- the name used to contain the serialized data in this object's json
//      representation
// * `properties` -- an array of property names to be returned in this object's
//      json representation
// * `url` -- (optional) the base url of the resource (e.g. '/contacts/active');
//      will default to the `url` for `type`
//
// You may also wish to override the following methods:
//
// * `serialize()`
// * `serializeProperty(prop)`
// * `deserialize(json)`
// * `deserializeProperty(prop, value)`
// * `validate(userData)`
//
Ember.Resource = Ember.Object.extend({
  name:       Ember.required(),
  properties: Ember.required(),
  url:        Ember.required(),

  // Generate this resource's JSON representation
  //
  // Override this or `serializeProperty` to provide custom serialization
  serialize: function() {
    var ret = {},
        prop;

    ret[this.name] = {};
    for(var i = 0; i < this.properties.length; i++) {
      prop = this.properties[i];
      ret[this.name][prop] = this.serializeProperty(prop);
    }
    return ret;
  },

  // Generate an individual property's JSON representation
  //
  // Override to provide custom serialization
  serializeProperty: function(prop) {
    return this.get(prop);
  },

  // Set this resource's properties from JSON
  //
  // Override this or `deserializeProperty` to provide custom deserialization
  deserialize: function(json) {
    Ember.beginPropertyChanges(this);
    for(var prop in json) {
      if (json.hasOwnProperty(prop)) this.deserializeProperty(prop, json[prop]);
    }
    Ember.endPropertyChanges(this);
    return this;
  },

  // Set an individual property from its value in JSON
  //
  // Override to provide custom serialization
  deserializeProperty: function(prop, value) {
    this.set(prop, value);
  },

  // Validate and then save a set of changes
  //
  // Provide a `validate(userData)` method to perform validations.
  update: function(userData) {
    if (this.validate !== undefined) {
      var error = this.validate(userData);
      if (error) {
        return {
          fail: function(f) { f(error); return this; },
          done: function() { return this; },
          always: function(f) { f(); return this; }
        };
      }
    }
    return this.setProperties(userData).save();
  },

  // Create (if new) or update (if existing) record via ajax
  //
  // If successful, updates this record's id and other properties
  // by calling `deserialize()` with the data returned.
  save: function() {
    var self = this,
        isNew = (this.get('id') === undefined);

    return jQuery.ajax({
      url: this._url(),
      data: this.serialize(),
      dataType: 'json',
      type: (isNew ? 'POST' : 'PUT'),
      success: function(json) {
        // Update properties
        if (json)
          self.deserialize(json);
      }
    });
  },

  // Delete record via ajax
  destroy: function() {
    var self = this;

    return jQuery.ajax({
      url: this._url(),
      dataType: 'json',
      type: 'DELETE'
    });
  },

  // The URL for this resource, base on `url` and `id`
  // (which will be undefined for new resources).
  _url: function() {
    var url = this.url,
        id = this.get('id');

    if (id !== undefined)
      url += '/' + id;

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

  // Create and load a single `Ember.Resource` from JSON
  load: function(json) {
    var resource = this.get('type').create().deserialize(json);
    this.pushObject(resource);
  },

  // Create and load `Ember.Resource` objects from a JSON array
  loadAll: function(json) {
    for (var i=0; i < json.length; i++)
      this.load(json[i]);
  },

  // Replace this controller's contents with an ajax call to `url`
  findAll: function() {
    var self = this;

    return jQuery.ajax({
      url: this._url(),
      dataType: 'json',
      type: 'GET',
      success: function(json) {
        self.set("content", []);
        self.loadAll(json);
      }
    });
  },

  // Given data entered by a user, create a new resource with ajax
  //
  // `Ember.Resource.update()` will validate the user-entered data.
  // If validation and the ajax call are successful, the new resource
  // will be added to this controller's contents.
  create: function(userData) {
    var self = this;
    var resource = this.get('type').create();

    return resource
      .update(userData)
        .done(function() {
          self.pushObject(resource);
        });
  },

  // Delete a resource with ajax
  //
  // If successful, the resource will be removed from this controller's contents.
  destroy: function(resource) {
    var self = this;

    return resource
      .destroy()
      .done(function() {
        self.removeObject(resource);
      });
  },

  // Determine the base URL for ajax calls
  //
  // Will use the `url` set for this controller, or if that's missing,
  // the `url` specified for `type`.
  _url: function() {
    if (this.url === undefined)
      return this.get('type').prototype.url;
    else
      return this.url;
  }
});
