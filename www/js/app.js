 $(document).ready(function(){
    $('.modal').modal({
    	outDuration: 100,
    	inDuration: 100
    });
  });


  $(document).ready(function() {
    $('input#input_text, textarea#textarea2').characterCounter();
  });
  
  $('.dropdown-trigger').dropdown();

  $(document).ready(function(){
    $('.fixed-action-btn').floatingActionButton({
    	direction: 'left',
    	hoverEnabled: false
    });
  });