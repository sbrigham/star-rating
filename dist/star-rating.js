'use strict';

/**
 * @ngdoc overview
 * @name starRatingApp
 * @description
 * # starRatingApp
 *
 * Main module of the application.
 */
angular
    .module('starRatingApp', ['templates']);

/**
 * @ngdoc function
 * @name starRatingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the starRatingApp
 */
angular.module('starRatingApp', ['sbRatingDirective'])
    .controller('MainCtrl', ['$scope', 'Rating', function ($scope, Rating) {
        if(! $scope.max) {
            $scope.max = 5; // Default to 5 stars
        }

        // Light up the stars when ready
        $scope.$watch(function() {
            return $scope.$parent.initrating;
        }, function(value) {
            if (value != undefined) {
                $scope.rating = value;
                $scope.setStars(value);
            }
        });

        $scope.stars = [];
        var star = { class: 'star' };
        for(var x=1; x<$scope.max+1; x++) {
            var star_clone = angular.copy(star);
            star_clone.star_num = x;
            $scope.stars.push(star_clone);
        }

        $scope.hoverStar = function(hovered_star) {
            angular.forEach($scope.stars, function(star, key) {
                star.class = 'star'
            });

            angular.forEach($scope.stars, function(star, key) {
                if (star.star_num <= hovered_star.star_num) {
                    star.class = 'rating-star-active'
                }
            });
        };
        $scope.leaveHoverStar = function(current_star) {
            if ($scope.rating == null) {
                angular.forEach($scope.stars, function(star, key) {
                    star.class = 'star';
                });
            } else {
                angular.forEach($scope.stars, function(star, key) {
                    if(star.star_num > $scope.rating) {
                        star.class = 'star';
                    } else if (current_star.star_num < $scope.rating) {
                        star.class = 'rating-star-active';
                    }
                });
            }
        };

        $scope.clickStar = function(clicked_star) {
            if ($scope.rating == clicked_star.star_num) {
                $scope.rating = null;

                for (var star in $scope.stars) {
                    star.class = '' // clear all extra classes
                }
            } else {
                $scope.rating = clicked_star.star_num;
                $scope.saveRating($scope.rating);

                angular.forEach($scope.stars, function(star, key) {
                    if (star.star_num <= $scope.rating) {
                        star.class = 'rating-star-active'
                    }
                });
            }
        };

        $scope.saveRating = function(rating) {
            Rating.saveRating($scope.$parent.$parent.episode_id, rating);
        }

        $scope.setStars = function(star_value) {
            angular.forEach($scope.stars, function(star) {
                if (star.star_num <= star_value) {
                    star.class = 'rating-star-active';
                }
            });
        }
    }]);

angular.module('sbRatingDirective', [])
    .directive('starRating', function() {
        return {
            restrict : 'E',
            templateUrl: 'partials/star-rating.html',
            scope: {
                max: '=',
                initrating: '='
            }
        }
    }).factory('Rating', ['$http', function($http) {
        return {
            saveRating: function(episode_id, rating) {
                $http.post('/api/episode/'+episode_id+'/rating', { rating: rating })
                    .success(function(){
                        void 0;
                    }).error(function() {
                        void 0;
                        // log error
                    });
            }
        }
    }]);
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("partials/star-rating.html","<div ng-controller=\"MainCtrl\" id=\"sb-rating\">\n    <div class=\"rating\">\n        <span class=\"sb-stars\">\n            <i class=\"fa fa-star sb-star\" ng-mouseleave=\"leaveHoverStar(star)\" ng-mouseover=\"hoverStar(star)\" ng-class=\"star.class\" ng-click=\"clickStar(star)\" ng-repeat=\"star in stars\"></i>\n        </span>\n    </div>\n</div>");}]);