function filterChain(){
        this.front = null;
        this.add = function(filterFunc) {
          var filterNode = new filter(filterFunc);
          filterNode.next = this.front;
          this.front = filterNode;
        }
        this.execute = function(node) {
          var current = front;
          var val = "";
          while(current != null) {
            current.execute(node);
            current = current.next;
          }
          return val + "\n\n";
        }
      }
       function initFilterChain() {
        var fc = new filterChain();
        fc.add(filterHeader);
        fc.add(filterImage);
        fc.add()
        return fc;
      }
      function filterHeader(node) {
        var pre = ""
        var i = 0;
        
        for (i = 0; i < 8; i++) {
          if(node.tagName == "H" + i ) {
            break;
          }
          pre += "#";
        }
        if (i <= 6) {
          return pre + node.innerText;
        } else {
          return node.innerText;
        }
        
      }
        
      function filterImage(node) {
        if (node.tagName == "IMG") {
          var name = "";
            if(node.hasAttribute("alt")) {
              name = imgNum + "_" + node.getAttribute("alt").replace(" ", "_");
            } else {
              name = imgNum + "default_image_name";
            }
            name += ".png";
            downloadImage(node.getAttribute("src"), name);
          return "![" + node.getAttribute("alt") + "](" + name + ")" +"\n\n";
        }
      }