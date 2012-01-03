App.NewContactView = Em.Form.extend({
  templateName: 'app/templates/contacts/new',

  submitForm: function() {
    var data = {
      first_name: this.$().find("#first_name").val(),
      last_name: this.$().find("#last_name").val()
    };
    var valid = App.Contact.validateProperties(data);

    if (valid === true) {
      // save the parentView so that this view can be hidden
      // after saving this record
      var parentView = this.get("parentView");

      var contact = App.Contact.create(data);

      App.contactsController.createResource(contact)
        .done(function() { parentView.set('showNew', false) });
    }
    else {
      alert(valid);
    }
  }
});