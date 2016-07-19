jQuery(document).ready(function($) {
    $("#line_chart").toggle();
  $('.facet-view-simple').facetview({
    search_url: 'http://localhost:8983/solr/collection1/query?',
    search_index: 'solr',
    facets: [
        {'field':'time_stamp', 'display': 'TIME'}, 
        {'field':'content_type', 'display': 'Content-Type'},
        {'field':'Geographic_NAME', 'display': 'Geo Name'}
    ],
    paging: {
      from: 0,
      size: 10
    }
  });
    
    $("#vis").click(function(){
        $("#line_chart").toggle();
    });
  // set up form
  $('.demo-form').submit(function(e) {
    e.preventDefault();
    var $form = $(e.target);
    var _data = {};
    $.each($form.serializeArray(), function(idx, item) {
      _data[item.name] = item.value;
    });
    $('.facet-view-here').facetview(_data);
  });
});

