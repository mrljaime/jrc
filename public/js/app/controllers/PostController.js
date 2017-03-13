/**
 * Created by jaime on 12/03/17.
 */
application.controller("PostController", ["$rootScope", "$scope", "$http", function($rootScope, $scope, $http) {
    $rootScope.section = "blog";
    $rootScope.back = false;

    $scope.posts = {};

    $http({
        method: "GET",
        url: $rootScope.baseUrl + "/posts"
    }).then(function(response) {
        if (response.data.code == 200) {
            $scope.posts = response.data.data;
        } else {
            Materialize.toast(response.data.msg, 3000);
        }

    }, function(response) {
        Materialize.toast("Ocurrió un error inesperado", 3000);
    });
}]);

application.controller("PostViewController", ["$rootScope", "$scope", "$http", "$stateParams",
    function($rootScope, $scope, $http, $stateParams) {
    $rootScope.back = true;
    $scope.post = {};

    /**
     * Get post info
     */
    $http({
        method: "GET",
        url: $rootScope.baseUrl + "/post/" + $stateParams._id + "/view"
    }).then(function(response) {
        if (response.data.code == 200) {
            $scope.post = response.data.data;
        } else {
            Materialize.toast(response.data.msg, 2000);
        }
    }, function(response) {
        Materialize.toast("Ocurrió un error inesperado", 2000);
    });

}]);
