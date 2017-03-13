/**
 * Created by jaime on 12/03/17.
 */
application.controller("IndexController", ["$rootScope", "$scope", "$http", function($rootScope, $scope, $http) {
    $scope.contact = {
        name: "",
        email: "",
        comment: "",
    };

    $scope.showContactModal = function() {
        $("#contactModal").modal("open");
    };

    $scope.sendContactMessage = function() {
        if ($scope.contact.name.trim().length == 0 || $scope.contact.email.trim().length == 0 ||
            $scope.contact.comment.trim().length == 0) {
            Materialize.toast(
                "Necesitas completar todos los campos (Nombre, Correo eletrónico, Comentario) para mandar tu mensaje",
                3000);
            return;
        }

        $http({
            method: "POST",
            data: $scope.contact,
            url: $rootScope.baseUrl + "/contact/create",
            headers: {
                "content-type": "application/json",
            }
        }).then(function(response) {
            if (response.data.code == 201) {
                $("#contactModal").modal("close");
                $scope.contact.name = "";
                $scope.contact.email = "";
                $scope.contact.comment = "";
            }
            Materialize.toast(response.data.msg, 3000);
        }, function(response) {
            Materialize.toast("Un error ha ocurrido mientras guardábamos tu comentario", 3000);
        });

    }

}]);
