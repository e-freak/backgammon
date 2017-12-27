$(function(){

  $('#menu .show-menu').on('click', function(){
    var s = $('#menu');
    if ( s.hasClass('SHOW') ) {
      /*メニューを閉じる */
      var w = s.width();
      s.animate({'left': -w + 'px'}, 500).removeClass('SHOW');
    } else {
      /*メニューを開く */
      s.animate({'left': '-250'}, 500).addClass('SHOW');
    }
  });

  /* リサイズ時に、画面外に出しているメニューが表示されてしまうので、left 値を再設定 */
  $(window).on('resize', function(){
    var s = $('#menu');
    if ( ! s.hasClass('SHOW') ){
      var w = s.width();
      s.css('left', -w + 'px');
    }
  });

});
