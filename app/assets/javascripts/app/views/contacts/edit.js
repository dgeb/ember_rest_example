App.EditContactView = Em.Form.extend({
  templateName: 'app/templates/contacts/edit',

  submitForm: function() {
    var self = this;

    this.get("contact")
      .update(this.serialize())
        .done( function() {
          self.get("parentView").stopEditing();
        })
        .fail( function(e) {
          alert(e);
        });
  }
});