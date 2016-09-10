$(function() {
  getAllTabs();
});

function getAllTabs() {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    var tabLists = Array();
    // 現在開いているタブを配列にpush
    tabs.forEach(function(val) {
      tabLists.push({
        id : val.id,
        title : val.title,
        url : val.url
      });
    });

    // タブ一覧情報をHTMLにくっつける
    tabLists.forEach(function(val) {
      $('#tabList').append(
        "<tr>" +
        "<th>" + val.title + "</th>" +
        "<th><button class='btn btn-info tabOpen' data-id='" + val.id + "'>" +
        "<i class='fa fa-play'></i>" + "</button></th>" +
        "<th><button class='btn btn-danger tabDelete' data-id='" + val.id + "'>" +
        "<i class='fa fa-trash-o'></i>" + "</button></th>" +
        "</tr>"
      );
    });

    // タブ閉じる処理
    $("#tabList").on('click', ".tabDelete", function() {
      console.log($(this));
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
           + val.title + "</li>"
        );
      });
    });
  });
}
