
var notify = require('notifyUtil');
var errorUtil = require ('errorUtil');
var JSONEditor = require('jsoneditor/dist/jsoneditor.js');
var twbsPagination = require('twbs-pagination/');

var defaultLimit = 10;

module.exports = function (feathers) {
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
        this.$limit = defaultLimit;
        //this.element - is the selected element self this widget was called on
        this.editorContainer = this.element.find('#editor-container').get(0);
        //init the editor
        this.editor = new JSONEditor(this.editorContainer);
        this.selectedId = false;
        //pre-select a bunch of elements for use later.
        this.modelSelectors = this.element.find('#model-selector li a');
        this.idSelector = this.element.find('#id-selector');
        this.recordName = this.element.find('#editor-record-name');
        this.addRecordButton = this.element.find('#add-record');
        this.saveButton = this.element.find('.save-button');
        this.deleteRecordButton = this.element.find('.delete-button');
        this.reloadRecordButton = this.element.find('.reload-button');
        this.pager = this.element.find('.pager');

        // bind any initial events we need to
        this._on( this.modelSelectors, {
          click: "modelSelected"
        });
        this._on( this.saveButton, {
          click: "save"
        });
        this._on( this.addRecordButton, {
          click: "add"
        });
        this._on( this.deleteRecordButton, {
          click: "deleteRecord"
        });
        this._on( this.reloadRecordButton, {
          click: "reloadRecord"
        });

        //Call refresh
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

      // _setOptions is called with a hash of all options self are changing
      // always refresh when changing options
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },

      // _setOption is called for each individual option self is changing
      _setOption: function( key, value ) {
        /*/ prevent invalid color values
        if ( /red|green|blue/.test(key) && (value < 0 || value > 255) ) {
          return;
        }*/
        this._super( key, value );
      },

      modelSelected: function(event) {
        event.stopPropagation();
        this.selectedModel = event.target.text;
        this.service = feathers(this.selectedModel);
        this.addRecordButton.removeClass('disabled');
        this.loadIds();
        this.$limit = defaultLimit;
        this.$skip = 0;
      },

      recordSelectorHTML: function(record) {
        var html = '<li><a href="javascript:void(0);" >';
        if(typeof record.name !== 'undefined') {
          html += '<b>'+record.name+'</b><br>';
        }
        html += record._id+'</a></li>';
        return html;
      },

      addRecordSelector: function(record) {
        var html = this.recordSelectorHTML(record);
        var idElement = $(html);
        this.idSelector.append(idElement);
        this._on(idElement, {
          click: function(evemt) {
            event.stopPropagation();
            this.loadRecord(record._id);
          } //'loadRecord'
        });
      },

      loadIds: function() {
        var self = this;
        this.idSelector.empty();
        query = {
          $limit: this.$limit,
          $skip: this.$skip,
        };
        //check total results count first
        this.service.count(query, function(result) {
          console.log(result);
          var count = result.count;
          totalPages = parseInt(count / self.$limit)+1;
          console.log('count', count, totalPages);
          var initPageSet = false;
          self.pager.twbsPagination({
            totalPages: totalPages,
            visiblePages: 5,
            onPageClick: function (event, page) {
              console.log('Page', page);
              self.$skip = page * self.$limit - self.$limit;
              if(initPageSet) {
                self.loadIds();
              }
              initPageSet = true;
            }
          });
          if(count) { //if there are results, get them
            self.service.find(query, function(err, records) {
              self.currentRecords = records;
              records.forEach(function(record) {
                self.addRecordSelector(record);
              });
            }).catch(errorUtil);
          }
        })

      },

      loadRecord: function(id) {
        var self = this;
        this.selectedId = id;
        this.service.find({_id: this.selectedId}, function(err, records) {
          var record = records[0];
          self.editor.set(record);
          var name = self.selectedId;
          if(typeof record.name !== 'undefined' ) {
            name = record.name +' | '+ name;
          }
          self.recordName.text(name);
        });
      },

      save: function(event) {
        var record = this.editor.get();
        if(this.selectedId && record._id) { //Update
          this.service.update(record._id, record, function(xhrProblem) {
            errorUtil(xhrProblem, function(err) {
              if(!err)
                notify('Record Saved', 'phew! self was close', 'success');
            });
          });
        } else { //add
          this.addRecord(record);
        }

      },

      addRecord: function(record) {
        var self = this;
        this.selectedId = false;
        this.recordName.text(record.name);
        this.service.create(record, function(xhrProblem, record) {
            errorUtil(xhrProblem, function(err) {
              if(!err) {
                notify('New Record Created',
                  'you passed the validation! If you meant to or not', 'info');
                //refresh currently loaded ids - deals with new record not showing
                self.loadIds();
              } else { //add errored fields to editor
                if(typeof err.error !== 'undefined') {
                  if(typeof err.error.errors !== 'undefined') {
                    var record = self.editor.get();
                    for(var index in err.error.errors) {
                      if(typeof record[index] === 'undefined') {
                        record[index] = null;
                      }
                    }
                    self.editor.set(record);
                  }
                }
              }
            });
        })
      },

      add: function(event) {
        var record = {
          name: 'New '+this.selectedModel,
        };
        this.editor.set(record);
        this.addRecord(record);
      },

      deleteRecord: function(event) {
        if(this.selectedId) {
          this.service.remove(this.selectedId, function(xhrProblem) {
            errorUtil(xhrProblem, function(err) {
              if(!err) {
                notify('Record Deleted',
                  'RIP, you won\'t be missed.', 'info');
                //refresh currently loaded ids - deals with new record not showing
                self.loadIds();
              }
            });
          });
        }
      },

      reloadRecord: function(event) {
        if(this.selectedId) {
          this.loadRecord(this.selectedId);
        }
      }
    });

    // initialize with default options
    $( ".json-model-editor" ).jsonEditor();
  });
}
