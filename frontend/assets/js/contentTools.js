/*
 * Content Editor
 */
require('ContentTools/build/content-tools.js');
$(function() {
  editor = window.ContentTools.EditorApp.get();
  editor.init('*[data-editable]', 'data-name');
  editor.bind('save', function (regions, calledBy) {
    console.log(regions, calledBy);
  });
})
