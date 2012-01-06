App.ShowContactView = Ember.View.extend({
  templateName: 'app/templates/contacts/show',
  classNames: ['show-contact'],
  tagName: 'tr',

  doubleClick: function(evt) {
    this.showEdit();
    return false;
  },

  showEdit: function() {
    if (this.get('isEditing') === true) return;

    // create a duplicate contact record to be edited;
    // if successful, the original will be replaced in hideEdit()
    var editableContact = App.Contact.create(this.get('contact'));

    // create a new edit view and append it to this view
    this.editView = App.EditContactView.create({
      contact: editableContact,
      parentView: this
    }).appendTo(this.$('.data'));

    // set the flag to show/hide elements in the template
    this.set('isEditing', true);
  },

  hideEdit: function() {
    // remove the edit view created above
    this.editView.remove();

    // set the flag to show/hide elements in the template
    this.set('isEditing', false);
  },

  destroyRecord: function() {
    var contact = this.get("contact");

    contact.destroy()
      .done(function() {
        App.contactsController.removeObject(contact);
      });
  }
});