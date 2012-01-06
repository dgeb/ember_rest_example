App.NewContactView = Ember.Form.extend({
  templateName: 'app/templates/contacts/edit',

  init: function() {
    this.set("contact", App.Contact.create());
    this._super();
  },

  cancelForm: function() {
    this.get("parentView").hideNew();
  },

  submitForm: function() {
    var self = this;
    var contact = this.get("contact");

    contact.save()
      .fail( function(e) {
        App.displayError(e);
      })
      .done(function() {
        App.contactsController.pushObject(contact);
        self.get("parentView").hideNew();
      });
  }
});