(function ($, w, undefined) {
  if (w.footable === undefined || w.foobox === null)
    throw new Error('Please check and make sure footable.js is included in the page and is loaded prior to this script.');

  var defaults = {
    manual: {
      toggleContainer: null
    }
  };

  function manual() {
    var p = this;
    p.name = 'Footable manual';
    p.init = function(ft) {

      $(ft.table).bind({
        'footable_initialized': function(e)
        {
          var opts = e.ft.options.manual;
          var headers = $(ft.table).find('thead th');
          var container = opts.toggleContainer ? $(opts.toggleContainer) : $('<div class="table-menu table-menu-hidden"><ul /></div>');
          
          headers.each(function(i) {
            var th = $(this);
            if ( ("expand", "ignore").indexOf(th.data('class')) < 0 )
            {
              var toggle = $('<li><input type="checkbox" name="toggle-cols" id="toggle-col-'+i+'" /> <label for="toggle-col-'+i+'">'+th.text()+'</label></li>');
              container.find("ul").append(toggle);
              
              toggle.find("input")
                .change(function(){
                  var cur_breakpoint = $(ft.table).data('breakpoint');
                  if ($(this).is(":checked")) {
                    ft.columns[i].hide[cur_breakpoint] = false;
                  }
                  else {
                    ft.columns[i].hide[cur_breakpoint] = true;
                  }
                  $(ft.table).find('.'+e.ft.options.classes.detail).remove();
                  $(ft.table).trigger(e.ft.options.triggers.resize);
                  $(ft.table).trigger(e.ft.options.triggers.redraw);
                  if(!ft.hasBreakpointColumn(cur_breakpoint))
                  {
                    $(ft.table).find('.'+e.ft.options.classes.toggle).remove();
                  }
                })
                .bind("updateCheck", function(){
                  if ( th.is(':visible') ) {
                    $(this).attr("checked", true);
                  }
                  else {
                    $(this).attr("checked", false);
                  }
                })
                .trigger("updateCheck");
            }
          });
          if (!opts.toggleContainer)
          {
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
        'footable_breakpoint': function(e)
        {
          $(container).find('input').trigger('updateCheck');
        }
      });
    };
  }
  
  w.footable.plugins.register(manual, defaults);
  
})(jQuery, window);