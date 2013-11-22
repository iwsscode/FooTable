(function ($, w, undefined) {
  if (w.footable === undefined || w.foobox === null)
    throw new Error('Please check and make sure footable.js is included in the page and is loaded prior to this script.');

  var defaults = {
     columns: {
            enabled: true,
            toggleContainer: null,
            idprefix: null,
            persist: null
          }
    /*
       Plugin options here, example:

        var defaults = {
          columns: {
            enabled: true
          }
        };

       This would allow you to access this option using ft.options.columns.enabled
    */
  };

  function columns() {
    var p = this;
    p.name = 'Footable columns';
    p.init = function(ft) {

      $(ft.table).bind({
        'footable_initialized': function(e){
          var opts = e.ft.options.columns;
          var thead = $(ft.table).find('thead');
          var tbody = $(ft.table).find('tbody');
          var headers = $(thead).find('th');
          var rows = $(tbody).find('tr');
          var container = opts.checkContainer ? $(opts.checkContainer) : $('<div class="table-menu table-menu-hidden"><ul /></div>');
          
          headers.each(function(i) {
            var th = $(this),
              id = th.attr("id"),
              classes = th.attr("class");
         
              // assign an id to each header, if none is in the markup
              if (!id) {
                id = ( opts.idprefix ? opts.idprefix : "col-" ) + i;
                th.attr("id", id);
              }

              rows.each(function(){
                var cell = $(this).find("th, td").eq(i);
                cell.attr("headers", id);
                if (classes) { cell.addClass(classes); }
              });
              //alert($(this).text());

              if ( !th.is("." + opts.persist) ) {
                var toggle = $('<li><input type="checkbox" name="toggle-cols" id="toggle-col-'+i+'" value="'+id+'" /> <label for="toggle-col-'+i+'">'+th.text()+'</label></li>');
                container.find("ul").append(toggle);
                
                toggle.find("input")
                  .change(function(){
                     var input = $(this),
                        val = input.val(),
                        cols = $("#" + val + ", [headers="+ val +"]");
                     
                     if (input.is(":checked")) { cols.show(); }
                     else { cols.hide(); }
                  })
                  .bind("updateCheck", function(){
                     if ( th.css("display") == "table-cell" || th.css("display") == "inline" ) {
                        $(this).attr("checked", true);
                     }
                     else {
                        $(this).attr("checked", false);
                     }
                  })
                  .trigger("updateCheck");
              }
            });
            if (!opts.checkContainer) {
              var menuWrapper = $('<div class="table-menu-wrapper" />'),
                menuBtn = $('<a href="#" class="table-menu-btn">Display</a>');
                     
              menuBtn.click(function(){
                container.toggleClass("table-menu-hidden");
                return false;
              });
                     
              menuWrapper.append(menuBtn).append(container);
              $(ft.table).before(menuWrapper);
              $(document).click(function(e){
                if ( !$(e.target).is( container ) && !$(e.target).is( container.find("*") ) ) {
                  container.addClass("table-menu-hidden");
                }
              });
            }
          },
          'footable_breakpoint': function(e){
            $(container).find('input').trigger('updateCheck');
          }
        /*
           Bind to relevant events here to modify/add functionality to Footable, example:

            $(ft.table).bind({
              'footable_initialized': function(e){
                if (opts.enabled === true){
                  alert('Hello World');
                }
              }
            });

           This would listen for the 'footable_initialized' event and when called check if the plugin is enabled
           and if it is alert 'Hello World' to the user.
        */
        
      });
    };
  }
  
  w.footable.plugins.register(columns, defaults);
  
})(jQuery, window);