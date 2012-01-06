App.EditContactView = Ember.Form.extend({
  templateName: 'app/templates/contacts/edit',

  init: function() {
    // create a new contact that's a duplicate of the contact in the parentView;
    // changes made to the duplicate won't be applied to the original unless
    // everything goes well in submitForm()
    var editableContact = App.Contact.create(this.get('parentView').get('contact'));
    this.set("contact", editableContact);
    this._super();
  },

  afterRender: function() {
    // Set initial focus
    // TODO: Is this the right place for this? Without setTimeout, Chrome gets locked up
    var self = this;
    setTimeout(function() {self.$('input:first').focus();});
  },

  cancelForm: function() {
    this.get("parentView").hideEdit();
  },

  submitForm: function() {
    var self = this;
    var contact = this.get("contact");

    contact.save()
      .fail( function(e) {
        App.displayError(e);
      })
      .done( function() {
        var parentView = self.get("parentView");
        parentView.get("contact").duplicateProperties(contact);
        parentView.hideEdit();
      });
  }
});