App.Contact  = Em.Object.extend({
  fullName: Em.computed(function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }).property('first_name', 'last_name'),

  data: Em.computed(function() {
    return {contact: {first_name: this.get('first_name'),
                      last_name: this.get('last_name')}};
  })
});

App.Contact.reopenClass({
  // Let's do some crude validation here in which errors are returned as a string;
  // successful validation returns true.
  validateProperties: function(hash) {
    if (hash.first_name === '' || hash.last_name === '')
      return "Contacts require both a first and last name";
    else
      return true;
  }
});