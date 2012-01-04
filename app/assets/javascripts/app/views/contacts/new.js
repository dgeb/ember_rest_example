App.NewContactView = Em.Form.extend({
  templateName: 'app/templates/contacts/new',

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