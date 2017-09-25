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

application.config(function($stateProvider, $httpProvider, $urlRouterProvider, $sceProvider) {

    /**
     * To compile html
     */
    $sceProvider.enabled(false);

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
        }
        }).state("blog", {
            url: "/blog",
            views: {
                root: {
                    templateUrl: "/views/blog/index.html",
                    controller: "PostController"
                }
            }
        }).state("view", {
            url: "/blog/:_id",
            views: {
                root: {
                    templateUrl: "views/blog/view.html",
                    controller: "PostViewController"
                }
            }
    });


    $httpProvider.interceptors.push("httpInterceptor");
});

application.filter("passionMarkup", function() {

    return function(text) {
        /**
         * Strong with * [.*?] *
         */
        text = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

        /**
         * Href
         */
        text = text.replace(/\<(.*?)\|(.*?)\>/g, "<a href='$1' target='_blank'>$2</a>");

        /**
         * Italic
         */

        text = text.replace(/\_\_(.*?)\_\_/g, function(match, g1) {
            return "<i>" + g1 + "</i>";
        });


        return text;
    }
});

application.run(function($rootScope, $window) {

    $rootScope.baseUrl = location.protocol +
        '//' +
        location.hostname +
        (location.port ? ':' + location.port: '') +
        "/api";

    $rootScope.section = "";
    $rootScope.back = false;

    $rootScope.backHistory = function() {
        $window.history.go(-1);
    }

});