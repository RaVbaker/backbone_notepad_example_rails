$(function(){
  // przydatne zmienne do całego programu:
  var notepad = $('#NotePad'),
      sidebar = notepad.find('#Sidebar'),
      noteBody = notepad.find('#Body'),
      appInstance = null,
      
      Note = Backbone.Model.extend({
        defaults: {
          title: 'Example title',
          author: 'Me',
          content: 'Anything you want!'
        }
      }),
      
      Notes = Backbone.Collection.extend({
        model: Note
      }),
      
      NotesListView = Backbone.View.extend({
        tagName: 'UL',
        
        className: 'notesList',
        
        // template for single note
        noteTemplate: _.template('<li class="note"><strong><%= get("title") %></strong> by <em><%= get("author") %></em></li>'),
        
        initialize: function(options) {
          this.render();
          options.parent.html('');
          $(this.el).appendTo(options.parent);
        },
        
        render: function() {
          $(this.el).append(this.collection.map(this.noteTemplate).join(''));
        }
      }),
      
      NotepadController = Backbone.Controller.extend({
        
        routes: {
          'index': 'index',
          'show/:id': 'show',
          'edit/:id': 'edit',
          'destroy/:id': 'destroy'
        },
        
        initialize: function(options) {
          this.notes = new Notes(options.notes);
        },
        
        
        index: function() {
          this.notes_view = new NotesListView({collection: this.notes, parent: sidebar })
        },
        
        show: function(id) {
          
        },
        
        edit: function(id) {
          
        },
        
        destroy: function(id) {
          
        }
        
      });
  
  // instancja kontrolera/aplikacji:
  appInstance = new NotepadController({notes: [{title:"Sample note", author: "Rafal", content: "Some text"}] || window.notesList});
  // ręcznie wchodzimy do konkretnego kontrolera:
  appInstance.index();                           
  // zaczynamy śledzić zmiany adresów:
  Backbone.history.start();
  
});