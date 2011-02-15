$(function(){
  // przydatne zmienne do całego programu:
  var notepad = $('#NotePad'),
      sidebar = notepad.find('#Sidebar'),
      noteBody = noteBody.find('#Body'),
      appInstance = null,
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
  
  // instancja kontrolera/aplikacji:
  appInstance = new NotepadController();
  // ręcznie wchodzimy do konkretnego kontrolera:
  appInstance.index();                           
  // zaczynamy śledzić zmiany adresów:
  Backbone.history.start();
  
})