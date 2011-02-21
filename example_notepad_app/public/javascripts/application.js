$(function(){
  // przydatne zmienne do całego programu:
  var notepad = $('#NotePad'),
      sidebar = notepad.find('#Sidebar'),
      noteBody = notepad.find('#Body'),
      // appInstance = null,
      
      Note = Backbone.Model.extend({
        defaults: {
          title: 'Example title',
          author: 'Me',
          content: 'Anything you want!'
        }
      }),
      
      Notes = Backbone.Collection.extend({
        model: Note,
        url: '/notes'
      }),
      
      NotesListView = Backbone.View.extend({
        tagName: 'UL',
        
        className: 'notesList', 
        
        events: {
          'click .show': 'visualizeOpenedNote'
        },
        
        // template for single note
        noteTemplate: _.template('<li class="note" id=""><a class="show" data-cid="<%= cid %>" href="#show/<%= cid %>"><strong><%= get("title") %></strong></a> by <em><%= get("author") %></em> <a title="edit note"  href="#edit/<%= cid %>"><img src="/images/icons/note_edit.png" alt="edit" /></a> <a  title="delete note"  href="#destroy/<%= cid %>"><img src="/images/icons/note_delete.png" alt="delete"  /></a></li>'),
        
        initialize: function(options) {
          _.bindAll(this, 'render');
          
          this.collection.bind('change', this.render);
          this.collection.bind('remove', this.render);
          // usuwanie z kolekcji powoduje jednoczesnie usuniecie z bazy...
          this.collection.bind('remove', function(model, collection){
            model.collection = collection;
            model.destroy();            
          });
          this.render();
          options.parent.html('');
          $(this.el).appendTo(options.parent);
        },
        
        render: function() {          
          $(this.el).html(this.collection.map(this.noteTemplate).join(''))
                    .append('<li><a href="#add"><img src="/images/icons/note_add.png" class="addNote" alt="add note"/> add new note</a></li>');
        },
        
        visualizeOpenedNote: function(e){                           
          this.$('li').css("background-color","");
          $(e.target).parents('li').css("background-color", '#fee');
        }
      }),
      
      NoteFormView = Backbone.View.extend({
        tagName: 'div',
        className: 'NoteCreateView',
        
        formTemplate: _.template('<form><input type="hidden" name="cid" value="<%= cid %>" /><fieldset><legend>Fill up form</legend><p><label for="title">Title:</label><input type="text" name="title" value="<%= get("title") %>" /></p><p><label for="content">Content:</label><textarea cols="30" rows="4" name="content"><%= get("content") %></textarea></p><p><label for="author">Author:</label><input type="text" name="author" value="<%= get("author") %>" /></p><p><input type="submit" value="Save" class="save"/></p></fieldset></form>'),
        
        events: {
          'submit form': 'save'
        },
        
        initialize: function(options) {
          this.model = this.model || new Note();
          
          this.render();
          
          $(options.parent).append(this.el);
          $(this.el).attr('title', 'Note edit window').dialog({beforeClose: function() { window.location.hash = "#index";}});
        },
        
        render: function() {
          $(this.el).html(this.formTemplate(this.model));
        },
        
        save: function(e) {
          e.preventDefault();
          var modelJson = {}, model = null;
          
          _.each($(e.target).serializeArray(), function(val) {
            modelJson[val.name] = val.value;
          });
                             
          // get existing model and update or create new one
          if (model = this.collection.getByCid(modelJson.cid)) {
            model.set(modelJson);
          } else {
            model = new Note(modelJson);
            this.collection.add(model);
          }
          // save on server
          model.save();
               
          $(this.el).dialog('close').remove();
          
          window.location.hash = "#index";
          return false;
        }
        
        
      }),
      
      NoteView = Backbone.View.extend({
        noteTemplate: _.template('<h2><%= get("title") %></h2><pre><%= get("content") %></pre><p>Author: <%= get("author") %></p><p><a title="edit note" href="#edit/<%= cid %>"><img src="/images/icons/note_edit.png" alt="edit" /></a> <a title="remove note" href="#destroy/<%= cid %>"><img src="/images/icons/note_delete.png" alt="delete" /></a></p>'), 
        
        
        
        initialize: function(options){
          _.bindAll(this, 'render','reset');
          this.render();            
          
          this.model.bind('change', this.render);
          this.model.bind('remove', this.reset);
        },
        
        render: function(){
          $(this.el).hide().html(this.noteTemplate(this.model)).show('slow');
        },
        reset: function() {
          $(this.el).hide();
        }
      })
      
      NotepadController = Backbone.Controller.extend({
        
        routes: {
          'index': 'index',
          'add': 'add',
          'show/:id': 'show',
          'edit/:id': 'edit',
          'destroy/:id': 'destroy'
        },
        
        initialize: function(options) {
          this.notes = new Notes(options.notes);
          this.notes_view = new NotesListView({collection: this.notes, parent: sidebar });
        },
        
        
        index: function() {
          noteBody.html('<h2>Mess up with some notes!</h2>').show();                                                        
        },
        
        add: function() {
          new NoteFormView({collection: this.notes, parent:notepad});
        },
        
        show: function(id) {
          new NoteView({model: this.notes.getByCid(id), el: noteBody});
        },
        
        edit: function(id) {
          new NoteFormView({collection:  this.notes, parent:notepad, model: this.notes.getByCid(id)});
        },
        
        destroy: function(id) {
          var noteToDelete = this.notes.getByCid(id);
          if (confirm('are you sure?')) {
            this.notes.remove(noteToDelete);
          }
          window.location.href = "#index";
        }
        
      });
  
  // instancja kontrolera/aplikacji:
  appInstance = new NotepadController({notes: window.notesList});
  // ręcznie wchodzimy do konkretnego kontrolera:
  appInstance.index();                           
  // zaczynamy śledzić zmiany adresów:
  Backbone.history.start();
  
});