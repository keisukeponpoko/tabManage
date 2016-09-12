$(function() {
  getAllTabs();
});

function getAllTabs() {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    var tabLists = Array();
    // 現在開いているタブを配列にpush
    tabs.forEach(function(val) {
      tabLists.push({
        active : val.active,
        id : val.id,
        title : val.title,
        url : val.url
      });
    });

    tabLists.reverse();

    // タブ一覧情報をHTMLにくっつける
    tabLists.forEach(function(val) {
    　if (val.active) {
        var btnClass = 'btn-success';
      } else {
        var btnClass = 'btn-danger';
      }
      $('#tabList').append(
        "<tr>" +
        "<th class='tabOpen' data-id='" + val.id + "'>" + mb_strimwidth(val.title, 0, 60, '...') + "</th>" +
        "<th><button class='btn " + btnClass + " tabDelete' data-id='" + val.id + "'>" +
        "x" + "</button></th>" +
        "</tr>"
      );
    });

    // タブ閉じる処理
    $("#tabList").on('click', ".tabDelete", function() {
      var parent = $(this).parent().parent().remove();
      chrome.tabs.remove($(this).data("id"));
    });

    // 表示タブ切り替え処理
    $("#tabList").on('click', ".tabOpen", function() {
      chrome.tabs.update($(this).data("id"), {active: true});
    });

    // 表示タブ切り替え処理
    $("#suggestList").on('click', ".suggestOpen", function() {
      chrome.tabs.update($(this).data("id"), {active: true});
    });

    // 表示タブ切り替え処理
    $("#historyList").on('click', ".historyOpen", function() {
      chrome.tabs.create({url:$(this).data("url")});
    });

    // 履歴取得
    $("#history").on('click', function() {
      $("#historySearch").show();
      $("#tabSearch").hide();
      setSearchHistory('', null, null, 50);
    });

    $("#historyTextSubmit").on('click', function() {
      var text = $("#historyText").val();
      $('#historyList').html("");
      var microsecondsStartBack = 1000 * 60 * 60 * 24 * 365;
      var startTime = (new Date).getTime() - microsecondsStartBack;
      var maxResults = Number($("#maxResults").val());
      setSearchHistory(text, startTime, null, maxResults);
    });

    $("#historyDateSubmit").on('click', function() {
      var endDay = $("#endDay").val();
      var microsecondsStartBack = 1000 * 60 * 60 * 24 * (endDay + 10);
      var microsecondsEndBack = 1000 * 60 * 60 * 24 * endDay;
      var startTime = (new Date).getTime() - microsecondsStartBack;
      var endTime = (new Date).getTime() - microsecondsEndBack;
      $('#historyList').html("");

      var maxResults = Number($("#maxResults").val());
      setSearchHistory('', startTime, endTime, maxResults);
    });

    //　検索
    $("#search").keyup(function() {
      var text = $(this).val();
      $("#suggestList").html("");
      var suggestList = Array();
      tabLists.map(function(element) {
        if (element.title.indexOf(text) != -1) {
          suggestList.push({
            id : element.id,
            title : element.title,
            url : element.url
          });
        } else if (element.url.indexOf(text) != -1) {
          suggestList.push({
            id : element.id,
            title : element.title,
            url : element.url
          });
        }
      });
      suggestList.forEach(function(val) {
        $('#suggestList').append(
          "<a href='#' class='suggestOpen list-group-item' data-id='" + val.id + "'>"
           + val.title + "</a>"
        );
      });
    });
  });
}

var setSearchHistory = function(inputText, inputStartTime, inputEndTime, inputMaxResults) {
  var query = {
    text: inputText,
    startTime: inputStartTime,
    endTime: inputEndTime,
    maxResults: inputMaxResults
  }
  chrome.history.search(query, function(result) {
    console.log(result);
    if (result.length == 0) {
      $('#historyList').append(
        "<span class='list-group-item'>検索結果がありません</span>"
       )
    } else {
      result.forEach(function(val) {
        if (val.title == '') {
          title = val.url;
        } else {
          title = val.title;
        }
        $('#historyList').append(
          "<a href='#' class='historyOpen list-group-item' data-url='" + val.url + "'>"
           + mb_strimwidth(title, 0, 60, '...') + "</li>"
         )
      });
    }
  });
}

/**
* mb_strwidth
* @param String
* @return int
* @see http://php.net/manual/ja/function.mb-strwidth.php
*/
var mb_strwidth = function(str){
    var i=0,l=str.length,c='',length=0;
    for(;i<l;i++){
        c=str.charCodeAt(i);
        if(0x0000<=c&&c<=0x0019){
            length += 0;
        }else if(0x0020<=c&&c<=0x1FFF){
            length += 1;
        }else if(0x2000<=c&&c<=0xFF60){
            length += 2;
        }else if(0xFF61<=c&&c<=0xFF9F){
            length += 1;
        }else if(0xFFA0<=c){
            length += 2;
        }
    }
    return length;
};

/**
* mb_strimwidth
* @param String
* @param int
* @param int
* @param String
* @return String
* @see http://www.php.net/manual/ja/function.mb-strimwidth.php
*/
var mb_strimwidth = function(str,start,width,trimmarker){
    if(typeof trimmarker === 'undefined') trimmarker='';
    var trimmakerWidth = mb_strwidth(trimmarker),i=start,l=str.length,trimmedLength=0,trimmedStr='';
    for(;i<l;i++){
        var charCode=str.charCodeAt(i),c=str.charAt(i),charWidth=mb_strwidth(c),next=str.charAt(i+1),nextWidth=mb_strwidth(next);
            trimmedLength += charWidth;
            trimmedStr += c;
        if(trimmedLength+trimmakerWidth+nextWidth>width){
            trimmedStr += trimmarker;
            break;
        }
    }
    return trimmedStr;
};
