angular.module('dynaTable', [])

  .directive('dynaTable', function($routeParams, $rootScope, $timeout, dynaTableLocale, services) {
    return {
      restrict: 'E',
      transclude: true,
      template: '\
      <table class="table table-bordered" ng-class="scope.class" style="{{scope.style}}">\
        <thead ng-class="scope.thead.class" style="{{scope.thead.style}}">\
          <tr ng-repeat="(r, tr) in scope.thead.tr" ng-class="tr.class" style="{{tr.style}}">\
            <th class="text-center" width="50" ng-if="option.numbering">{{scope.numbering}}</th>\
            <th ng-repeat="(c, th) in tr.th" ng-click="onClick({element: {type: \'thead\', row: r, col: c, params: th}, info})" colspan="{{th.colspan}}" rowspan="{{th.rowspan}}" ng-class="th.class" style="{{th.style}}">\
              <input type="checkbox" ng-if="th.checkbox" ng-model="th.check">\
              <span ng-bind-html="th.text | html"></span>\
              <i class="fa fa-sort-alpha-desc" ng-if="scope.info.order == $index && scope.info.by == \'DESC\'"></i>\
              <i class="fa fa-sort-alpha-asc" ng-if="scope.info.order == $index && scope.info.by == \'ASC\'"></i>\
            </th>\
          </tr>\
        </thead>\
        <tbody ng-class="scope.tbody.class" style="{{scope.tbody.style}}">\
          <tr ng-repeat="(r, tr) in scope.tbody.tr" ng-class="tr.class" style="{{tr.style}}">\
            <td class="text-center" ng-if="option.numbering">{{r + 1}}</td>\
            <td ng-repeat="(c, td) in tr.td track by $index" ng-click="onClick({element: {type: \'tbody\', row: r, col: c, params: td}, info})" colspan="{{td.colspan}}" rowspan="{{td.rowspan}}" ng-class="td.class || scope.thead.tr[0].th[c].class" style="{{td.style || scope.thead.tr[0].th[c].style}}">\
              <input type="checkbox" ng-if="td.checkbox" ng-model="td.check" ng-true-value="\'{{td.checkbox}}\'" ng-false-value="">\
              <span ng-bind-html="td.text | html"></span>\
            </td>\
          </tr>\
          <tr ng-if="!scope.tbody">\
            <td colspan="{{scope.thead.tr[0].th.length}}">{{locale.noRecord}}</td>\
          </tr>\
        </tbody>\
        <tfoot ng-class="scope.tfoot.class" style="{{scope.tfoot.style}}">\
          <tr ng-repeat="(r, tr) in scope.tfoot.tr" ng-class="tr.class" style="{{tr.style}}">\
            <td ng-repeat="(c, td) in tr.td track by $index" ng-click="onClick({element: {type: \'tfoot\', row: r, col: c}, info})" colspan="{{td.colspan}}" rowspan="{{td.rowspan}}" ng-class="td.class || scope.thead.tr[0].th[c].class" style="{{td.style || scope.thead.tr[0].th[c].style}}" ng-init="$parent.$last && $last && fisnish()" ng-bind-html="td.text | html"></td>\
          </tr>\
        </tfoot>\
      </table>\
      <div class="row">\
        <div class="col-sm-6">{{locale.show}} {{scope.info.from}} - {{scope.info.to}} {{locale.from}}  {{scope.info.records}} {{locale.records}}.</div>\
        <div class="col-sm-6 text-right">\
          <div class="btn-group btn-group-sm" role="group">\
            <button type="button" class="btn btn-default" ng-click="onClick({element: {type: \'paginate\', page: 1}, info})" ng-disabled="scope.info.page == 1"><i class="fa fa-angle-double-left"></i></button>\
            <button type="button" class="btn btn-default" ng-click="onClick({element: {type: \'paginate\', page: scope.info.page - 1}, info})" ng-disabled="scope.info.page == 1"><i class="fa fa-angle-left"></i></button>\
            <button type="button" class="btn btn-default" ng-click="onClick({element: {type: \'paginate\', page: pg}, info})" ng-disabled="scope.info.page == pg" ng-repeat="pg in paging">{{pg}}</button>\
            <button type="button" class="btn btn-default" ng-click="onClick({element: {type: \'paginate\', page: (scope.info.page * 1) + 1}, info})" ng-disabled="scope.info.page == scope.info.pages"><i class="fa fa-angle-right"></i></button>\
            <button type="button" class="btn btn-default" ng-click="onClick({element: {type: \'paginate\', page: scope.info.pages}, info})" ng-disabled="scope.info.page == scope.info.pages"><i class="fa fa-angle-double-right"></i></button>\
          </div>\
        </div>\
      </div>\
    <p class="loading" ng-if="loading"><span class="animate"></span></p>\
    ',
      scope: {
        scope: '=',
        option: '=',
        onClick: '&'
      },
      link: function($scope, $element, $attrs) {
        $timeout(function() {
          if ($scope.scope) {
            $scope.locale = angular.copy(dynaTableLocale);
            $scope.info = $scope.scope.info;
            $scope.info.scope = $attrs.scope;
            $scope.paging = [];
            var start = Math.max(1, Math.min($scope.scope.info.pages - 4, Math.max($scope.scope.info.page - 2, 1)));
            for (var i = start; i <= Math.min($scope.scope.info.pages, Number(start) + 5); i++) {
              $scope.paging.push(i);
            }
          }
        }, 100);
      }
    }
  })

  .filter('html', function($sce) {
    return function(text) {
      text = text || '';
      text = text.toString();
      return $sce.trustAsHtml(text.replace(/[\n\r]/g, '<br>'));
    };
  })
