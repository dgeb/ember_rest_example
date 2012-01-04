App.EditContactView = Em.Form.extend({
  templateName: 'app/templates/contacts/edit',

  submitForm: function() {
    var data = this.serialize();

    var valid = App.Contact.validateProperties(data);

    if (valid === true) {
      // save the parentView so that this view can be hidden
      // after saving this record
      var parentView = this.get("parentView");

      this.get("contact")
        .setProperties(data)
        .save()
        .done( function() {
          parentView.stopEditing();
        });
    }
    else {
      alert(valid);
    }
  }
});