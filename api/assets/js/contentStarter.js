var errorUtil = require ('errorUtil');

module.exports = function(feathers) {
  console.log(env);
  $(function() {
    var form = $('#createContentForm');
    $('#createContentButton').click(function(event) {
      event.preventDefault();
      var data = form.serializeArray();
      var record = {};
      //convert data to Object
      $.each(data, function() {
        if (record[this.name] !== undefined) {
          if (!record[this.name].push) {
            record[this.name] = [record[this.name]];
          }
          record[this.name].push(this.value || '');
        } else {
          record[this.name] = this.value || '';
        }
      });

      record.relPath = record.type+'/'+encodeURIComponent(record.relPath);
      record.fields = {
        title: '<h1>'+record.name+'</h1>',
      };

      var service = feathers('content');
      service.create(record, function(err, result) {
        errorUtil(err, function(err) {
          if(!err) {// Everything went well
            var url = env.STAGING_URL+'/'+record.relPath;
            console.log('opening', url);
            window.open(url, '_blank');
          } else {
            //error should pop up
          }
        });
      });

    });
  });
};
