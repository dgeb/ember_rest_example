App.EditContactView = Ember.Form.extend({
  templateName: 'app/templates/contacts/edit',

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