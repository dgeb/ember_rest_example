App.EditContactView = Em.Form.extend({
  templateName: 'app/templates/contacts/edit',

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

      var contact = this.get("contact");

      contact.setProperties(data);

      App.contactsController.updateResource(contact)
        .done( function() { parentView.stopEditing(); });
    }
    else {
      alert(valid);
    }
  }
});