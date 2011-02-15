$(function(){
  // przydatne zmienne do całego programu:
  var notepad = $('#NotePad'),
      sidebar = notepad.find('#Sidebar'),
      noteBody = noteBody.find('#Body'),
      NotepadController = Backbone.Controller.extend({
        
        routes: {
          'index': 'index',
          'show/:id': 'show',
          'edit/:id': 'edit',
          'destroy/:id': 'destroy'
        },
        
        
        index: function() {
          
        },
        
        show: function(id) {
          
        },
        
        edit: function(id) {
          
        },
        
        destroy: function(id) {
          
        }
        
      });
  
  
})