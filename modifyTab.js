
function updateATag() {
  var galleryWrap = document.getElementsByClassName('gallery-wrap');
  if(galleryWrap.length > 0) {
    var listItem = galleryWrap[0].getElementsByTagName('ul');
    var links = [].slice.apply(listItem[0].getElementsByClassName('list-item'));
    links = links.map(function(element) {
      var aTag = element.getElementsByClassName('place-container')[0].getElementsByTagName('a')[0];
      if(!document.getElementById('item-lists') || document.getElementById('item-lists').value == "") {
        element.getElementsByClassName("product-card")[0].classList.remove("selected-xiaomi");
      }
      if(aTag.hasAttribute("href") ) {
        var href = aTag.href.split(".html");
        var returnString = "https://es.aliexpress.com/item/" + href[0].split("/")[href[0].split("/").length-1] + ".html"+ "," + "\n";
        aTag.removeAttribute("href");
        aTag.onclick = function() {
          element.getElementsByClassName("product-card")[0].classList.toggle("selected-xiaomi");
          var proList = document.getElementById('item-lists');
          if(proList) {
            if(proList.value.indexOf(returnString) == -1) {
              proList.value  = proList.value + returnString;
            } else {
              proList.value = proList.value.replace(returnString, "");
            }
          } else {
            initalForm();
             document.getElementById('item-lists').value = returnString;
          }
        };
      }
    });
  }
}

function filterFunction() {
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


function focusInput() {
  document.getElementById('dropdown-options').classList.add("show");
  document.getElementById('myInput').classList.remove("warning-input");
}

function cancelAction() {
  document.getElementById('myInput').value = "";
  document.getElementById('myInput').setAttribute("data-id", "-1");
  document.getElementById('item-lists').value = "";
  if(document.getElementById("xiaomi-content")) {
    document.getElementById("xiaomi-content").remove();
  }
  for(var i = 0 ; i< document.getElementsByClassName("product-card").length ; i++) {
    document.getElementsByClassName("product-card")[i].classList.remove("selected-xiaomi");
  };
  // chrome.extension.sendRequest("close", true);
}

function submitAction() {
  var id = document.getElementById('myInput').getAttribute('data-id');
  document.getElementById('loading-div').classList.remove("hide");
  if(id != "-1") {
    var request = new XMLHttpRequest();
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
          productAPI1.setRequestHeader("Content-Type", "application/json");
          productAPI1.send(JSON.stringify({url: uurl}));
          productAPI1.onload = function (rrr) {
            console.log(rrr.target.response);
            document.getElementById('loading-div').classList.add("hide");
          }
        }
      });
    };
  } else {
    document.getElementById('myInput').classList.add("warning-input");
  }
}
function initalForm() {
  var hmRight = document.getElementsByClassName('hm-right');
  if(hmRight.length > 0) {
    if(document.getElementById("xiaomi-content")) {
      document.getElementById("xiaomi-content").remove();
    }
    var popupContent = document.createElement('div');
    popupContent.id = "xiaomi-content";

    var loadDiv = document.createElement('div');
    loadDiv.id = "loading-div";
    loadDiv.classList.add("hide");

    var loader = document.createElement('div');
    loader.id = "loader";
    loadDiv.append(loader);
    popupContent.append(loadDiv);

    var h3 = document.createElement('h3');
    h3.innerText = "Xiaomipedia offers";
    popupContent.append(h3);
    var label = document.createElement('label');
    label.innerText = "Model: ";
    popupContent.append(label);

    popupContent.append(document.createElement('br'));


    var dropDown = document.createElement('div');
    dropDown.classList.add("dropdown");
    var contentDropDown = document.createElement('div');
    contentDropDown.id = "myDropdown";
    var inputField = document.createElement('input');
    inputField.type = "text";
    inputField.placeHolder = "Search ...";
    inputField.id = "myInput";
    inputField.setAttribute("data-id", "-1");
    inputField.onkeyup = filterFunction;
    inputField.onclick = focusInput;
    contentDropDown.append(inputField);
    var dropDownOptions = document.createElement('div');
    dropDownOptions.id = "dropdown-options";
    contentDropDown.append(dropDownOptions);

    dropDown.append(contentDropDown);
    popupContent.append(dropDown);

    var textArea = document.createElement('textarea');
    textArea.id = "item-lists";
    textArea.setAttribute("disabled", true);
    popupContent.append(textArea);

    var divButtons = document.createElement('div');
    divButtons.classList.add('div-buttons');
    var submitBtn = document.createElement('input');
    submitBtn.type = "button";
    submitBtn.id = "submit";
    submitBtn.value = "Submit";
    submitBtn.classList.add("buttons");
    submitBtn.onclick = submitAction;
    var cancelBtn = document.createElement('input');
    cancelBtn.type = "button";
    cancelBtn.id = "cancel";
    cancelBtn.value = "Cancel";
    cancelBtn.classList.add("buttons");
    cancelBtn.onclick = cancelAction;
    divButtons.append(submitBtn);
    divButtons.append(cancelBtn);
    popupContent.append(divButtons);

    popupContent.onclick=function(ee){
      if(ee.target != inputField) {
        dropDownOptions.classList.remove('show');
      }
    }
    hmRight[0].append(popupContent);

    getData();
  }
}
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
      document.getElementById('dropdown-options').classList.remove('show');
    }
    optionList.appendChild(item);
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

updateATag();
initalForm();


function runOnScroll() {
  updateATag();
}
window.addEventListener("scroll", runOnScroll);
// chrome.extension.sendRequest("asdf");
