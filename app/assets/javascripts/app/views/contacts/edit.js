App.EditContactView = Ember.Form.extend({
  templateName: 'app/templates/contacts/edit',

  submitForm: function() {
    var self = this;
    var contact = this.get("contact");

    contact.save()
      .fail( function(e) {
        App.displayError(e);
      })
      .done( function() {
        self.get("parentView").stopEditing();
      });
  }
});