/**
 * Created by jaime on 12/03/17.
 */
application.controller("PostController", ["$rootScope", "$scope", "$http", function($rootScope, $scope, $http) {
    $rootScope.section = "blog";
    $rootScope.back = false;
    $scope.show = false;

    $scope.posts = {};
    $scope.tags = [];
    $scope.filterTags = [];
    $scope.searchField = {text: ""};

    $http({
        method: "GET",
        url: $rootScope.baseUrl + "/posts"
    }).then(function(response) {
        if (response.data.code == 200) {
            $scope.posts = response.data.data;

            if (undefined !== response.data.tags) {
                $scope.tags = response.data.tags;

                for (var i in $scope.tags) {
                    $scope.filterTags.push({
                        tag: $scope.tags[i],
                        checked: true,
                    });
                }
            }

            $scope.show = true;
        } else {
            Materialize.toast(response.data.msg, 3000);
        }

    }, function(response) {
        Materialize.toast("Ocurrió un error inesperado", 3000);
    });


    $scope.changeFilterTag = function(tag) {
        for (var i in $scope.filterTags) {
            if (tag === $scope.filterTags[i].tag) {
                if ($scope.filterTags[i].checked){
                    $scope.filterTags[i].checked = false;
                } else {
                    $scope.filterTags[i].checked = true;
                }

                break;
            }
        }

        updateContent();
    };

    $scope.searchAction = function() {
        updateContent();
    };

    function updateContent() {
        var filtered = [];
        for (var i in $scope.filterTags) {
            var iFilterTag = $scope.filterTags[i];

            if (iFilterTag.checked) {
                filtered.push(iFilterTag.tag);
            }
        }

        var data = {
            filteredTags: filtered,
            search: $scope.searchField.text
        };

        $http({
            method: "POST",
            data: data,
            url: $rootScope.baseUrl + "/posts",
            headers: {
                "content-type": "application/json",
            }
        }).then(function(response) {
            $scope.posts = response.data.data;
        }, function(response) {
            Materialize.toast("Ocurrió un error inesperado", 2000);
        });
    }

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
