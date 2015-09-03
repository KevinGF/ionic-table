var ionicTableModule = angular.module('ionic-table', [])

ionicTableModule.config(function () {  
  $('<style type="text/css">.item-select,.table-select{position:' +
    'relative}.item-select select,.table-select select{-webkit-' +
    'appearance:none;appearance:none;position:absolute;top:0;bottom:0;' +
    'right:0;padding:0 48px 0 16px;max-width:65%;border:none;' +
    'background:#fff;color:#333;text-indent:.01px;text-overflow:"";' +
    'white-space:nowrap;font-size:14px;cursor:pointer;direction:rtl}' +
    '.item-select select::-ms-expand,.table-select select::-ms-expand' +
    '{display:none}.item-select option,.table-select option{direction:' +
    'ltr}.item-select:after,.table-select:after{position:absolute;top:' +
    '50%;right:16px;margin-top:-3px;width:0;height:0;border-top:5px ' +
    'solid;border-right:5px solid transparent;border-left:5px solid ' +
    'transparent;color:#999;content:"";pointer-events:none}.item-light.' +
    'table-select select,.item-select.item-light select{background:' +
    '#fff;color:#444}.item-select.item-stable select,.item-stable.' +
    'table-select select{background:#f8f8f8;color:#444}.item-select' +
    '.item-stable .input-label,.item-select.item-stable:after,.item-' +
    'stable.table-select .input-label,.item-stable.table-select:after' +
    '{color:#656565}.item-positive.table-select select,.item-select' +
    '.item-positive select{background:#387ef5;color:#fff}.item-positive' +
    '.table-select .input-label,.item-positive.table-select:after,' +
    '.item-select.item-positive .input-label,.item-select.item-positive' +
    ':after{color:#fff}.item-calm.table-select select,.item-select' +
    '.item-calm select{background:#11c1f3;color:#fff}.item-calm' +
    '.table-select .input-label,.item-calm.table-select:after,' +
    '.item-select.item-calm .input-label,.item-select.item-calm:after' +
    '{color:#fff}.item-assertive.table-select select,.item-select.item-' +
    'assertive select{background:#ef473a;color:#fff}.item-assertive' +
    '.table-select .input-label,.item-assertive.table-select:after,' +
    '.item-select.item-assertive .input-label,.item-select' +
    '.item-assertive:after{color:#fff}.item-balanced.table-select ' +
    'select,.item-select.item-balanced select{background:#33cd5f;' +
    'color:#fff}.item-balanced.table-select .input-label,.item-' +
    'balanced.table-select:after,.item-select.item-balanced ' +
    '.input-label,.item-select.item-balanced:after{color:#fff}.item-' +
    'energized.table-select select,.item-select.item-energized select' +
    '{background:#ffc900;color:#fff}.item-energized.table-select ' +
    '.input-label,.item-energized.table-select:after,.item-select' +
    '.item-energized .input-label,.item-select.item-energized:after' +
    '{color:#fff}.item-royal.table-select select,.item-select' +
    '.item-royal select{background:#886aea;color:#fff}.item-royal' +
    '.table-select .input-label,.item-royal.table-select:after,' +
    '.item-select.item-royal .input-label,.item-select.item-royal:' +
    'after{color:#fff}.item-dark.table-select select,.item-select' +
    '.item-dark select{background:#444;color:#fff}.item-dark' +
    '.table-select .input-label,.item-dark.table-select:after,' +
    '.item-select.item-dark .input-label,.item-select.item-dark:after' +
    '{color:#fff}.table *{font-size:14px}.table .table-row:first-child' +
    '{margin-top:-2px}.table .table-head{background:#ddd;text-align:' +
    'center;color:#000}.table ul{display:-webkit-box;display:flex}' +
    '.table ul li{display:inline-block;padding:16px;max-width:65%;' +
    'white-space:normal}.table li:not(:last-child){border-right:1px ' +
    'solid #ddd}.table-row{padding:0}.table-select{overflow:hidden}' +
    '.table-select select{max-width:none;padding-right:35px}' +
    '.table-descriptor li{border-right:none}.icon-only{position:relative;' +
    'text-align:center}.icon-only i{font-size:32px;width:100%;position:absolute;' +
    'top:calc(50%-14px);left:0}</style>')
  .appendTo('head');
});

ionicTableModule.directive('ionTable', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    template: '<div class="table" ng-transclude="" ng-if="!reset">',
    transclude: true,
    link: function (scope, element, attr) {

      var existing = window.onresize;

      window.onresize = function () {
        if (existing) {existing()}
          $timeout(function(){scope.reset = true;});
          $timeout(function () {
            scope.reset = false;
            $timeout(setCellWidth);
          }, 100);
      };

      $timeout(setCellWidth);

      function setCellWidth() {
        var div = angular.element(angular.element(angular.element(element.children()[0]).children()[0]).children()[0]),
            selectElements = element.find('select'),
            uls = [],
            cellContainers = [],
            cellWidths = [],
            rows = [],
            cellWidths,
            widestCell = {
              width: null,
              index: null
            },
            widthsToUse = [],
            totalCellWidth = 0,
            tempCellWidth = 0,
            widthsToUseCopy,
            individualCell,
            individualWidth,
            tempCells,
            ulLength,
            singleUl,
            padding,
            oldRows,
            tempCellContainer,
            biggestCell,
            newCell,
            styleAttr,
            windowDifference;

        for (var ul in div.children()) {
          if (!isNaN(parseInt(ul))) {
            uls.push(angular.element(div.children()[ul]));
          }
        }

        for (ul in uls) {
          tempCellContainer = uls[ul];
          for (var li in tempCellContainer) {
            if (!isNaN(parseInt(li))) {
              cellContainers.push(angular.element(tempCellContainer.children()[li]));
            }
          }
        }

        for (var cellContainer in cellContainers) {
          tempCells = angular.element(cellContainers[cellContainer][0]).children();
          ulLength = tempCells.length;
          for (var i = 1; i <= ulLength; i++) {
            singleUl = [];
            for (li in tempCells) {
              if (!isNaN(parseInt(li))) {
                singleUl.push($(tempCells[li]));
              }
            }
          }
          rows.push(singleUl);
        }

        for (i = 0; i < ulLength; i++) {
          cellWidths.push({
            cellIndex: parseInt(i),
            widths: []
          });
        }

        for (var row in rows) {
          for (var cell in rows[row]) {
            individualCell = rows[row][cell];
            for (var cellWidth in cellWidths) {
              if (cellWidths[cellWidth].cellIndex === parseInt(cell)) {
                if (individualCell.has('select').length > 0) {
                  cellWidths[cellWidth].widths.push($(individualCell.children('select')).innerWidth());
                } else {
                  cellWidths[cellWidth].widths.push(individualCell.innerWidth());
                }
              }
            }
          }
        }

        for (cellWidth in cellWidths) {
          widthsToUse.push(Math.max.apply(Math, cellWidths[cellWidth].widths));
        }

        for (var widthToUse in widthsToUse) {
          if (parseInt(widthToUse) !== widthsToUse.length - 1) {
            totalCellWidth += widthsToUse[widthToUse];
          }
        }

        var windowDifference = window.innerWidth - totalCellWidth;

        if (windowDifference < 0) {
          widthsToUseCopy = angular.copy(widthsToUse);
          biggestCell = Math.max.apply(Math, widthsToUseCopy);
          widthsToUseCopy.splice(widthsToUseCopy.indexOf(biggestCell), 1);
          for (var tempWidths in widthsToUseCopy) {
            tempCellWidth += widthsToUseCopy[tempWidths];
          }
          newCell = window.innerWidth - tempCellWidth;
          widthsToUseCopy.splice(widthsToUse.indexOf(biggestCell), 0, newCell);
          angular.copy(widthsToUseCopy, widthsToUse);
        }

        for (widthToUse in widthsToUse) {
          for (row in rows) {
            if (parseInt(widthToUse) !== widthsToUse.length - 1) {
              rows[row][widthToUse].animate({width: widthsToUse[widthToUse] + 'px'}, 275);
            } else {
              if (windowDifference > 0 && windowDifference > widthsToUse[widthToUse]) {
                rows[row][widthToUse].animate({width: windowDifference + 'px'}, 275);
              } else {                
                rows[row][widthToUse].animate({width: widthsToUse[widthToUse] + 'px'}, 275);
              }
            }
          }
        }

        for (var selectElement in selectElements) {
          if (!isNaN(parseInt(selectElement))) {
            styleAttr = $(selectElements[selectElement]).parent().attr('style');
            styleAttr = parseInt(styleAttr.split(' ')[1].split('p')[0]);
            $(selectElements[selectElement]).animate({width: styleAttr - 1 + 'px'}, 275);
          }
        }

      }

    }
  }
}]);