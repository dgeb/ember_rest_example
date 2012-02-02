App.ShowContactView = Ember.View.extend({
  templateName: 'app/templates/contacts/show',
  classNames:   ['show-contact'],
  tagName:      'tr',

  doubleClick: function() {
    this.showEdit();
  },

  showEdit: function() {
    this.set('isEditing', true);
  },

  hideEdit: function() {
    this.set('isEditing', false);
  },

  destroyRecord: function() {
    var contact = this.get("contact");

    contact.destroyResource()
      .fail( function(e) {
        App.displayError(e);
      })
      .done(function() {
        App.contactsController.removeObject(contact);
      });
  }
});