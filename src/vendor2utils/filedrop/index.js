/**
 * [description]
 * ref: http://www.html5rocks.com/zh/tutorials/file/dndfiles/
 * @param  {[type]} S [description]
 * @return {[type]}   [description]
 */
KISSY.add(function(S, Base, Event){
	var body = document.body,
		hasFileApi = !!(window.File && window.FileList && window.FileReader);
	function FileDrop(){
		FileDrop.superclass.constructor.apply(this, arguments);
	}
	
	S.extend(FileDrop, Base, {
		init: function(){
			if(!hasFileApi) return;
			
			var self = this;
			self._bind();
		},
		_bind: function(){
			var self = this;
			Event.on(body, 'dragover', function(e){
				return false;
			});
			Event.on(body, 'dragend', function(e){
				return false;
			});
			Event.on(body, 'drag', function(e){
				e.preventDefault();
				var file = e.dataTransfer.files[0],
			        reader = new FileReader();
			        
			    reader.onload = function (event) {
			      var type = file.type ? file.type.toLowerCase().replace(/^text\//, '') : file.name.toLowerCase().replace(/.*\./g, '');
			      self.fire('drag', {type: type, text: event.target.result});
			    };

			    reader.readAsText(file);

			    return false;
			});
		}
	});
	
	
},{
	requires: [
		'base',
		'event'
	]
});