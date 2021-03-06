Todos = new Meteor.Collection('todos');

if (Meteor.isClient) {

  todosSub = Meteor.subscribe('todos');

  Template.TodosPanel.helpers({
    items: function () {
      return Todos.find({}, {
        sort: {
          created_at: -1
        }
      });
    },

    isDoneClass: function() {
      return this.is_done ? 'done' : '';
    }
  });

  Template.TodoItem.helpers({
    isDoneChecked: function() {
      return this.is_done ? 'checked' : '';
    }
  });

  Template.TodoItem.events({
    'click [name=is_done]': function(e, tmpl) {
      var id = this._id;
      var isDone = tmpl.find('input').checked;
      Todos.update({_id: id}, {
        $set:  {
          is_done: isDone
        }
      });
    },
    'click .delete': function() {
      Todos.remove(this._id)
    }
  });

  Template.CreateTodoItem.events({
    'submit form': function(e, tmpl) {
      e.preventDefault();

      var subject = tmpl.find('input').value;

      Todos.insert({
        subject: subject,
        created_at: new Date,
        is_done: false,
        user_id: Meteor.userId()
      });

      var form = tmpl.find('form');
      form.reset();
    }
  });

  Template.TodosCount.helpers({
    completedCount: function() {
      return Todos.find({is_done: true}).count();
    },

    totalCount: function() {
      return Todos.find({}).count();
    },

    isBadass: function() {
      var completed = Todos.find({is_done: true}).count();
      var total = Todos.find({}).count();
      if ((completed > 0) && ( completed === total)) {
        return true;
      } else {
        return false;
      }
    }

  })
}

if (Meteor.isServer) {
  Meteor.publish('todos', function() {
    return Todos.find({user_id: this.userId});
  });

  Todos.allow({
    insert: function (userId, doc) {
      return userId;
    },
    update: function (userId, doc, fieldNames, modifier) {
      return doc.user_id === userId;
    },
    remove: function (userId, doc) {
      return doc.user_id === userId;
    }
  });
}
