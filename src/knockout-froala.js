/**
 * knockout binding for Froala Editor
 */

(function() { 'use strict';

  // locals
  var unwrap = ko.utils.unwrapObservable;
  var editorInstance =null;
  /**
   * initiate froala editor, listen to its changes
   * and updates the underlying observable model
   *
   * @param {element} element
   * @param {object} value
   * @param {object} bindings
   * @api public
   */

  function init( element, value, bindings ) {
   
    var model = value();
    var allBindings = unwrap( bindings() );
    var options = ko.toJS( allBindings.froalaOptions );


    // update underlying model whenever editor content changed
    var processUpdateEvent = function (e) {
    
      if (ko.isWriteableObservable(model)) {
        if(editorInstance!=null)
        {
          var editorValue = editorInstance.html.get();
          var current = model();
          if (current !== editorValue) {
              model(editorValue);
          }
        }
        
      }
  }
options.events = {
  initialized: function() {
    editorInstance=this;
    var modelValue = unwrap( value() );
    editorInstance.html.set( modelValue );
    // provide froala editor instance for flexibility
    if(allBindings.froalaInstance && ko.isWriteableObservable( allBindings.froalaInstance ) ) {
      allBindings.froalaInstance( editorInstance );
    }
  },
  'contentChanged': processUpdateEvent,
  'paste.after':processUpdateEvent
}
 new FroalaEditor(element,options||{});
 

    

    

    // cleanup editor, when dom node is removed
    ko.utils.domNodeDisposal.addDisposeCallback( element, destroy( element ) );

    // do not handle child nodes
    return { controlsDescendantBindings: true };
  }


  /**
   * update froala editor whenever underlying observable model
   * is updated
   *
   * @param {element} element
   * @param {object} value
   * @api public
   */

  function update( element, value ) {
  
    var modelValue = unwrap( value() );
 
    if( editorInstance == null  ) {
      return;
    }
    
     var editorValue = editorInstance.html.get();
     
    // avoid any un-necessary updates
    if( editorValue !== modelValue && (typeof modelValue === 'string'  || modelValue === null)) {
      editorInstance.html.set( modelValue );
     
    }
  }


  /**
   * destroy froala editor instance
   *
   * @param {dom} element
   * @return {function} handler
   * @api private
   */

  function destroy( element ) {
    return function() {
      if( editorInstance!=null ) {
        editorInstance.destroy();
      }
    }
  }


  /**
   * expose `froala` binding handler methods
   */

  ko.bindingHandlers.froala = {
    init: init,
    update: update
  }

})();
