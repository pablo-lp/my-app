/* ### TOP 100 POODCASTS COMPONENT ### */

Vue.component('home', {
	template: '#podcasts_list',
	data: function () {
    return {
			keyPressDelay: 500, // Delay to debounce keypress on filter
			timeout: null,			// Var to save timeout object
			search: null,				// Input search var
      podcastList: {}			// The podcasts list object
    }
  },
	watch: {
		// React to input search changes
		// Timeout used to reduce the number calls to filterPodcast() that is a heavy process
		search: function (string) {
			var self = this;

			if(this.timeout != null) {
	        clearTimeout(this.timeout);
	        this.timeout = null;
	    }

	    this.timeout = setTimeout(function(){
				self.filterPodcast(string);
			}, this.keyPressDelay);
    }
  },
	computed: {
		// Checks if data is not empty to show view
		haveData: function(){
			return Object.keys(this.podcastList).length;
		},
		// Gets the filtered number of podcasts
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
		// Gets the podcast list, save it in local storage and update podcastList object
		getPodcasts: function(){
			var self = this;

			self.$parent.loading = true;
			console.info('Fetching podcasts list...');

			$.getJSON('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json', function(data){
				if (typeof data == 'object' && typeof data.feed != 'undefined'){
					data.feed.timestamp = Date.now();
					self.saveData('podcastList', data.feed);
					console.info('Podcasts list saved to Local Storage');
					Vue.set(self, 'podcastList', data.feed);
					self.$parent.loading = false;
				}else console.error('Can\'t fetch the podcast list from Apple');
			});
		},
		// Filters the podcasts by name or author ('entry' have both)
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
		// Check local storage for data or charge it
		this.podcastList = this.getData('podcastList');
		if (typeof this.podcastList.timestamp == 'undefined') this.getPodcasts();
		else if (Date.now() > this.podcastList.timestamp + this.$parent.updateInterval) this.getPodcasts();
	}
});

/* ### POODCAST DETAIL COMPONENT ### */

Vue.component('podcastDetail', {
	template: '#podcast_detail_page',
	data: function () {
    return {
			podcastDetails: {}	// The podcast details object
    }
  },
	computed: {
		// Checks if data is not empty to show view
		haveData: function(){
			return Object.keys(this.podcastDetails).length;
		}
	},
	methods: {
		// Gets a formatted episode duration
		formattedDuration: function(duration){
			if (duration == '') return '--'; // If duration is empty show --
			if (duration.indexOf(':') > 0) return duration; // If duration have colon is yet formatted

			var totalSeconds = parseInt(duration);
			var hours = Math.floor(totalSeconds / 3600);
			var remainingSeconds = totalSeconds % 3600;
			var minutes = Math.floor(remainingSeconds / 60);
			var seconds = remainingSeconds % 60;

			var formattedString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
			if (hours > 0) formattedString = hours.toString().padStart(2, '0') + ':' + formattedString;

			return formattedString;
		},
		// Gets a formatted spanish date whithout time
		formattedDate: function(dateStr){
			var date = new Date(dateStr);
			var day = date.getDate().toString().padStart(2, '0');
			var month = (date.getMonth() + 1).toString().padStart(2, '0');
			var year = date.getFullYear();
			return day + '/' + month + '/' + year;
		},
		// Gets the podcast details, save it in local storage and update podcastDetails object
		getPodcast: function(id){
			var temp = {};
			var self = this;

			self.$parent.loading = true;
			console.info('Fetching podcast ' + id + ' ...');

			$.getJSON('https://cors.io/?https://itunes.apple.com/lookup?id=' + id, function(data){
				if (typeof data.results[0] != 'undefined'){
					temp = data.results[0];
					temp.timestamp = Date.now();
					temp.episodes = [];

					$.get('https://cors.io/?' + temp.feedUrl, function(feedXml) {
							$rssFeed = $(feedXml);

							temp.description = $rssFeed.find('description:first').text();

					    $rssFeed.find('item').each(function (){
					        var el = $(this);
									var episode = {};
									episode.media = {};
								  episode.title = el.find('title').text();
									episode.date = self.formattedDate(el.find('pubDate').text());
									episode.description = el.find('description').text();
									episode.media.duration = self.formattedDuration(el.find('itunes\\:duration').text());
									episode.media.link = el.find('enclosure').attr('url');
									episode.media.type = el.find('enclosure').attr('type');
									temp.episodes.push(episode);
					    });

							temp.trackCount = temp.episodes.length; // Correct the trackCount parameter because it is incorrect in some cases
							self.$parent.saveData('podcastDetails_' + id , temp);
							console.info('Podcast ' + id + ' data saved to Local Storage');
							Vue.set(self, 'podcastDetails', temp);
							self.$parent.loading = false;
					}, 'XML');

				}else console.error('Can\'t fetch the podcast data from Apple');
			});
		},
		// Reverses the array-key to obtain a more logic episode id
		episodeIdConvert: function(id){
			return this.podcastDetails.trackCount - parseInt(id);
		}
	},
	created: function(){
		// Check local storage for data or charge it
		this.podcastId = this.$parent.podcastId;
		this.podcastDetails = this.getData('podcastDetails_' + this.podcastId);
		if (typeof this.podcastDetails.timestamp == 'undefined') this.getPodcast(this.podcastId);
		else if (Date.now() > this.podcastDetails.timestamp + this.$parent.updateInterval) this.getPodcast(this.podcastId);
	}
});

/* ### EPISODE DETAIL COMPONENT ### */

Vue.component('episodeDetail', {
	template: '#episode_detail_page',
	data: function () {
    return {
			podcastDetails: {}	// The podcast details object
    }
  },
	computed: {
		// Checks if data is not empty to show view
		haveData: function(){
			return Object.keys(this.podcastDetails).length;
		},
		// Gets a pointer to actual episode data
		episode: function(){
			return this.podcastDetails.episodes[this.episodeId];
		}
	},
	methods: {
		// Reverses the id to get a correct array-key
		episodeIdConvert: function(id){
			return this.podcastDetails.trackCount - parseInt(id);
		}
	},
	created: function(){
		// Charge local storage data
		this.podcastDetails = this.getData('podcastDetails_' + this.$parent.podcastId);
		this.podcastId = this.$parent.podcastId;
		this.episodeId = this.episodeIdConvert(this.$parent.episodeId);
	}
});
