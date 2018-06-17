var app = new Vue({
  el: '#app',
  data: {
    loading: false,             // If true shows top-right loading animated gift
    currentComponent: 'home',   // Stores the current active component
    updateInterval: 86400000,   // Time in miliseconds to save data in cache (local storage)
    podcastId: null,            // Podcast ID used in podcastDetail & episodeDetail components
    episodeId: null             // Episode ID used in episodeDetail component
  },
  methods: {
    // Go to podcasts list
    index: function(){
      app.currentComponent = 'home';
    },
    // Go to podcast detail
    podcastDetail: function(ctx){
      this.podcastId = ctx.params.podcastId.toString();
      app.currentComponent = 'podcastDetail';
    },
    // Go to episode detail
    episodeDetail: function(ctx){
      this.podcastId = ctx.params.podcastId.toString();
      this.episodeId = ctx.params.episodeId.toString();
      app.currentComponent = 'episodeDetail';
    }
  },
  created: function(){
    // Init page.js config to catch urls
    page.base($('base').attr('href').slice(0, -1));

    page('/', this.index);
    page('/podcast/:podcastId', this.podcastDetail);
    page('/podcast/:podcastId/episode/:episodeId', this.episodeDetail);
    page({ dispatch: false });

    page.redirect(window.location.pathname);

    console.info('App initialized :)');
  }
});
