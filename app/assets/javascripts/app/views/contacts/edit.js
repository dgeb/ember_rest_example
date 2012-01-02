App.EditContactView = Em.View.extend({
  templateName: 'app/templates/contacts/edit',
  tagName: 'form',

  submit: function(evt) {
    evt.preventDefault();

    var data = {
      first_name: this.$().find("#first_name").val(),
      last_name: this.$().find("#last_name").val()
    };
    var valid = App.Contact.validateProperties(data);

    if (valid === true) {
      var self = this;

      var contact = this.get("contact");
      contact.setProperties(data);
      App.contactsController.updateResource(contact)
        .done( function() {self.get("parentView").stopEditing();});
    }
    else {
      alert(valid);
    }

    // prevent event from bubbling up
    return false;
  }
});