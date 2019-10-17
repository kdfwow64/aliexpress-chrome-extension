// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This extension demonstrates using chrome.downloads.download() to
// download URLs.

var productList = [{ id: 1, name: "Item1"}, { id: 2, name: "Item2"}];
var allUrls = [];
var popupWindow = null;

function showList() {
  var optionList = document.getElementById('dropdown-options');
  while (optionList.children.length > 1) {
    optionList.removeChild(optionList.children[optionList.children.length - 1]);
  }
  for (var i = 0; i < productList.length; i++) {
    var item = document.createElement('a');
    item.id = "product_select_" + productList[i].id;
    item.innerText = productList[i].name;
    item.onclick = function(ss) {
      document.getElementById('myInput').value = ss.target.innerText;
      document.getElementById('myInput').setAttribute("data-id", ss.target.id.split("_")[2]);
      localStorage["myInput"] = ss.target.innerText;
      localStorage["myInput-id"] = ss.target.id.split("_")[2];
      // chrome.storage.sync.set({ "myInput": ss.target.innerText }, function(){
      //     //  A data saved callback omg so fancy
      // });
      document.getElementById('dropdown-options').classList.remove('show');
    }
    optionList.appendChild(item);
  }
}




// Toggle the checked state of all visible links.
function toggleAll() {
  var checked = document.getElementById('toggle_all').checked;
  for (var i = 0; i < visibleLinks.length; ++i) {
    document.getElementById('check' + i).checked = checked;
  }
}

// Download all visible checked links.
function downloadCheckedLinks() {
  for (var i = 0; i < visibleLinks.length; ++i) {
    if (document.getElementById('check' + i).checked) {
      chrome.downloads.download({url: visibleLinks[i]},
                                             function(id) {
      });
    }
  }
  window.close();
}

function filterFunction() {
  console.log(1);
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

// Add links to allLinks and visibleLinks, sort and show them.  send_links.js is
// injected into all frames of the active tab, so this listener may be called
// multiple times.
 // Please use runtime.sendMessage, runtime.onMessage, and runtime.onMessageExternal instead.

// function showUrls() {
//   var itemList = document.getElementById('item-lists');
//   console.log(allUrls.length);
//   var ss = '';
//   for(var i = 0 ; i < allUrls.length ; i ++) {
//     ss = ss + "\n" + allUrls[i];
//   }

//   itemList.value = ss;
// }
chrome.extension.onRequest.addListener(function(url) {
  allUrls.push(url);
  if(localStorage['item-lists'].indexOf(url) == -1) {
    localStorage['item-lists']  = localStorage['item-lists'] + url;
  } else {
    localStorage['item-lists'] = localStorage['item-lists'].replace(url, "");
  }
  var itemList = document.getElementById('item-lists');
  itemList.value = localStorage['item-lists'];
  popupWindow.focus();
  // showUrls();
});

popupWindow = window.open(
   chrome.extension.getURL("popup.html"),
   "Aliexpress",
   "width=350,height=400,resizable=no,right=50,top=50"
);

 
// chrome.browserAction.onClicked.addListener(function(tab) {
//     // vAPI.tabs.open({
//     //     select: true,
//     //     url: 'popup.html?tabId=' + tab.id + '&responsive=1'
//     // });
//     chrome.tabs.create({ url: 'popup.html', active: false }, function (newTab) {
//         chrome.windows.create({
//             tabId: newTab.id,
//             type: 'popup',
//             focused: false,
//             height: 385,
//             width: 380
//             // incognito, top, left, ...
//         }, function (window) {
//             setTimeout(() => {
//                 chrome.windows.update(window.id, {focused:true});
//             }, 1000);
//         });
//     });
// });
// Set up event handlers and inject send_links.js into all frames in the active
// tab.

function focusInput() {
  document.getElementById('dropdown-options').classList.add("show");
}

function cancelAction() {
  document.getElementById('myInput').value = "";
  localStorage["myInput"] = "";
  document.getElementById('item-lists').value = "";
  localStorage["item-lists"] = "";
  window.close();
}

function submitAction() {
  var request = new XMLHttpRequest();
  var id = document.getElementById('myInput').getAttribute('data-id');
  if(id != "-1") {
  // document.getElementById('item-lists').value.split(",")[1].replace(/\r?\n|\r/g, "");
    request.open("POST", "http://164.132.58.235/api/v1/login", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var rr = request.send(JSON.stringify({username: "edu", password: "test123"}));
    request.onload = function(rr) {
      var token = JSON.parse(rr.target.response)['access_token'];

      var productArray = document.getElementById('item-lists').value.split(",");
      productArray.map(function(element) {
        if(element.indexOf("html") != -1) {
          var productAPI1 = new XMLHttpRequest();

          // var url = "http://164.132.58.235/api/v1/products/"+ element.split("/")[element.split("/").length-1].split('.html')[0] +"/links";
          var url = "http://164.132.58.235/api/v1/products/"+ id +"/links";

          var uurl = element.replace(/\r?\n|\r/g, "");
          productAPI1.open("POST", url, true);
          productAPI1.setRequestHeader("Authorization", token);
          productAPI1.setRequestHeader("Content-Type", "application/json;");
          productAPI1.send(JSON.stringify({url: uurl}));
          productAPI1.onload = function (rrr) {
            console.log(rrr.target.response);
          }
        }
      });
    };
  }
}

function getData() {
  var request = new XMLHttpRequest();

  request.open("POST", "http://164.132.58.235/api/v1/login", true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  var rr = request.send(JSON.stringify({username: "edu", password: "test123"}));
  request.onload = function(rr) {
    var token = JSON.parse(rr.target.response)['access_token'];
    var productAPI = new XMLHttpRequest();

    productAPI.open("GET", "http://164.132.58.235/api/v1/products", true);
    productAPI.setRequestHeader("Content-Type", "application/json;");
    productAPI.setRequestHeader("Authorization", token);
    productAPI.send();
    productAPI.onload = function (rrr) {
      productList = JSON.parse(rrr.target.response);
      showList();
    }
  };
}


window.onload = function() {
  document.getElementById('myInput').onkeyup = filterFunction;
  document.getElementById('myInput').onclick = focusInput;
  document.getElementById('cancel').onclick = cancelAction;
  document.getElementById('submit').onclick = submitAction;
  getData();
  // chrome.storage.sync.get(/* String or Array */"myInput", function(item){
  //   console.log(item);
  //   document.getElementById('myInput').value = item;
  // });


  document.getElementsByClassName('content')[0].onclick=function(ee){
    if(ee.target != document.getElementById('myInput')) {
      document.getElementById('dropdown-options').classList.remove('show');
    }
  }
  if(localStorage["myInput"] != undefined && localStorage["myInput"] != "" && localStorage["myInput"] != "undefined") {
    document.getElementById('myInput').value = localStorage["myInput"];
    document.getElementById('myInput').setAttribute("data-id", localStorage["myInput-id"]);
  } else {
    localStorage["myInput"] = "";
    localStorage["myInput-id"] = "";
  }

  if(localStorage["item-lists"] != undefined && localStorage["item-lists"] != "" && localStorage["item-lists"] != "undefined") {
    document.getElementById('item-lists').value = localStorage["item-lists"];
  } else {
    localStorage["item-lists"] = "";
  }

  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {

                        chrome.tabs.executeScript(
                          activeTabs[0].id, {file: 'modifyTab.js', allFrames: true});


                        chrome.tabs.insertCSS(activeTabs[0].id, {
                            file: "style.css"
                        });
                        }

                        );
  });
};
