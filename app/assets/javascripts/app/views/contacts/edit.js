App.EditContactView = Ember.View.extend({
  tagName:      'form',
  templateName: 'app/templates/contacts/edit',

  init: function() {
    // create a new contact that's a duplicate of the contact in the parentView;
    // changes made to the duplicate won't be applied to the original unless
    // everything goes well in submitForm()
    var editableContact = App.Contact.create(this.get('parentView').get('contact'));
    this.set("contact", editableContact);
    this._super();
  },

  didInsertElement: function() {
    this._super();
    this.$('input:first').focus();
  },

  cancelForm: function() {
    this.get("parentView").hideEdit();
  },

  submit: function(event) {
    var self = this;
    var contact = this.get("contact");

    event.preventDefault();

    contact.saveResource()
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