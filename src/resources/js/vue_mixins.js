Vue.mixin({
	methods: {
    // Saves object to local storage in JSON format
    saveData: function(name, data){
      if (typeof localStorage === 'object'){
        if (typeof name != 'undefined' && typeof data != 'undefined') localStorage.setItem(name, JSON.stringify(data));
      }else console.error('Local Storage not supported by your browser');
    },
    // Gets object from local storage JSON data
    getData: function(name){
      var data = null;

      if (typeof localStorage === 'object'){
        if (typeof name != 'undefined') data = JSON.parse(localStorage.getItem(name));
      }else console.error('Local Storage not supported by your browser');

      return (data != null)? data:{};
    },
    // Convert URLs to use with or without
    transformUrl: function(url){
			return (typeof url != 'undefined')? url.replace(/^https:\/\//i, '//'):null;
		}
	}
});
