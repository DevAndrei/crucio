class AdminStatsController {
  readonly API: API;
  stats: any;
  resultGraph: any;

  constructor(Auth: Auth, API: API) {
    this.API = API;

    this.API.get('stats/summary').then(result => {
      this.stats = result.data.stats;
    });

    /* this.API.get('stats/result_graph').then(result => {
      console.log(result.data.resultGraph);
      this.resultGraph = result.data.resultGraph;
    }); */
  }
}

angular.module('crucioApp').component('adminstatscomponent', {
  templateUrl: 'app/admin/stats/stats.html',
  controller: AdminStatsController,
});