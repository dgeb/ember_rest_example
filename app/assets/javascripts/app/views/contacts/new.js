App.NewContactView = Ember.Form.extend({
  templateName: 'app/templates/contacts/edit',

  init: function() {
    this.set("contact", App.Contact.create());
    this._super();
  },

  submitForm: function() {
    var self = this;

    App.contactsController.create(this.serialize())
      .fail( function(e) {
        App.displayError(e);
      })
      .done(function() {
        self.get("parentView").set('showNew', false)
      });
  }
});