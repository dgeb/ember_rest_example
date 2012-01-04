App.NewContactView = Em.Form.extend({
  templateName: 'app/templates/contacts/new',

  submitForm: function() {
    var self = this;

    App.contactsController.create(this.serialize())
      .done(function() {
        self.get("parentView").set('showNew', false)
      })
      .fail( function(e) {
        alert(e);
      });
  }
});