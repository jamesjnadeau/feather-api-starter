
//taken from original paste function
//https://github.com/GetmeUK/ContentTools/blob/master/build/content-tools.js#L7319
//modified to deal with pasting in existin html by stripping it out

module.exports = function(element, clipboardData) {
//console.log('clipboardData', clipboardData.getData('text/plain'));
  var className, content, cursor, encodeHTML, i, insertAt, insertIn, insertNode, item, itemText, lastItem, line, lineLength, lines, selection, tail, tip, _i, _len;
  content = clipboardData.getData('text/plain');
  lines = content.split('\n');
  lines = lines.filter(function(line) {
    return line.trim() !== '';
  });
  if (!lines) {
    return;
  }
  encodeHTML = HTMLString.String.encode;
  className = element.constructor.name;
  if ((lines.length > 1 || !element.content) && className !== 'PreText') {
    if (className === 'ListItemText') {
      insertNode = element.parent();
      insertIn = element.parent().parent();
      insertAt = insertIn.children.indexOf(insertNode) + 1;
    } else {
      insertNode = element;
      if (insertNode.parent().constructor.name !== 'Region') {
        insertNode = element.closest(function(node) {
          return node.parent().constructor.name === 'Region';
        });
      }
      insertIn = insertNode.parent();
      insertAt = insertIn.children.indexOf(insertNode) + 1;
    }
    for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
      line = lines[i];
      line = encodeHTML(line);
      if (className === 'ListItemText') {
        item = new ContentEdit.ListItem();
        itemText = new ContentEdit.ListItemText(line);
        item.attach(itemText);
        lastItem = itemText;
      } else {
        item = new ContentEdit.Text('p', {}, line);
        lastItem = item;
      }
      insertIn.attach(item, insertAt + i);
    }
    lineLength = lastItem.content.length();
    lastItem.focus();
    return lastItem.selection(new ContentSelect.Range(lineLength, lineLength));
  } else {
    content = encodeHTML(content);
    content = new HTMLString.String(content, className === 'PreText');
    selection = element.selection();
    cursor = selection.get()[0] + content.length();
    tip = element.content.substring(0, selection.get()[0]);
    tail = element.content.substring(selection.get()[1]);
    element.content = tip.concat(content);
    element.content = element.content.concat(tail, false);
    element.updateInnerHTML();
    element.taint();
    selection.set(cursor, cursor);
    return element.selection(selection);
  }
}
