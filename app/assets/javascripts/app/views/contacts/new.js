App.NewContactView = Ember.View.extend({
  tagName:      'form',
  templateName: 'app/templates/contacts/edit',

  init: function() {
    this._super();
    this.set("contact", App.Contact.create());
  },

  didInsertElement: function() {
    this._super();
    this.$('input:first').focus();
  },

  cancelForm: function() {
    this.get("parentView").hideNew();
  },

  submit: function(event) {
    var self = this;
    var contact = this.get("contact");

    event.preventDefault();

    contact.saveResource()
      .fail( function(e) {
        App.displayError(e);
      })
      .done(function() {
        App.contactsController.pushObject(contact);
        self.get("parentView").hideNew();
      });
  }
});