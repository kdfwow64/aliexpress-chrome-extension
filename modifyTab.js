
function updateATag() {
  var galleryWrap = document.getElementsByClassName('gallery-wrap');
  if(galleryWrap.length > 0) {
    var listItem = galleryWrap[0].getElementsByTagName('ul');
    var links = [].slice.apply(listItem[0].getElementsByClassName('list-item'));
    links = links.map(function(element) {
      var aTag = element.getElementsByClassName('place-container')[0].getElementsByTagName('a')[0];
      if(aTag.hasAttribute("href") ) {
        var href = aTag.href.split(".html");
        var returnString = "https://es.aliexpress.com/item/" + href[0].split("/")[href[0].split("/").length-1] + ".html"+ "," + "\n";
        aTag.removeAttribute("href");
        aTag.onclick = function() {
          element.getElementsByClassName("product-card")[0].classList.toggle("selected-xiaomi");
          chrome.extension.sendRequest(returnString);
        };
      }
    });
  }
}
updateATag();

function runOnScroll() {
  updateATag();
}
window.addEventListener("scroll", runOnScroll);
// chrome.extension.sendRequest("asdf");
