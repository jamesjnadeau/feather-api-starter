
var notify = require('notifyUtil');
var errorUtil = require ('errorUtil');
var JSONEditor = require('jsoneditor/dist/jsoneditor.js');

module.exports = function (feathers) {
  console.log('here');
  $(function() {
    // the widget definition, where "custom" is the namespace,
    // "colorize" the widget name
    $.widget( "custom.jsonEditor", {
      // default options
      options: {
        //defaults

        // callbacks
        change: null,
        random: null
      },

      // the constructor
      _create: function() {
        //this.element - is the selected element that this widget was called on
        this.editorContainer = this.element.find('#editor-container').get(0);
        //init the editor
        this.editor = new JSONEditor(this.editorContainer);
        this.selectedId = false;
        //pre-select a bunch of elements for use later.
        this.modelSelectors = this.element.find('#model-selector li a');
        this.idSelector = $('#id-selector');
        this.recordName = $('#editor-record-name');
        this.saveButton = $('#save-button');

        // bind any initial events we need to
        this._on( this.modelSelectors, {
          click: "modelSelected"
        });
        this._on( this.saveButton, {
          click: "save"
        });
        this._refresh();
      },

      // called when created, and later when changing options
      _refresh: function() {
        // trigger a callback/event
        //this._trigger( "change" );
      },


      _destroy: function() {
        // remove generated elements
        //this.changer.remove();

        //undo anything we did
      },

      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },

      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
        /*/ prevent invalid color values
        if ( /red|green|blue/.test(key) && (value < 0 || value > 255) ) {
          return;
        }*/
        this._super( key, value );
      },

      modelSelected: function(event) {
        this.selectedModel = event.target.text;
        this.service = feathers.service(this.selectedModel);
        this.loadIds()
      },

      loadIds: function() {
        var that = this;
        this.idSelector.empty();
        this.service.find({}, function(err, records) {
          that.currentRecords = records;
          records.forEach(function(record) {
            var html = '<li><a href="javascript:void(0);" >';
            if(typeof record.name !== 'undefined') {
              html += '<b>'+record.name+'</b><br>';
            }
            html += record._id+'</a></li>'
            var idElement = $(html);
            that.idSelector.append(idElement);
            that._on(idElement, {
              click: function() {
                that.loadRecord(record._id);
              } //'loadRecord'
            })
          });
        });
      },

      loadRecord: function(id) {
        var that = this;
        this.selectedId = id
        this.service.find({_id: this.selectedId}, function(err, records) {
          var record = records[0];
          that.editor.set(record);
          var name = that.selectedId;
          if(typeof record.name !== 'undefined' ) {
            name = record.name +' | '+ name;
          }
          that.recordName.text(name);
        });
      },

      save: function(event) {
        var record = this.editor.get();
        this.service.update(this.selectedId, record, function(xhrProblem) {
          errorUtil(xhrProblem, function() {
            notify('Record Saved', 'phew! that was close', 'success');
          });
        });
      },
    });

    // initialize with default options
    $( ".json-model-editor" ).jsonEditor();
  });
}
