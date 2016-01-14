function getText(node, imgNum) {
    var val = "";
    if (node.nodeName == "H1") {
        val = "# " + node.innerText + "\n\n";
    } else if (node.nodeName == "H2") {
        val = "## " + node.innerText + "\n\n";
    } else if (node.nodeName == "H3") {
        val = "### " + node.innerText + "\n\n";
    } else if (node.nodeName == "H4") {
        val = "#### " + node.innerText + "\n\n";
    } else if (node.nodeName == "H5") {
        val = "##### " + node.innerText + "\n\n";
    } else if (node.nodeName == "H6") {
        val = "###### " + node.innerText + "\n\n";
    } else if (node.nodeName == "P") {
        val = node.innerText + "\n\n";
    } else if (node.nodeName == "A") {
        val = "[" + node.innerText + "](" + node.getAttribute("href") + ")";
    } else if (node.nodeName == "IMG") {
        var name = "";
        if (node.hasAttribute("alt")) {
            name = imgNum + "_" + node.getAttribute("alt").replace(" ", "_");
        } else {
            name = imgNum + "default_image_name";
        }
        name += ".png";
        downloadImage(node.getAttribute("src"), name);
        val = "![" + node.getAttribute("alt") + "](" + name + ")" + "\n\n";
        iNum++;
    } else {

    }
    return val;
}

function dfs(node) {
    var text = getText(node, iNum);
    var c = 0;
    for (c = 0; c < node.children.length; c++) {
        text += dfs(node.children[c]);
    }
    return text;
}