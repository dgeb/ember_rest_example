App.NewContactView = Em.View.extend({
  templateName: 'app/templates/contacts/new',
  tagName: 'tr',

  submit: function(evt) {
    evt.preventDefault();

    var data = {
      first_name: this.$().find("#first_name").val(),
      last_name: this.$().find("#last_name").val()
    };
    var valid = App.Contact.validateProperties(data);

    if (valid === true) {
      var parentView = this.get("parentView");

      var contact = App.Contact.create(data);

      App.contactsController.createResource(contact)
        .done(function() {parentView.set('showNew', false)});
    }
    else {
      alert(valid);
    }

    // prevent event from bubbling up
    return false;
  }
});