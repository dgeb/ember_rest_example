App.EditContactView = Ember.Form.extend({
  templateName: 'app/templates/contacts/edit',

  submitForm: function() {
    var self = this;

    this.get("contact")
      .update(this.serialize())
        .fail( function(e) {
          App.displayError(e);
        })
        .done( function() {
          self.get("parentView").stopEditing();
        });
  }
});