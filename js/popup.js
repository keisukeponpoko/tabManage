$(function() {
  getAllTabs();
});

function getAllTabs() {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    var tabLists = Array();
    tabs.forEach(function(val) {
      tabLists.push({
        id : val.id,
        title : val.title,
        url : val.url
      });
    });

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

    $(".tabDelete").click(function() {
      var parent = $(this).parent().parent().remove();
      chrome.tabs.remove($(this).data("id"));
    });

    $(".tabOpen").click(function() {
      chrome.tabs.update($(this).data("id"), {active: true});
    });

    $("#search").keypress(function() {
      tabLists.map(function(element, index, array) {
        console.log(element, index, array);
      });
    });
  });
}
