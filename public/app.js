'use strict';

/**
 * @ngdoc function
 * @name starRatingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the starRatingApp
 */
angular.module('starRating', [])
    .directive('starRating', function() {
        return {
            restrict: 'E',
            scope: {
                starClicked: '&'
            },
            templateUrl: 'partials/star-rating.html',
            link: function($scope, $element, $attrs) {
                $attrs.max = $attrs.max || 5;
                $attrs.max = parseInt($attrs.max);
                $scope.disabled = $attrs.disabled == '' || $attrs.disabled;

                $scope.stars = [];
                var star = { class: 'star' };
                for(var x=1; x<$attrs.max+1; x++) {
                    var star_clone = angular.copy(star);
                    star_clone.star_num = x;
                    $scope.stars.push(star_clone);
                }

                $scope.setStars = function(star_value) {
                    angular.forEach($scope.stars, function(star) {
                        if (star.star_num <= star_value) {
                            star.class = 'rating-star-active';
                        }
                    });
                }


                $scope.clickStar = function(clicked_star) {
                    if ($scope.disabled) {
                        return false;
                    }

                    if ($scope.starClicked) {
                        $scope.starClicked({rating: $scope.rating});
                    }

                    if ($scope.rating == clicked_star.star_num) {
                        $scope.rating = null;

                        for (var star in $scope.stars) {
                            star.class = '' // clear all extra classes
                        }
                    } else {
                        $scope.rating = clicked_star.star_num;

                        angular.forEach($scope.stars, function(star, key) {
                            if (star.star_num <= $scope.rating) {
                                star.class = 'rating-star-active'
                            }
                        });
                    }
                };

                if ($attrs.initRating) {
                    $attrs.initRating = parseInt($attrs.initRating);
                    $scope.rating = $attrs.initRating;
                    $scope.setStars($attrs.initRating);
                }

                if ($scope.disabled) {
                    return false;
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
            }
        }
    });