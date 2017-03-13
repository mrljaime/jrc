/**
 * Created by jaime on 12/03/17.
 */
var application = angular.module("jrc", ["ui.router"]);

application.factory("httpInterceptor", ["$q", "$location", function($q, $location) {
    return {
        request: function(request) {
            $("#loader").show();
            return request;
        },
        response: function(response) {
            $("#loader").hide();
            return response;
        },
        responseError: function(response) {
            $("#loader").hide();
            return response;
        }
    }
}]);

application.config(function($stateProvider, $httpProvider, $urlRouterProvider) {

    /**
     * Set default router
     */
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("index", {
        url: "/",
        views: {
            root: {
                templateUrl: "/views/index.html",
                //template: "<h3>Jaime está aqui</h3>"
                controller: "IndexController"
            }
        },
    });

    $httpProvider.interceptors.push("httpInterceptor");
});

application.run(function($rootScope) {

    $rootScope.baseUrl = location.protocol +
        '//' +
        location.hostname +
        (location.port ? ':' + location.port: '') +
        "/api";

});