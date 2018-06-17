Vue.component('home', {
	template: '#podcasts_list',
	data: function () {
    return {
			search: null,
      podcastList: {}
    }
  },
	watch: {
		search: function (string) {
      this.debouncedSearch(string);
    }
  },
	computed: {
		numItems: function(){

			var self = this;
			var numItems = 0;

			if (typeof this.podcastList.entry != 'undefined'){
				this.podcastList.entry.map(function(value, key) {
					if (!self.podcastList.entry[key].hidden) numItems++;
				});
			}

			return numItems;
		}
	},
	methods: {
		getPodcasts: function(){
			var self = this;

			console.log('Fetching podcasts list...');

			$.getJSON('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json', function(data){
				if (typeof data.feed != 'undefined'){
					data.feed.timestamp = Date.now();
					self.$parent.saveData('podcastList', data.feed);
					self.podcastList = data.feed;
				}else console.error('Can\'t fetch the podcast list from Apple');
			});
		},
		filterPodcast: function(string){
			var self = this;
			var searchTerms = string.toLowerCase().split(" ");

			this.podcastList.entry.map(function(value, key) {
				Vue.set(self.podcastList.entry[key], 'hidden', false);

				if (string.length){
					var itemTitle = value.title.label;
					var itemMatch = false;

					searchTerms.forEach(function(keyword) {
					  if (itemTitle.toLowerCase().indexOf(keyword) > 0) itemMatch = true;
					});

					if (!itemMatch) Vue.set(self.podcastList.entry[key], 'hidden', true);
				}
			});
		}
	},
	created: function(){
		this.podcastList = this.$parent.getData('podcastList');
		if (typeof this.podcastList.timestamp == 'undefined') this.getPodcasts();
		else if (Date.now() > this.podcastList.timestamp + this.$parent.updateInterval) this.getPodcasts();
		this.debouncedSearch = _.debounce(this.filterPodcast, 500);
	}
});

Vue.component('podcastDetail', {
	template: '#podcast_detail_page',
	data: function () {
    return {
      podcastDetails: {}
    }
  },
	methods: {
		getPodcast: function(id){
			var self = this;

			console.log('Fetching podcast ' + id + ' ...');

			$.getJSON('https://cors.io/?https://itunes.apple.com/lookup?id=' + id, function(data){
				if (typeof data.results[0] != 'undefined'){
					data.results[0].timestamp = Date.now();
					self.$parent.saveData('podcastDetails_' + id , data.results[0]);
					self.podcastDetails = data.results[0];
				}else console.error('Can\'t fetch the podcast data from Apple');
			});
		}
	},
	created: function(){
		this.podcastDetails = this.$parent.getData('podcastDetails_' + this.$parent.podcastId);
		if (typeof this.podcastDetails.timestamp == 'undefined') this.getPodcast(this.$parent.podcastId);
		else if (Date.now() > this.podcastDetails.timestamp + this.$parent.updateInterval) this.getPodcast(this.$parent.podcastId);

		$.ajax({
		  type: 'GET',
		  url: "https://api.rss2json.com/v1/api.json?count=50&rss_url=" + this.podcastDetails.feedUrl,
		  dataType: 'jsonp',
		  success: function(data) {
		    console.log(data.feed.description);
		    console.log(data);
		  }
		});
	}
});

Vue.component('episodeDetail', {
	template: '#episode_detail_page',
	created: function(){

	}
});
