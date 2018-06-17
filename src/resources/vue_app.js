var app = new Vue({
  el: '#app',
  data: {
    baseUrl: '/podcaster/src',
    currentComponent: 'home',
    updateInterval: 8640000,
    podcastId: null,
    episodeId: null
  },
  methods: {
    index: function(){
      app.currentComponent = 'home';
    },
    podcastDetail: function(ctx){
      this.podcastId = ctx.params.podcastId.toString();
      app.currentComponent = 'podcastDetail';
    },
    episodeDetail: function(ctx){
      this.podcastId = ctx.params.podcastId.toString();
      this.episodeId = ctx.params.episodeId.toString();
      app.currentComponent = 'episodeDetail';
    },
    saveData: function(name, data){
      if (typeof navigator.webkitTemporaryStorage === 'object'){

        if (typeof name != 'undefined' && typeof data != 'undefined') localStorage.setItem(name, JSON.stringify(data));

        navigator.webkitTemporaryStorage.queryUsageAndQuota (
            function(usedBytes, grantedBytes) {
                var usedMb = Math.round(usedBytes / 1024 / 1024);
                var totalMb = Math.round(grantedBytes / 1024 / 1024);
                console.log('Using ', usedMb, ' of ', totalMb, 'Mb in local storage');
            }
        );

      }else console.error('Local Storage only avilable for Google Chrome');
    },
    getData: function(name){
      var data = null;

      if (typeof navigator.webkitTemporaryStorage === 'object'){

        if (typeof name != 'undefined') data = JSON.parse(localStorage.getItem(name));

      }else console.error('Local Storage only avilable for Google Chrome');

      return (data != null)? data:{};
    }
  },
  created: function(){
    page.base(this.baseUrl);

    page('/', this.index);
    page('/podcast/:podcastId', this.podcastDetail);
    page('/podcast/:podcastId/episode/:episodeId', this.episodeDetail);
    page({ dispatch: false });

    page.redirect(window.location.pathname);
  }
});

Vue.config.devtools = true;
