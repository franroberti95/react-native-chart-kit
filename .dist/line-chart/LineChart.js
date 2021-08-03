var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import React from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import {
  Circle,
  G,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Svg,
  Text
} from "react-native-svg";
import AbstractChart from "../AbstractChart";
import { LegendItem } from "./LegendItem";
var AnimatedCircle = Animated.createAnimatedComponent(Circle);
var differenceBetween = function(num1, num2) {
  return Math.abs(Math.abs(num1) - Math.abs(num2));
};
var _recursiveFindDot = function(needle, haystack, start, end, currentIndex) {
  // Base Condition
  if (start > end) return currentIndex;
  // Find the middle index
  var mid = Math.floor((start + end) / 2);
  var newCurrentIndex =
    haystack[mid] &&
    haystack[mid].x &&
    differenceBetween(haystack[mid].x, needle) <
      differenceBetween(haystack[currentIndex].x, needle)
      ? mid
      : currentIndex;
  if (haystack.length === 1) return newCurrentIndex;
  if (!haystack[mid]) return haystack.length - 1;
  // If element at mid is greater than x,
  // search in the left half of mid
  if (haystack[mid].x > needle)
    return _recursiveFindDot(needle, haystack, start, mid - 1, newCurrentIndex);
  // If element at mid is smaller than x,
  // search in the right half of mid
  else
    return _recursiveFindDot(needle, haystack, mid + 1, end, newCurrentIndex);
};
var recursiveFindDot = function(needle, haystack) {
  return _recursiveFindDot(
    // @ts-ignore
    needle,
    haystack,
    0,
    haystack.length,
    Math.floor(haystack.length / 2)
  );
};
var DotInfoGroup = /** @class */ (function(_super) {
  __extends(DotInfoGroup, _super);
  function DotInfoGroup() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  DotInfoGroup.prototype.render = function() {
    var _a = this.props,
      dotInfoModalProps = _a.dotInfoModalProps,
      touchMoveXCoords = _a.touchMoveXCoords,
      touchMoveYCoords = _a.touchMoveYCoords,
      getDatas = _a.getDatas,
      calcBaseHeight = _a.calcBaseHeight,
      fromNumber = _a.fromNumber,
      calcHeight = _a.calcHeight,
      paddingTop = _a.paddingTop,
      height = _a.height,
      data = _a.data,
      dotsRendered = _a.dotsRendered,
      width = _a.width,
      paddingRight = _a.paddingRight,
      labels = _a.labels,
      labelInTooltipFormatter = _a.labelInTooltipFormatter,
      tooltipLabels = _a.tooltipLabels;
    var units = (dotInfoModalProps || {}).units;
    if (touchMoveXCoords < 0 || !dotsRendered || !dotsRendered.length || !data)
      return null;
    var datas = getDatas(data.datasets);
    var baseHeight = calcBaseHeight(datas, height);
    var maxGraphHeight =
      ((baseHeight -
        calcHeight(fromNumber || Math.min.apply(Math, datas), datas, height)) /
        4) *
        3 +
      paddingTop;
    var x = touchMoveXCoords;
    /** Merge Datasets **/
    var mergedDots = [].concat.apply([], dotsRendered);
    /** Get index of the closest x element **/
    var index = recursiveFindDot(x, mergedDots);
    if (!mergedDots[index]) return null;
    var dotX = mergedDots[index].x;
    var dotY = mergedDots[index].y;
    var xValue = labels[mergedDots[index].index];
    var infoTextGoesOnTop = true;
    if ((touchMoveYCoords < dotY && dotY < maxGraphHeight - 25) || dotY < 50) {
      infoTextGoesOnTop = false;
    }
    var tooltipLabel = tooltipLabels
      ? tooltipLabels[index]
      : (xValue &&
          labelInTooltipFormatter &&
          labelInTooltipFormatter(xValue)) ||
        xValue;
    return (
      <G>
        <Line
          key={Math.random()}
          x1={dotX}
          y1={maxGraphHeight}
          x2={dotX}
          y2={3}
          strokeDasharray={"4 2"}
          stroke={"#F6F6F5"}
          strokeWidth={1}
        />
        <Circle
          key={Math.random()}
          cx={dotX}
          cy={dotY}
          fill={"white"}
          r={4}
          stroke={mergedDots[index].color}
          strokeWidth={2}
        />

        <Rect
          y={dotY + (infoTextGoesOnTop ? -45 : 8)}
          x={Math.min(
            Math.max(dotX - 40, paddingRight),
            width - paddingRight - 24
          )}
          width={80}
          height={40}
          fill="white"
          rx={12}
          ry={12}
        />
        <Text
          y={dotY + (infoTextGoesOnTop ? -28 : 26)}
          x={Math.min(Math.max(dotX, paddingRight + 40), width - 35)}
          fill="black"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          {mergedDots[index].value
            ? mergedDots[index].value.toFixed(2) + " " + units
            : ""}
        </Text>
        <Text
          y={dotY + (infoTextGoesOnTop ? -15 : 39)}
          x={Math.min(Math.max(dotX, paddingRight + 40), width - 35)}
          fill="black"
          fontSize="8"
          textAnchor="middle"
        >
          {tooltipLabel}
        </Text>
      </G>
    );
  };
  return DotInfoGroup;
})(React.Component);
var AnimatedDotInfoGroup = Animated.createAnimatedComponent(DotInfoGroup);
var LineChart = /** @class */ (function(_super) {
  __extends(LineChart, _super);
  function LineChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.label = React.createRef();
    _this.state = {
      scrollableDotHorizontalOffset: new Animated.Value(0),
      touchMoveXCoords: new Animated.Value(-1),
      touchMoveYCoords: new Animated.Value(-1)
    };
    _this.getColor = function(dataset, opacity) {
      return (dataset.color || _this.props.chartConfig.color)(opacity);
    };
    _this.getStrokeWidth = function(dataset) {
      return dataset.strokeWidth || _this.props.chartConfig.strokeWidth || 3;
    };
    _this.getDatas = function(data) {
      return data.reduce(function(acc, item) {
        return item.data ? __spreadArrays(acc, item.data) : acc;
      }, []);
    };
    _this.getPropsForDots = function(x, i) {
      var _a = _this.props,
        getDotProps = _a.getDotProps,
        chartConfig = _a.chartConfig;
      if (typeof getDotProps === "function") {
        return getDotProps(x, i);
      }
      var _b = chartConfig.propsForDots,
        propsForDots = _b === void 0 ? {} : _b;
      return __assign({ r: "4" }, propsForDots);
    };
    _this.dotsRendered = [];
    _this.renderDots = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        onDataPointClick = _a.onDataPointClick;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var _b = _this.props,
        getDotColor = _b.getDotColor,
        _c = _b.hidePointsAtIndex,
        hidePointsAtIndex = _c === void 0 ? [] : _c,
        _d = _b.renderDotContent,
        renderDotContent =
          _d === void 0
            ? function() {
                return null;
              }
            : _d;
      data.forEach(function(dataset, datasetIndex) {
        if (dataset.withDots == false) return;
        var datasetDots = [];
        dataset.data.forEach(function(x, i) {
          if (hidePointsAtIndex.includes(i)) {
            return;
          }
          var cx =
            paddingRight +
            (i * (width - paddingRight - 8)) / (dataset.data.length - 1);
          var cy =
            ((baseHeight - _this.calcHeight(x, datas, height)) / 4) * 3 +
            paddingTop;
          datasetDots.push({
            index: i,
            value: x,
            x: cx,
            y: cy,
            color:
              typeof getDotColor === "function"
                ? getDotColor(x, i)
                : _this.getColor(dataset, 0.9)
          });
          var onPress = function() {
            if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
              return;
            }
            onDataPointClick({
              index: i,
              value: x,
              dataset: dataset,
              x: cx,
              y: cy,
              getColor: function(opacity) {
                return _this.getColor(dataset, opacity);
              }
            });
          };
          output.push(
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              fill={
                typeof getDotColor === "function"
                  ? getDotColor(x, i)
                  : _this.getColor(dataset, 0.9)
              }
              onPress={onPress}
              {..._this.getPropsForDots(x, i)}
            />,
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              r="14"
              fill="#fff"
              fillOpacity={0}
              onPress={onPress}
            />,
            renderDotContent({ x: cx, y: cy, index: i, indexData: x })
          );
        });
        _this.dotsRendered[datasetIndex] = datasetDots;
      });
      return output;
    };
    _this.renderScrollableDot = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        scrollableDotHorizontalOffset = _a.scrollableDotHorizontalOffset,
        scrollableDotFill = _a.scrollableDotFill,
        scrollableDotStrokeColor = _a.scrollableDotStrokeColor,
        scrollableDotStrokeWidth = _a.scrollableDotStrokeWidth,
        scrollableDotRadius = _a.scrollableDotRadius,
        scrollableInfoViewStyle = _a.scrollableInfoViewStyle,
        scrollableInfoTextStyle = _a.scrollableInfoTextStyle,
        _b = _a.scrollableInfoTextDecorator,
        scrollableInfoTextDecorator =
          _b === void 0
            ? function(x) {
                return "" + x;
              }
            : _b,
        scrollableInfoSize = _a.scrollableInfoSize,
        scrollableInfoOffset = _a.scrollableInfoOffset;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var vl = [];
      var perData = width / data[0].data.length;
      for (var index = 0; index < data[0].data.length; index++) {
        vl.push(index * perData);
      }
      var lastIndex;
      scrollableDotHorizontalOffset.addListener(function(value) {
        var index = value.value / perData;
        if (!lastIndex) {
          lastIndex = index;
        }
        var abs = Math.floor(index);
        var percent = index - abs;
        abs = data[0].data.length - abs - 1;
        if (index >= data[0].data.length - 1) {
          _this.label.current.setNativeProps({
            text: scrollableInfoTextDecorator(Math.floor(data[0].data[0]))
          });
        } else {
          if (index > lastIndex) {
            // to right
            var base = data[0].data[abs];
            var prev = data[0].data[abs - 1];
            if (prev > base) {
              var rest = prev - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - prev;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          } else {
            // to left
            var base = data[0].data[abs - 1];
            var next = data[0].data[abs];
            percent = 1 - percent;
            if (next > base) {
              var rest = next - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - next;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          }
        }
        lastIndex = index;
      });
      data.forEach(function(dataset) {
        if (dataset.withScrollableDot == false) return;
        var perData = width / dataset.data.length;
        var values = [];
        var yValues = [];
        var xValues = [];
        var yValuesLabel = [];
        var xValuesLabel = [];
        for (var index = 0; index < dataset.data.length; index++) {
          values.push(index * perData);
          var yval =
            ((baseHeight -
              _this.calcHeight(
                dataset.data[dataset.data.length - index - 1],
                datas,
                height
              )) /
              4) *
              3 +
            paddingTop;
          yValues.push(yval);
          var xval =
            paddingRight +
            ((dataset.data.length - index - 1) * (width - paddingRight)) /
              dataset.data.length;
          xValues.push(xval);
          yValuesLabel.push(
            yval - (scrollableInfoSize.height + scrollableInfoOffset)
          );
          xValuesLabel.push(xval - scrollableInfoSize.width / 2);
        }
        var translateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValues,
          extrapolate: "clamp"
        });
        var translateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValues,
          extrapolate: "clamp"
        });
        var labelTranslateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValuesLabel,
          extrapolate: "clamp"
        });
        var labelTranslateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValuesLabel,
          extrapolate: "clamp"
        });
        output.push([
          <Animated.View
            key={Math.random()}
            style={[
              scrollableInfoViewStyle,
              {
                transform: [
                  { translateX: labelTranslateX },
                  { translateY: labelTranslateY }
                ],
                width: scrollableInfoSize.width,
                height: scrollableInfoSize.height
              }
            ]}
          >
            <TextInput
              onLayout={function() {
                _this.label.current.setNativeProps({
                  text: scrollableInfoTextDecorator(
                    Math.floor(data[0].data[data[0].data.length - 1])
                  )
                });
              }}
              style={scrollableInfoTextStyle}
              ref={_this.label}
            />
          </Animated.View>,
          <AnimatedCircle
            key={Math.random()}
            cx={translateX}
            cy={translateY}
            r={scrollableDotRadius}
            stroke={scrollableDotStrokeColor}
            strokeWidth={scrollableDotStrokeWidth}
            fill={scrollableDotFill}
          />
        ]);
      });
      return output;
    };
    _this.renderShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      if (_this.props.bezier) {
        return _this.renderBezierShadow({
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data,
          useColorFromDataset: useColorFromDataset
        });
      }
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      return data.map(function(dataset, index) {
        return (
          <Polygon
            key={index}
            points={
              dataset.data
                .map(function(d, i) {
                  var x =
                    paddingRight +
                    (i * (width - paddingRight - 8)) / dataset.data.length;
                  var y =
                    ((baseHeight - _this.calcHeight(d, datas, height)) / 4) *
                      3 +
                    paddingTop;
                  return x + "," + y;
                })
                .join(" ") +
              (" " +
                (paddingRight +
                  ((width - paddingRight) / dataset.data.length) *
                    (dataset.data.length - 1)) +
                "," +
                ((height / 4) * 3 + paddingTop) +
                " " +
                paddingRight +
                "," +
                ((height / 4) * 3 + paddingTop))
            }
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLine = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        linejoinType = _a.linejoinType;
      if (_this.props.bezier) {
        return _this.renderBezierLine({
          data: data,
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop
        });
      }
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var lastPoint = "";
      data.forEach(function(dataset, index) {
        var hideLineAtIndex = _this.props.hideLineAtIndex;
        var lineData = dataset.data;
        var emptyKey = "empty";
        var points = lineData.map(function(d, i) {
          if (hideLineAtIndex.includes(i)) return emptyKey;
          if (d === null) return lastPoint;
          var x =
            (i * (width - paddingRight - 8)) / (dataset.data.length - 1) +
            paddingRight;
          var y =
            ((baseHeight - _this.calcHeight(d, datas, height)) / 4) * 3 +
            paddingTop;
          lastPoint = x + "," + y;
          return x + "," + y;
        });
        output.push(
          <Polyline
            key={index}
            strokeLinejoin={linejoinType}
            points={points.join(" ")}
            fill="none"
            stroke={_this.getColor(dataset, 0.2)}
            strokeWidth={_this.getStrokeWidth(dataset)}
            strokeDasharray={dataset.strokeDashArray}
            strokeDashoffset={dataset.strokeDashOffset}
          />
        );
      });
      return output;
    };
    _this.getBezierLinePoints = function(dataset, _a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data;
      if (dataset.data.length === 0) {
        return "M0,0";
      }
      var datas = _this.getDatas(data);
      var x = function(i) {
        return Math.floor(
          paddingRight +
            (i * (width - paddingRight - 8)) / (dataset.data.length - 1)
        );
      };
      var baseHeight = _this.calcBaseHeight(datas, height);
      var y = function(i) {
        var yHeight = _this.calcHeight(dataset.data[i], datas, height);
        return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
      };
      var hideLineAtIndex = _this.props.hideLineAtIndex;
      var firstIndexWithData = dataset.data.findIndex(function(item, index) {
        return !hideLineAtIndex.includes(index) && item !== null;
      });
      if (firstIndexWithData < 0) return "";
      var startX = x(firstIndexWithData);
      var startY = y(firstIndexWithData);
      if (!startX || !startY) return "";
      return ["M" + startX + "," + startY]
        .concat(
          dataset.data.slice(0, -1).map(function(n, i) {
            if (i < firstIndexWithData) return "";
            if (n === null) return "";
            if (dataset.data[i + 1] === null) return "";
            var x_mid = (x(i) + x(i + 1)) / 2;
            var y_mid = (y(i) + y(i + 1)) / 2;
            var cp_x1 = (x_mid + x(i)) / 2;
            var cp_x2 = (x_mid + x(i + 1)) / 2;
            return (
              "Q " +
              cp_x1 +
              ", " +
              y(i) +
              ", " +
              x_mid +
              ", " +
              y_mid +
              (" Q " +
                cp_x2 +
                ", " +
                y(i + 1) +
                ", " +
                x(i + 1) +
                ", " +
                y(i + 1))
            );
          })
        )
        .join(" ");
    };
    _this.renderBezierLine = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop;
      return data.map(function(dataset, index) {
        var realDatasets = [[]];
        for (var i = 0; i < dataset.data.length; i++) {
          var point = dataset.data[i];
          if (point === null) realDatasets.push([]);
          else
            realDatasets[realDatasets.length - 1].push({
              point: point,
              index: i
            });
        }
        realDatasets = realDatasets
          .filter(function(i) {
            return i.length > 0;
          })
          .map(function(i) {
            var iLeftNullsLen = i[0].index;
            var iRightNullsLen = i[i.length - 1].index;
            for (var j = 0; j < iLeftNullsLen; j++) {
              i.unshift(null);
            }
            for (var j = iRightNullsLen; i.length < dataset.data.length; j++) {
              i.push(null);
            }
            return {
              data: i.map(function(j) {
                return j === null ? j : j.point;
              })
            };
          });
        var result = realDatasets.map(function(r) {
          return _this.getBezierLinePoints(r, {
            width: width,
            height: height,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            data: data
          });
        });
        return result.map(function(d) {
          return (
            <Path
              key={index}
              d={d}
              fill="none"
              stroke={_this.getColor(dataset, 0.2)}
              strokeWidth={_this.getStrokeWidth(dataset)}
              strokeDasharray={dataset.strokeDashArray}
              strokeDashoffset={dataset.strokeDashOffset}
            />
          );
        });
      });
    };
    _this.renderBezierShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      return data.map(function(dataset, index) {
        var d =
          _this.getBezierLinePoints(dataset, {
            width: width,
            height: height,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            data: data
          }) +
          (" L" +
            (paddingRight +
              ((width - paddingRight) / (dataset.data.length - 1)) *
                (dataset.data.length - 1)) +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " L" +
            paddingRight +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " Z");
        return (
          <Path
            key={index}
            d={d}
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLegend = function(width, legendOffset) {
      var _a = _this.props.data,
        legend = _a.legend,
        datasets = _a.datasets;
      var baseLegendItemX = width / (legend.length + 1);
      return legend.map(function(legendItem, i) {
        return (
          <G key={Math.random()}>
            <LegendItem
              index={i}
              iconColor={_this.getColor(datasets[i], 0.9)}
              baseLegendItemX={baseLegendItemX}
              legendText={legendItem}
              labelProps={__assign({}, _this.getPropsForLabels())}
              legendOffset={legendOffset}
            />
          </G>
        );
      });
    };
    _this.timeout = null;
    _this.onTouchEnd = function() {
      if (_this.timeout) clearTimeout(_this.timeout);
      _this.timeout = setTimeout(function() {
        _this.state.touchMoveXCoords.setValue(-1);
        _this.state.touchMoveYCoords.setValue(-1);
      }, 1000);
    };
    _this.onTouchMove = function(e) {
      if (_this.timeout) clearTimeout(_this.timeout);
      _this.state.touchMoveXCoords.setValue(e.nativeEvent.locationX);
      _this.state.touchMoveYCoords.setValue(e.nativeEvent.locationY);
    };
    return _this;
  }
  LineChart.prototype.render = function() {
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      data = _a.data,
      _b = _a.withScrollableDot,
      withScrollableDot = _b === void 0 ? false : _b,
      _c = _a.withShadow,
      withShadow = _c === void 0 ? true : _c,
      _d = _a.withDots,
      withDots = _d === void 0 ? true : _d,
      _e = _a.withInnerLines,
      withInnerLines = _e === void 0 ? true : _e,
      _f = _a.withOuterLines,
      withOuterLines = _f === void 0 ? true : _f,
      _g = _a.withHorizontalLines,
      withHorizontalLines = _g === void 0 ? true : _g,
      _h = _a.withVerticalLines,
      withVerticalLines = _h === void 0 ? true : _h,
      _j = _a.withCustomYAxis,
      withCustomYAxis = _j === void 0 ? false : _j,
      _k = _a.withHorizontalLabels,
      withHorizontalLabels = _k === void 0 ? true : _k,
      _l = _a.withVerticalLabels,
      withVerticalLabels = _l === void 0 ? true : _l,
      _m = _a.style,
      style = _m === void 0 ? {} : _m,
      decorator = _a.decorator,
      onDataPointClick = _a.onDataPointClick,
      _o = _a.verticalLabelRotation,
      verticalLabelRotation = _o === void 0 ? 0 : _o,
      _p = _a.horizontalLabelRotation,
      horizontalLabelRotation = _p === void 0 ? 0 : _p,
      _q = _a.formatYLabel,
      formatYLabel =
        _q === void 0
          ? function(yLabel) {
              return yLabel;
            }
          : _q,
      _r = _a.formatXLabel,
      formatXLabel =
        _r === void 0
          ? function(xLabel) {
              return xLabel;
            }
          : _r,
      segments = _a.segments,
      _s = _a.transparent,
      transparent = _s === void 0 ? false : _s,
      chartConfig = _a.chartConfig,
      showDotInfoOnTouch = _a.showDotInfoOnTouch;
    var scrollableDotHorizontalOffset = this.state
      .scrollableDotHorizontalOffset;
    var _t = data.labels,
      labels = _t === void 0 ? [] : _t;
    var _u = style.borderRadius,
      borderRadius = _u === void 0 ? 0 : _u,
      _v = style.paddingTop,
      paddingTop = _v === void 0 ? 16 : _v,
      _w = style.paddingRight,
      paddingRight = _w === void 0 ? 50 : _w,
      _x = style.margin,
      margin = _x === void 0 ? 0 : _x,
      _y = style.marginRight,
      marginRight = _y === void 0 ? 0 : _y,
      _z = style.paddingBottom,
      paddingBottom = _z === void 0 ? 0 : _z;
    var config = {
      width: width,
      height: height,
      verticalLabelRotation: verticalLabelRotation,
      horizontalLabelRotation: horizontalLabelRotation
    };
    var datas = this.getDatas(data.datasets);
    var count =
      this.props.count ||
      (Math.min.apply(Math, datas) === Math.max.apply(Math, datas) ? 1 : 4);
    if (segments) {
      count = segments;
    }
    var legendOffset = this.props.data.legend ? height * 0.15 : 0;
    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + legendOffset}
          width={width - margin * 2 - marginRight + 15}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onTouchStart={this.onTouchMove}
        >
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
            fillOpacity={transparent ? 0 : 1}
          />
          {this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)}
          <G x="0" y={legendOffset}>
            {this.renderDefs(
              __assign(__assign(__assign({}, config), chartConfig), {
                data: data.datasets
              })
            )}
            <G>
              {withHorizontalLines &&
                (withInnerLines
                  ? this.renderHorizontalLines(
                      __assign(__assign({}, config), {
                        count: count,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderHorizontalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withHorizontalLabels &&
                this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: count,
                    data: datas,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatYLabel: formatYLabel,
                    decimalPlaces: chartConfig.decimalPlaces,
                    noDecimalsOnTopAndBotValues: this.props
                      .noDecimalsOnTopAndBotValues
                  })
                )}
            </G>
            <G>
              {withCustomYAxis &&
                this.renderCustomYAxis(
                  __assign(__assign({}, config), {
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    data: data.datasets
                  })
                )}
            </G>
            <G>
              {this.props.customXAxisLegend &&
                this.renderCustomXAxisLegend({
                  paddingTop: paddingTop,
                  customXAxisLegend: this.props.customXAxisLegend
                })}
            </G>
            <G>
              {withVerticalLines &&
                (withInnerLines
                  ? this.renderVerticalLines(
                      __assign(__assign({}, config), {
                        data: data.datasets[0].data,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderVerticalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withVerticalLabels &&
                this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: labels,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatXLabel: formatXLabel
                  })
                )}
            </G>
            <G>
              {this.renderLine(
                __assign(__assign(__assign({}, config), chartConfig), {
                  paddingRight: paddingRight,
                  paddingTop: paddingTop,
                  data: data.datasets
                })
              )}
            </G>
            <G>
              {withShadow &&
                this.renderShadow(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    useColorFromDataset: chartConfig.useShadowColorFromDataset
                  })
                )}
            </G>
            <G>
              {withDots &&
                this.renderDots(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick
                  })
                )}
            </G>
            <G>
              {showDotInfoOnTouch && (
                <AnimatedDotInfoGroup
                  touchMoveXCoords={this.state.touchMoveXCoords}
                  touchMoveYCoords={this.state.touchMoveYCoords}
                  getDatas={this.getDatas}
                  calcBaseHeight={this.calcBaseHeight}
                  fromNumber={this.props.fromNumber}
                  calcHeight={this.calcHeight}
                  labelInTooltipFormatter={this.props.labelInTooltipFormatter}
                  paddingTop={paddingTop}
                  paddingRight={paddingRight}
                  dotInfoModalProps={this.props.dotInfoModalProps}
                  height={height}
                  width={width}
                  data={data}
                  tooltipLabels={this.props.tooltipLabels}
                  labels={labels}
                  dotsRendered={this.dotsRendered}
                />
              )}
            </G>
            <G>
              {withScrollableDot &&
                this.renderScrollableDot(
                  __assign(__assign(__assign({}, config), chartConfig), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick,
                    scrollableDotHorizontalOffset: scrollableDotHorizontalOffset
                  })
                )}
            </G>
            <G>
              {decorator &&
                decorator(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )}
            </G>
          </G>
        </Svg>
        {withScrollableDot && (
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{ width: width * 2 }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { x: scrollableDotHorizontalOffset }
                }
              }
            ])}
            horizontal
            bounces={false}
          />
        )}
      </View>
    );
  };
  return LineChart;
})(AbstractChart);
export default LineChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZUNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpbmUtY2hhcnQvTGluZUNoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUE4QixNQUFNLE9BQU8sQ0FBQztBQUNuRCxPQUFPLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxFQUNULElBQUksRUFFTCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQ0wsTUFBTSxFQUNOLENBQUMsRUFDRCxJQUFJLEVBQ0osSUFBSSxFQUNKLE9BQU8sRUFDUCxRQUFRLEVBQ1IsSUFBSSxFQUNKLEdBQUcsRUFDSCxJQUFJLEVBRUwsTUFBTSxrQkFBa0IsQ0FBQztBQUUxQixPQUFPLGFBR04sTUFBTSxrQkFBa0IsQ0FBQztBQUUxQixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU5RCxJQUFNLGlCQUFpQixHQUFHLFVBQUMsSUFBWSxFQUFFLElBQVk7SUFDbkQsT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUF6QyxDQUF5QyxDQUFDO0FBRTVDLElBQU0saUJBQWlCLEdBQUcsVUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsWUFBWTtJQUNuRSxpQkFBaUI7SUFDakIsSUFBSSxLQUFLLEdBQUcsR0FBRztRQUFFLE9BQU8sWUFBWSxDQUFDO0lBRXJDLHdCQUF3QjtJQUN4QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENB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LEdBeTNCcEM7QUFFRCxlQUFlLFNBQVMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBSZWFjdE5vZGUsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1xuICBBbmltYXRlZCxcbiAgU2Nyb2xsVmlldyxcbiAgU3R5bGVTaGVldCxcbiAgVGV4dElucHV0LFxuICBWaWV3LFxuICBWaWV3U3R5bGVcbn0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHtcbiAgQ2lyY2xlLFxuICBHLFxuICBMaW5lLFxuICBQYXRoLFxuICBQb2x5Z29uLFxuICBQb2x5bGluZSxcbiAgUmVjdCxcbiAgU3ZnLFxuICBUZXh0LFxuICBUU3BhblxufSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgQWJzdHJhY3RDaGFydCwge1xuICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICBBYnN0cmFjdENoYXJ0UHJvcHNcbn0gZnJvbSBcIi4uL0Fic3RyYWN0Q2hhcnRcIjtcbmltcG9ydCB7IENoYXJ0RGF0YSwgRGF0YXNldCB9IGZyb20gXCIuLi9IZWxwZXJUeXBlc1wiO1xuaW1wb3J0IHsgTGVnZW5kSXRlbSB9IGZyb20gXCIuL0xlZ2VuZEl0ZW1cIjtcblxubGV0IEFuaW1hdGVkQ2lyY2xlID0gQW5pbWF0ZWQuY3JlYXRlQW5pbWF0ZWRDb21wb25lbnQoQ2lyY2xlKTtcblxuY29uc3QgZGlmZmVyZW5jZUJldHdlZW4gPSAobnVtMTogbnVtYmVyLCBudW0yOiBudW1iZXIpID0+XG4gIE1hdGguYWJzKE1hdGguYWJzKG51bTEpIC0gTWF0aC5hYnMobnVtMikpO1xuXG5jb25zdCBfcmVjdXJzaXZlRmluZERvdCA9IChuZWVkbGUsIGhheXN0YWNrLCBzdGFydCwgZW5kLCBjdXJyZW50SW5kZXgpID0+IHtcbiAgLy8gQmFzZSBDb25kaXRpb25cbiAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gY3VycmVudEluZGV4O1xuXG4gIC8vIEZpbmQgdGhlIG1pZGRsZSBpbmRleFxuICBsZXQgbWlkID0gTWF0aC5mbG9vcigoc3RhcnQgKyBlbmQpIC8gMik7XG4gIGxldCBuZXdDdXJyZW50SW5kZXggPVxuICAgIGhheXN0YWNrW21pZF0gJiZcbiAgICBoYXlzdGFja1ttaWRdLnggJiZcbiAgICBkaWZmZXJlbmNlQmV0d2VlbihoYXlzdGFja1ttaWRdLngsIG5lZWRsZSkgPFxuICAgICAgZGlmZmVyZW5jZUJldHdlZW4oaGF5c3RhY2tbY3VycmVudEluZGV4XS54LCBuZWVkbGUpXG4gICAgICA/IG1pZFxuICAgICAgOiBjdXJyZW50SW5kZXg7XG5cbiAgaWYgKGhheXN0YWNrLmxlbmd0aCA9PT0gMSkgcmV0dXJuIG5ld0N1cnJlbnRJbmRleDtcbiAgaWYgKCFoYXlzdGFja1ttaWRdKSByZXR1cm4gaGF5c3RhY2subGVuZ3RoIC0gMTtcbiAgLy8gSWYgZWxlbWVudCBhdCBtaWQgaXMgZ3JlYXRlciB0aGFuIHgsXG4gIC8vIHNlYXJjaCBpbiB0aGUgbGVmdCBoYWxmIG9mIG1pZFxuICBpZiAoaGF5c3RhY2tbbWlkXS54ID4gbmVlZGxlKVxuICAgIHJldHVybiBfcmVjdXJzaXZlRmluZERvdChuZWVkbGUsIGhheXN0YWNrLCBzdGFydCwgbWlkIC0gMSwgbmV3Q3VycmVudEluZGV4KTtcbiAgLy8gSWYgZWxlbWVudCBhdCBtaWQgaXMgc21hbGxlciB0aGFuIHgsXG4gIC8vIHNlYXJjaCBpbiB0aGUgcmlnaHQgaGFsZiBvZiBtaWRcbiAgZWxzZVxuICAgIHJldHVybiBfcmVjdXJzaXZlRmluZERvdChuZWVkbGUsIGhheXN0YWNrLCBtaWQgKyAxLCBlbmQsIG5ld0N1cnJlbnRJbmRleCk7XG59O1xuXG5jb25zdCByZWN1cnNpdmVGaW5kRG90ID0gKFxuICBuZWVkbGU6IEFuaW1hdGVkLlZhbHVlLFxuICBoYXlzdGFjazogeyBpbmRleDogbnVtYmVyOyB2YWx1ZTogbnVtYmVyOyB4OiBudW1iZXI7IHk6IG51bWJlciB9W11cbikgPT4ge1xuICByZXR1cm4gX3JlY3Vyc2l2ZUZpbmREb3QoXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIG5lZWRsZSxcbiAgICBoYXlzdGFjayxcbiAgICAwLFxuICAgIGhheXN0YWNrLmxlbmd0aCxcbiAgICBNYXRoLmZsb29yKGhheXN0YWNrLmxlbmd0aCAvIDIpXG4gICk7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIExpbmVDaGFydERhdGEgZXh0ZW5kcyBDaGFydERhdGEge1xuICBsZWdlbmQ/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIC8qKlxuICAgKiBEYXRhIGZvciB0aGUgY2hhcnQuXG4gICAqXG4gICAqIEV4YW1wbGUgZnJvbSBbZG9jc10oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQjbGluZS1jaGFydCk6XG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3QgZGF0YSA9IHtcbiAgICogICBsYWJlbHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZSddLFxuICAgKiAgIGRhdGFzZXRzOiBbe1xuICAgKiAgICAgZGF0YTogWyAyMCwgNDUsIDI4LCA4MCwgOTksIDQzIF0sXG4gICAqICAgICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgxMzQsIDY1LCAyNDQsICR7b3BhY2l0eX0pYCwgLy8gb3B0aW9uYWxcbiAgICogICAgIHN0cm9rZVdpZHRoOiAyIC8vIG9wdGlvbmFsXG4gICAqICAgfV0sXG4gICAqICAgbGVnZW5kOiBbXCJSYWlueSBEYXlzXCIsIFwiU3VubnkgRGF5c1wiLCBcIlNub3d5IERheXNcIl0gLy8gb3B0aW9uYWxcbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIGRhdGE6IExpbmVDaGFydERhdGE7XG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgY2hhcnQsIHVzZSAnRGltZW5zaW9ucycgbGlicmFyeSB0byBnZXQgdGhlIHdpZHRoIG9mIHlvdXIgc2NyZWVuIGZvciByZXNwb25zaXZlLlxuICAgKi9cbiAgd2lkdGg6IG51bWJlcjtcbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgY2hhcnQuXG4gICAqL1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgLyoqXG4gICAqIFNob3cgZG90cyBvbiB0aGUgbGluZSAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoRG90cz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHNoYWRvdyBmb3IgbGluZSAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoU2hhZG93PzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaW5uZXIgZGFzaGVkIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG5cbiAgd2l0aFNjcm9sbGFibGVEb3Q/OiBib29sZWFuO1xuICB3aXRoSW5uZXJMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IG91dGVyIGRhc2hlZCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoT3V0ZXJMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHZlcnRpY2FsIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhWZXJ0aWNhbExpbmVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaG9yaXpvbnRhbCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoSG9yaXpvbnRhbExpbmVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgdmVydGljYWwgbGFiZWxzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhWZXJ0aWNhbExhYmVscz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IGEgY3VzdG9tIFkgYXhpc1xuICAgKi9cbiAgd2l0aEN1c3RvbVlBeGlzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaG9yaXpvbnRhbCBsYWJlbHMgLSBkZWZhdWx0OiBUcnVlLlxuICAgKi9cbiAgd2l0aEhvcml6b250YWxMYWJlbHM/OiBib29sZWFuO1xuICAvKipcbiAgICogUmVuZGVyIGNoYXJ0cyBmcm9tIDAgbm90IGZyb20gdGhlIG1pbmltdW0gdmFsdWUuIC0gZGVmYXVsdDogRmFsc2UuXG4gICAqL1xuICBmcm9tWmVybz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBQcmVwZW5kIHRleHQgdG8gaG9yaXpvbnRhbCBsYWJlbHMgLS0gZGVmYXVsdDogJycuXG4gICAqL1xuICB5QXhpc0xhYmVsPzogc3RyaW5nO1xuICAvKipcbiAgICogQXBwZW5kIHRleHQgdG8gaG9yaXpvbnRhbCBsYWJlbHMgLS0gZGVmYXVsdDogJycuXG4gICAqL1xuICB5QXhpc1N1ZmZpeD86IHN0cmluZztcbiAgLyoqXG4gICAqIFByZXBlbmQgdGV4dCB0byB2ZXJ0aWNhbCBsYWJlbHMgLS0gZGVmYXVsdDogJycuXG4gICAqL1xuICB4QXhpc0xhYmVsPzogc3RyaW5nO1xuICAvKlxuICAgKiBjdXN0b21YQXhpc0xlZ2VuZFxuICAgKlxuICAgKiAqL1xuICBjdXN0b21YQXhpc0xlZ2VuZD86IHN0cmluZztcbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB0aGUgY2hhcnQsIHNlZSBleGFtcGxlOlxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGNoYXJ0Q29uZmlnID0ge1xuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudEZyb206IFwiIzFFMjkyM1wiLFxuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5OiAwLFxuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudFRvOiBcIiMwODEzMERcIixcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHk6IDAuNSxcbiAgICogICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgyNiwgMjU1LCAxNDYsICR7b3BhY2l0eX0pYCxcbiAgICogICBsYWJlbENvbG9yOiAob3BhY2l0eSA9IDEpID0+IGByZ2JhKDI2LCAyNTUsIDE0NiwgJHtvcGFjaXR5fSlgLFxuICAgKiAgIHN0cm9rZVdpZHRoOiAyLCAvLyBvcHRpb25hbCwgZGVmYXVsdCAzXG4gICAqICAgYmFyUGVyY2VudGFnZTogMC41XG4gICAqIH07XG4gICAqIGBgYFxuICAgKi9cbiAgY2hhcnRDb25maWc/OiBBYnN0cmFjdENoYXJ0Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBEaXZpZGUgYXhpcyBxdWFudGl0eSBieSB0aGUgaW5wdXQgbnVtYmVyIC0tIGRlZmF1bHQ6IDEuXG4gICAqL1xuICB5QXhpc0ludGVydmFsPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIGNoYXJ0IGlzIHRyYW5zcGFyZW50XG4gICAqL1xuICB0cmFuc3BhcmVudD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgW3dob2xlIGJ1bmNoXShodHRwczovL2dpdGh1Yi5jb20vaW5kaWVzcGlyaXQvcmVhY3QtbmF0aXZlLWNoYXJ0LWtpdC9ibG9iL21hc3Rlci9zcmMvbGluZS1jaGFydC5qcyNMMjY2KVxuICAgKiBvZiBzdHVmZiBhbmQgY2FuIHJlbmRlciBleHRyYSBlbGVtZW50cyxcbiAgICogc3VjaCBhcyBkYXRhIHBvaW50IGluZm8gb3IgYWRkaXRpb25hbCBtYXJrdXAuXG4gICAqL1xuICBkZWNvcmF0b3I/OiBGdW5jdGlvbjtcbiAgLyoqXG4gICAqIENhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIHdoZW4gYSBkYXRhIHBvaW50IGlzIGNsaWNrZWQuXG4gICAqL1xuICBvbkRhdGFQb2ludENsaWNrPzogKGRhdGE6IHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIHZhbHVlOiBudW1iZXI7XG4gICAgZGF0YXNldDogRGF0YXNldDtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGdldENvbG9yOiAob3BhY2l0eTogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIH0pID0+IHZvaWQ7XG4gIC8qKlxuICAgKiBTdHlsZSBvZiB0aGUgY29udGFpbmVyIHZpZXcgb2YgdGhlIGNoYXJ0LlxuICAgKi9cbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIC8qKlxuICAgKiBBZGQgdGhpcyBwcm9wIHRvIG1ha2UgdGhlIGxpbmUgY2hhcnQgc21vb3RoIGFuZCBjdXJ2eS5cbiAgICpcbiAgICogW0V4YW1wbGVdKGh0dHBzOi8vZ2l0aHViLmNvbS9pbmRpZXNwaXJpdC9yZWFjdC1uYXRpdmUtY2hhcnQta2l0I2Jlemllci1saW5lLWNoYXJ0KVxuICAgKi9cbiAgYmV6aWVyPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIGRvdCBjb2xvciBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gY2FsY3VsYXRlIGNvbG9ycyBvZiBkb3RzIGluIGEgbGluZSBjaGFydC5cbiAgICogVGFrZXMgYChkYXRhUG9pbnQsIGRhdGFQb2ludEluZGV4KWAgYXMgYXJndW1lbnRzLlxuICAgKi9cbiAgZ2V0RG90Q29sb3I/OiAoZGF0YVBvaW50OiBhbnksIGluZGV4OiBudW1iZXIpID0+IHN0cmluZztcbiAgLyoqXG4gICAqIFJlbmRlcnMgYWRkaXRpb25hbCBjb250ZW50IGZvciBkb3RzIGluIGEgbGluZSBjaGFydC5cbiAgICogVGFrZXMgYCh7eCwgeSwgaW5kZXh9KWAgYXMgYXJndW1lbnRzLlxuICAgKi9cbiAgcmVuZGVyRG90Q29udGVudD86IChwYXJhbXM6IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGluZGV4OiBudW1iZXI7XG4gICAgaW5kZXhEYXRhOiBudW1iZXI7XG4gIH0pID0+IFJlYWN0LlJlYWN0Tm9kZTtcbiAgLyoqXG4gICAqIFJvdGF0aW9uIGFuZ2xlIG9mIHRoZSBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQgMCAoZGVncmVlcykuXG4gICAqL1xuICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcbiAgLyoqXG4gICAqIFJvdGF0aW9uIGFuZ2xlIG9mIHRoZSB2ZXJ0aWNhbCBsYWJlbHMgLSBkZWZhdWx0IDAgKGRlZ3JlZXMpLlxuICAgKi9cbiAgdmVydGljYWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICAvKipcbiAgICogT2Zmc2V0IGZvciBZIGF4aXMgbGFiZWxzLlxuICAgKi9cbiAgeUxhYmVsc09mZnNldD86IG51bWJlcjtcbiAgLyoqXG4gICAqIE9mZnNldCBmb3IgWCBheGlzIGxhYmVscy5cbiAgICovXG4gIHhMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBBcnJheSBvZiBpbmRpY2VzIG9mIHRoZSBkYXRhIHBvaW50cyB5b3UgZG9uJ3Qgd2FudCB0byBkaXNwbGF5LlxuICAgKi9cbiAgaGlkZVBvaW50c0F0SW5kZXg/OiBudW1iZXJbXTtcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gY2hhbmdlIHRoZSBmb3JtYXQgb2YgdGhlIGRpc3BsYXkgdmFsdWUgb2YgdGhlIFkgbGFiZWwuXG4gICAqIFRha2VzIHRoZSB5IHZhbHVlIGFzIGFyZ3VtZW50IGFuZCBzaG91bGQgcmV0dXJuIHRoZSBkZXNpcmFibGUgc3RyaW5nLlxuICAgKi9cbiAgZm9ybWF0WUxhYmVsPzogKHlWYWx1ZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNoYW5nZSB0aGUgZm9ybWF0IG9mIHRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBYIGxhYmVsLlxuICAgKiBUYWtlcyB0aGUgWCB2YWx1ZSBhcyBhcmd1bWVudCBhbmQgc2hvdWxkIHJldHVybiB0aGUgZGVzaXJhYmxlIHN0cmluZy5cbiAgICovXG4gIGZvcm1hdFhMYWJlbD86ICh4VmFsdWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICAvKipcbiAgICogUHJvdmlkZSBwcm9wcyBmb3IgYSBkYXRhIHBvaW50IGRvdC5cbiAgICovXG4gIGdldERvdFByb3BzPzogKGRhdGFQb2ludDogYW55LCBpbmRleDogbnVtYmVyKSA9PiBvYmplY3Q7XG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGhvcml6b250YWwgbGluZXNcbiAgICovXG4gIHNlZ21lbnRzPzogbnVtYmVyO1xuICBoaWRlTGluZUF0SW5kZXg/OiBudW1iZXJbXTtcbiAgLypcbiAgICogc2hvd3MgZG90IGluZm8gb24gdG91Y2ggZXZlbnRcbiAgICogKi9cbiAgc2hvd0RvdEluZm9PblRvdWNoPzogYm9vbGVhbjtcbiAgZG90SW5mb01vZGFsUHJvcHM/OiBhbnk7XG4gIGxhYmVsSW5Ub29sdGlwRm9ybWF0dGVyPzogKGxhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcbiAgdG9vbHRpcExhYmVscz86IHN0cmluZ1tdO1xuICB0b051bWJlcj86IG51bWJlcjtcbn1cblxudHlwZSBMaW5lQ2hhcnRTdGF0ZSA9IHtcbiAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQ6IEFuaW1hdGVkLlZhbHVlO1xuICB0b3VjaE1vdmVYQ29vcmRzOiBBbmltYXRlZC5WYWx1ZTtcbiAgdG91Y2hNb3ZlWUNvb3JkczogQW5pbWF0ZWQuVmFsdWU7XG59O1xuXG5jbGFzcyBEb3RJbmZvR3JvdXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGRvdEluZm9Nb2RhbFByb3BzLFxuICAgICAgdG91Y2hNb3ZlWENvb3JkcyxcbiAgICAgIHRvdWNoTW92ZVlDb29yZHMsXG4gICAgICBnZXREYXRhcyxcbiAgICAgIGNhbGNCYXNlSGVpZ2h0LFxuICAgICAgZnJvbU51bWJlcixcbiAgICAgIGNhbGNIZWlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgaGVpZ2h0LFxuICAgICAgZGF0YSxcbiAgICAgIGRvdHNSZW5kZXJlZCxcbiAgICAgIHdpZHRoLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgbGFiZWxzLFxuICAgICAgbGFiZWxJblRvb2x0aXBGb3JtYXR0ZXIsXG4gICAgICB0b29sdGlwTGFiZWxzXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IHVuaXRzIH0gPSBkb3RJbmZvTW9kYWxQcm9wcyB8fCB7fTtcblxuICAgIGlmICh0b3VjaE1vdmVYQ29vcmRzIDwgMCB8fCAhZG90c1JlbmRlcmVkIHx8ICFkb3RzUmVuZGVyZWQubGVuZ3RoIHx8ICFkYXRhKVxuICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBkYXRhcyA9IGdldERhdGFzKGRhdGEuZGF0YXNldHMpO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSBjYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIGNvbnN0IG1heEdyYXBoSGVpZ2h0ID1cbiAgICAgICgoYmFzZUhlaWdodCAtXG4gICAgICAgIGNhbGNIZWlnaHQoZnJvbU51bWJlciB8fCBNYXRoLm1pbiguLi5kYXRhcyksIGRhdGFzLCBoZWlnaHQpKSAvXG4gICAgICAgIDQpICpcbiAgICAgICAgMyArXG4gICAgICBwYWRkaW5nVG9wO1xuICAgIGNvbnN0IHggPSB0b3VjaE1vdmVYQ29vcmRzO1xuICAgIC8qKiBNZXJnZSBEYXRhc2V0cyAqKi9cbiAgICBjb25zdCBtZXJnZWREb3RzID0gW10uY29uY2F0LmFwcGx5KFtdLCBkb3RzUmVuZGVyZWQpO1xuICAgIC8qKiBHZXQgaW5kZXggb2YgdGhlIGNsb3Nlc3QgeCBlbGVtZW50ICoqL1xuXG4gICAgY29uc3QgaW5kZXggPSByZWN1cnNpdmVGaW5kRG90KHgsIG1lcmdlZERvdHMpO1xuICAgIGlmICghbWVyZ2VkRG90c1tpbmRleF0pIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGRvdFggPSBtZXJnZWREb3RzW2luZGV4XS54O1xuICAgIGNvbnN0IGRvdFkgPSBtZXJnZWREb3RzW2luZGV4XS55O1xuICAgIGNvbnN0IHhWYWx1ZSA9IGxhYmVsc1ttZXJnZWREb3RzW2luZGV4XS5pbmRleF07XG4gICAgbGV0IGluZm9UZXh0R29lc09uVG9wID0gdHJ1ZTtcbiAgICBpZiAoKHRvdWNoTW92ZVlDb29yZHMgPCBkb3RZICYmIGRvdFkgPCBtYXhHcmFwaEhlaWdodCAtIDI1KSB8fCBkb3RZIDwgNTApIHtcbiAgICAgIGluZm9UZXh0R29lc09uVG9wID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdG9vbHRpcExhYmVsID0gdG9vbHRpcExhYmVsc1xuICAgICAgPyB0b29sdGlwTGFiZWxzW2luZGV4XVxuICAgICAgOiAoeFZhbHVlICYmXG4gICAgICAgICAgbGFiZWxJblRvb2x0aXBGb3JtYXR0ZXIgJiZcbiAgICAgICAgICBsYWJlbEluVG9vbHRpcEZvcm1hdHRlcih4VmFsdWUpKSB8fFxuICAgICAgICB4VmFsdWU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEc+XG4gICAgICAgIDxMaW5lXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHgxPXtkb3RYfVxuICAgICAgICAgIHkxPXttYXhHcmFwaEhlaWdodH1cbiAgICAgICAgICB4Mj17ZG90WH1cbiAgICAgICAgICB5Mj17M31cbiAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e1wiNCAyXCJ9XG4gICAgICAgICAgc3Ryb2tlPXtcIiNGNkY2RjVcIn1cbiAgICAgICAgICBzdHJva2VXaWR0aD17MX1cbiAgICAgICAgLz5cbiAgICAgICAgPENpcmNsZVxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICBjeD17ZG90WH1cbiAgICAgICAgICBjeT17ZG90WX1cbiAgICAgICAgICBmaWxsPXtcIndoaXRlXCJ9XG4gICAgICAgICAgcj17NH1cbiAgICAgICAgICBzdHJva2U9e21lcmdlZERvdHNbaW5kZXhdLmNvbG9yfVxuICAgICAgICAgIHN0cm9rZVdpZHRoPXsyfVxuICAgICAgICAvPlxuICAgICAgICB7LyogSG9yaXpvbnRhbCBsaW5lXG4gICAgICAgICAgKlxuICAgICAgICA8TGluZVxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICB4MT17MH1cbiAgICAgICAgICB5MT17ZG90WX1cbiAgICAgICAgICB4Mj17d2lkdGh9XG4gICAgICAgICAgeTI9e2RvdFl9XG4gICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtcIjQgMVwifVxuICAgICAgICAgIHN0cm9rZT17XCJ3aGl0ZVwifVxuICAgICAgICAgIHN0cm9rZVdpZHRoPXsyfVxuICAgICAgICAvPlxuICAgICAgICAgICogKi99XG4gICAgICAgIDxSZWN0XG4gICAgICAgICAgeT17ZG90WSArIChpbmZvVGV4dEdvZXNPblRvcCA/IC00NSA6IDgpfVxuICAgICAgICAgIHg9e01hdGgubWluKFxuICAgICAgICAgICAgTWF0aC5tYXgoZG90WCAtIDQwLCBwYWRkaW5nUmlnaHQpLFxuICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nUmlnaHQgLSAyNFxuICAgICAgICAgICl9XG4gICAgICAgICAgd2lkdGg9ezgwfVxuICAgICAgICAgIGhlaWdodD17NDB9XG4gICAgICAgICAgZmlsbD1cIndoaXRlXCJcbiAgICAgICAgICByeD17MTJ9XG4gICAgICAgICAgcnk9ezEyfVxuICAgICAgICAvPlxuICAgICAgICA8VGV4dFxuICAgICAgICAgIHk9e2RvdFkgKyAoaW5mb1RleHRHb2VzT25Ub3AgPyAtMjggOiAyNil9XG4gICAgICAgICAgeD17TWF0aC5taW4oTWF0aC5tYXgoZG90WCwgcGFkZGluZ1JpZ2h0ICsgNDApLCB3aWR0aCAtIDM1KX1cbiAgICAgICAgICBmaWxsPVwiYmxhY2tcIlxuICAgICAgICAgIGZvbnRTaXplPVwiMTBcIlxuICAgICAgICAgIGZvbnRXZWlnaHQ9XCJib2xkXCJcbiAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgPlxuICAgICAgICAgIHttZXJnZWREb3RzW2luZGV4XS52YWx1ZVxuICAgICAgICAgICAgPyBtZXJnZWREb3RzW2luZGV4XS52YWx1ZS50b0ZpeGVkKDIpICsgXCIgXCIgKyB1bml0c1xuICAgICAgICAgICAgOiBcIlwifVxuICAgICAgICA8L1RleHQ+XG4gICAgICAgIDxUZXh0XG4gICAgICAgICAgeT17ZG90WSArIChpbmZvVGV4dEdvZXNPblRvcCA/IC0xNSA6IDM5KX1cbiAgICAgICAgICB4PXtNYXRoLm1pbihNYXRoLm1heChkb3RYLCBwYWRkaW5nUmlnaHQgKyA0MCksIHdpZHRoIC0gMzUpfVxuICAgICAgICAgIGZpbGw9XCJibGFja1wiXG4gICAgICAgICAgZm9udFNpemU9XCI4XCJcbiAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0b29sdGlwTGFiZWx9XG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvRz5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IEFuaW1hdGVkRG90SW5mb0dyb3VwID0gQW5pbWF0ZWQuY3JlYXRlQW5pbWF0ZWRDb21wb25lbnQoRG90SW5mb0dyb3VwKTtcblxuY2xhc3MgTGluZUNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxMaW5lQ2hhcnRQcm9wcywgTGluZUNoYXJ0U3RhdGU+IHtcbiAgbGFiZWwgPSBSZWFjdC5jcmVhdGVSZWY8VGV4dElucHV0PigpO1xuXG4gIHN0YXRlID0ge1xuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0OiBuZXcgQW5pbWF0ZWQuVmFsdWUoMCksXG4gICAgdG91Y2hNb3ZlWENvb3JkczogbmV3IEFuaW1hdGVkLlZhbHVlKC0xKSxcbiAgICB0b3VjaE1vdmVZQ29vcmRzOiBuZXcgQW5pbWF0ZWQuVmFsdWUoLTEpXG4gIH07XG5cbiAgZ2V0Q29sb3IgPSAoZGF0YXNldDogRGF0YXNldCwgb3BhY2l0eTogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIChkYXRhc2V0LmNvbG9yIHx8IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IpKG9wYWNpdHkpO1xuICB9O1xuXG4gIGdldFN0cm9rZVdpZHRoID0gKGRhdGFzZXQ6IERhdGFzZXQpID0+IHtcbiAgICByZXR1cm4gZGF0YXNldC5zdHJva2VXaWR0aCB8fCB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLnN0cm9rZVdpZHRoIHx8IDM7XG4gIH07XG5cbiAgZ2V0RGF0YXMgPSAoZGF0YTogRGF0YXNldFtdKTogbnVtYmVyW10gPT4ge1xuICAgIHJldHVybiBkYXRhLnJlZHVjZShcbiAgICAgIChhY2MsIGl0ZW0pID0+IChpdGVtLmRhdGEgPyBbLi4uYWNjLCAuLi5pdGVtLmRhdGFdIDogYWNjKSxcbiAgICAgIFtdXG4gICAgKTtcbiAgfTtcblxuICBnZXRQcm9wc0ZvckRvdHMgPSAoeDogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCB7IGdldERvdFByb3BzLCBjaGFydENvbmZpZyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICh0eXBlb2YgZ2V0RG90UHJvcHMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIGdldERvdFByb3BzKHgsIGkpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgcHJvcHNGb3JEb3RzID0ge30gfSA9IGNoYXJ0Q29uZmlnO1xuXG4gICAgcmV0dXJuIHsgcjogXCI0XCIsIC4uLnByb3BzRm9yRG90cyB9O1xuICB9O1xuXG4gIGRvdHNSZW5kZXJlZCA9IFtdO1xuXG4gIHJlbmRlckRvdHMgPSAoe1xuICAgIGRhdGEsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIG9uRGF0YVBvaW50Q2xpY2tcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxuICA+ICYge1xuICAgIG9uRGF0YVBvaW50Q2xpY2s6IExpbmVDaGFydFByb3BzW1wib25EYXRhUG9pbnRDbGlja1wiXTtcbiAgfSkgPT4ge1xuICAgIGNvbnN0IG91dHB1dDogUmVhY3ROb2RlW10gPSBbXTtcbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XG5cbiAgICBjb25zdCB7XG4gICAgICBnZXREb3RDb2xvcixcbiAgICAgIGhpZGVQb2ludHNBdEluZGV4ID0gW10sXG4gICAgICByZW5kZXJEb3RDb250ZW50ID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGRhdGEuZm9yRWFjaCgoZGF0YXNldCwgZGF0YXNldEluZGV4KSA9PiB7XG4gICAgICBpZiAoZGF0YXNldC53aXRoRG90cyA9PSBmYWxzZSkgcmV0dXJuO1xuICAgICAgY29uc3QgZGF0YXNldERvdHMgPSBbXTtcbiAgICAgIGRhdGFzZXQuZGF0YS5mb3JFYWNoKCh4LCBpKSA9PiB7XG4gICAgICAgIGlmIChoaWRlUG9pbnRzQXRJbmRleC5pbmNsdWRlcyhpKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN4ID1cbiAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0IC0gOCkpIC8gKGRhdGFzZXQuZGF0YS5sZW5ndGggLSAxKTtcblxuICAgICAgICBjb25zdCBjeSA9XG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KHgsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXG4gICAgICAgICAgcGFkZGluZ1RvcDtcblxuICAgICAgICBkYXRhc2V0RG90cy5wdXNoKHtcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICB2YWx1ZTogeCxcbiAgICAgICAgICB4OiBjeCxcbiAgICAgICAgICB5OiBjeSxcbiAgICAgICAgICBjb2xvcjpcbiAgICAgICAgICAgIHR5cGVvZiBnZXREb3RDb2xvciA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgID8gZ2V0RG90Q29sb3IoeCwgaSlcbiAgICAgICAgICAgICAgOiB0aGlzLmdldENvbG9yKGRhdGFzZXQsIDAuOSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgb25QcmVzcyA9ICgpID0+IHtcbiAgICAgICAgICBpZiAoIW9uRGF0YVBvaW50Q2xpY2sgfHwgaGlkZVBvaW50c0F0SW5kZXguaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvbkRhdGFQb2ludENsaWNrKHtcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgdmFsdWU6IHgsXG4gICAgICAgICAgICBkYXRhc2V0LFxuICAgICAgICAgICAgeDogY3gsXG4gICAgICAgICAgICB5OiBjeSxcbiAgICAgICAgICAgIGdldENvbG9yOiBvcGFjaXR5ID0+IHRoaXMuZ2V0Q29sb3IoZGF0YXNldCwgb3BhY2l0eSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBvdXRwdXQucHVzaChcbiAgICAgICAgICA8Q2lyY2xlXG4gICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICBjeD17Y3h9XG4gICAgICAgICAgICBjeT17Y3l9XG4gICAgICAgICAgICBmaWxsPXtcbiAgICAgICAgICAgICAgdHlwZW9mIGdldERvdENvbG9yID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICA/IGdldERvdENvbG9yKHgsIGkpXG4gICAgICAgICAgICAgICAgOiB0aGlzLmdldENvbG9yKGRhdGFzZXQsIDAuOSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uUHJlc3M9e29uUHJlc3N9XG4gICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckRvdHMoeCwgaSl9XG4gICAgICAgICAgLz4sXG4gICAgICAgICAgPENpcmNsZVxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgY3g9e2N4fVxuICAgICAgICAgICAgY3k9e2N5fVxuICAgICAgICAgICAgcj1cIjE0XCJcbiAgICAgICAgICAgIGZpbGw9XCIjZmZmXCJcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5PXswfVxuICAgICAgICAgICAgb25QcmVzcz17b25QcmVzc31cbiAgICAgICAgICAvPixcbiAgICAgICAgICByZW5kZXJEb3RDb250ZW50KHsgeDogY3gsIHk6IGN5LCBpbmRleDogaSwgaW5kZXhEYXRhOiB4IH0pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZG90c1JlbmRlcmVkW2RhdGFzZXRJbmRleF0gPSBkYXRhc2V0RG90cztcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgcmVuZGVyU2Nyb2xsYWJsZURvdCA9ICh7XG4gICAgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQsXG4gICAgc2Nyb2xsYWJsZURvdEZpbGwsXG4gICAgc2Nyb2xsYWJsZURvdFN0cm9rZUNvbG9yLFxuICAgIHNjcm9sbGFibGVEb3RTdHJva2VXaWR0aCxcbiAgICBzY3JvbGxhYmxlRG90UmFkaXVzLFxuICAgIHNjcm9sbGFibGVJbmZvVmlld1N0eWxlLFxuICAgIHNjcm9sbGFibGVJbmZvVGV4dFN0eWxlLFxuICAgIHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvciA9IHggPT4gYCR7eH1gLFxuICAgIHNjcm9sbGFibGVJbmZvU2l6ZSxcbiAgICBzY3JvbGxhYmxlSW5mb09mZnNldFxuICB9OiBBYnN0cmFjdENoYXJ0Q29uZmlnICYge1xuICAgIG9uRGF0YVBvaW50Q2xpY2s6IExpbmVDaGFydFByb3BzW1wib25EYXRhUG9pbnRDbGlja1wiXTtcbiAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldDogQW5pbWF0ZWQuVmFsdWU7XG4gIH0pID0+IHtcbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XG5cbiAgICBsZXQgdmw6IG51bWJlcltdID0gW107XG5cbiAgICBjb25zdCBwZXJEYXRhID0gd2lkdGggLyBkYXRhWzBdLmRhdGEubGVuZ3RoO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhWzBdLmRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2bC5wdXNoKGluZGV4ICogcGVyRGF0YSk7XG4gICAgfVxuICAgIGxldCBsYXN0SW5kZXg6IG51bWJlcjtcblxuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmFkZExpc3RlbmVyKHZhbHVlID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdmFsdWUudmFsdWUgLyBwZXJEYXRhO1xuICAgICAgaWYgKCFsYXN0SW5kZXgpIHtcbiAgICAgICAgbGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICB9XG5cbiAgICAgIGxldCBhYnMgPSBNYXRoLmZsb29yKGluZGV4KTtcbiAgICAgIGxldCBwZXJjZW50ID0gaW5kZXggLSBhYnM7XG4gICAgICBhYnMgPSBkYXRhWzBdLmRhdGEubGVuZ3RoIC0gYWJzIC0gMTtcblxuICAgICAgaWYgKGluZGV4ID49IGRhdGFbMF0uZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKE1hdGguZmxvb3IoZGF0YVswXS5kYXRhWzBdKSlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaW5kZXggPiBsYXN0SW5kZXgpIHtcbiAgICAgICAgICAvLyB0byByaWdodFxuXG4gICAgICAgICAgY29uc3QgYmFzZSA9IGRhdGFbMF0uZGF0YVthYnNdO1xuICAgICAgICAgIGNvbnN0IHByZXYgPSBkYXRhWzBdLmRhdGFbYWJzIC0gMV07XG4gICAgICAgICAgaWYgKHByZXYgPiBiYXNlKSB7XG4gICAgICAgICAgICBsZXQgcmVzdCA9IHByZXYgLSBiYXNlO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSArIHBlcmNlbnQgKiByZXN0KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlc3QgPSBiYXNlIC0gcHJldjtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGJhc2UgLSBwZXJjZW50ICogcmVzdClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHRvIGxlZnRcblxuICAgICAgICAgIGNvbnN0IGJhc2UgPSBkYXRhWzBdLmRhdGFbYWJzIC0gMV07XG4gICAgICAgICAgY29uc3QgbmV4dCA9IGRhdGFbMF0uZGF0YVthYnNdO1xuICAgICAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcbiAgICAgICAgICBpZiAobmV4dCA+IGJhc2UpIHtcbiAgICAgICAgICAgIGxldCByZXN0ID0gbmV4dCAtIGJhc2U7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlICsgcGVyY2VudCAqIHJlc3QpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzdCA9IGJhc2UgLSBuZXh0O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSAtIHBlcmNlbnQgKiByZXN0KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxhc3RJbmRleCA9IGluZGV4O1xuICAgIH0pO1xuXG4gICAgZGF0YS5mb3JFYWNoKGRhdGFzZXQgPT4ge1xuICAgICAgaWYgKGRhdGFzZXQud2l0aFNjcm9sbGFibGVEb3QgPT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgY29uc3QgcGVyRGF0YSA9IHdpZHRoIC8gZGF0YXNldC5kYXRhLmxlbmd0aDtcbiAgICAgIGxldCB2YWx1ZXMgPSBbXTtcbiAgICAgIGxldCB5VmFsdWVzID0gW107XG4gICAgICBsZXQgeFZhbHVlcyA9IFtdO1xuXG4gICAgICBsZXQgeVZhbHVlc0xhYmVsID0gW107XG4gICAgICBsZXQgeFZhbHVlc0xhYmVsID0gW107XG5cbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhc2V0LmRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKGluZGV4ICogcGVyRGF0YSk7XG4gICAgICAgIGNvbnN0IHl2YWwgPVxuICAgICAgICAgICgoYmFzZUhlaWdodCAtXG4gICAgICAgICAgICB0aGlzLmNhbGNIZWlnaHQoXG4gICAgICAgICAgICAgIGRhdGFzZXQuZGF0YVtkYXRhc2V0LmRhdGEubGVuZ3RoIC0gaW5kZXggLSAxXSxcbiAgICAgICAgICAgICAgZGF0YXMsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgKSkgL1xuICAgICAgICAgICAgNCkgKlxuICAgICAgICAgICAgMyArXG4gICAgICAgICAgcGFkZGluZ1RvcDtcbiAgICAgICAgeVZhbHVlcy5wdXNoKHl2YWwpO1xuICAgICAgICBjb25zdCB4dmFsID1cbiAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICgoZGF0YXNldC5kYXRhLmxlbmd0aCAtIGluZGV4IC0gMSkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvXG4gICAgICAgICAgICBkYXRhc2V0LmRhdGEubGVuZ3RoO1xuICAgICAgICB4VmFsdWVzLnB1c2goeHZhbCk7XG5cbiAgICAgICAgeVZhbHVlc0xhYmVsLnB1c2goXG4gICAgICAgICAgeXZhbCAtIChzY3JvbGxhYmxlSW5mb1NpemUuaGVpZ2h0ICsgc2Nyb2xsYWJsZUluZm9PZmZzZXQpXG4gICAgICAgICk7XG4gICAgICAgIHhWYWx1ZXNMYWJlbC5wdXNoKHh2YWwgLSBzY3JvbGxhYmxlSW5mb1NpemUud2lkdGggLyAyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdHJhbnNsYXRlWCA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxuICAgICAgICBvdXRwdXRSYW5nZTogeFZhbHVlcyxcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRyYW5zbGF0ZVkgPSBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5pbnRlcnBvbGF0ZSh7XG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcbiAgICAgICAgb3V0cHV0UmFuZ2U6IHlWYWx1ZXMsXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsYWJlbFRyYW5zbGF0ZVggPSBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5pbnRlcnBvbGF0ZSh7XG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcbiAgICAgICAgb3V0cHV0UmFuZ2U6IHhWYWx1ZXNMYWJlbCxcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGxhYmVsVHJhbnNsYXRlWSA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxuICAgICAgICBvdXRwdXRSYW5nZTogeVZhbHVlc0xhYmVsLFxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXG4gICAgICB9KTtcblxuICAgICAgb3V0cHV0LnB1c2goW1xuICAgICAgICA8QW5pbWF0ZWQuVmlld1xuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICBzdHlsZT17W1xuICAgICAgICAgICAgc2Nyb2xsYWJsZUluZm9WaWV3U3R5bGUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xuICAgICAgICAgICAgICAgIHsgdHJhbnNsYXRlWDogbGFiZWxUcmFuc2xhdGVYIH0sXG4gICAgICAgICAgICAgICAgeyB0cmFuc2xhdGVZOiBsYWJlbFRyYW5zbGF0ZVkgfVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB3aWR0aDogc2Nyb2xsYWJsZUluZm9TaXplLndpZHRoLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNjcm9sbGFibGVJbmZvU2l6ZS5oZWlnaHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdfVxuICAgICAgICA+XG4gICAgICAgICAgPFRleHRJbnB1dFxuICAgICAgICAgICAgb25MYXlvdXQ9eygpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRhdGFbMF0uZGF0YVtkYXRhWzBdLmRhdGEubGVuZ3RoIC0gMV0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzdHlsZT17c2Nyb2xsYWJsZUluZm9UZXh0U3R5bGV9XG4gICAgICAgICAgICByZWY9e3RoaXMubGFiZWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9BbmltYXRlZC5WaWV3PixcbiAgICAgICAgPEFuaW1hdGVkQ2lyY2xlXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIGN4PXt0cmFuc2xhdGVYfVxuICAgICAgICAgIGN5PXt0cmFuc2xhdGVZfVxuICAgICAgICAgIHI9e3Njcm9sbGFibGVEb3RSYWRpdXN9XG4gICAgICAgICAgc3Ryb2tlPXtzY3JvbGxhYmxlRG90U3Ryb2tlQ29sb3J9XG4gICAgICAgICAgc3Ryb2tlV2lkdGg9e3Njcm9sbGFibGVEb3RTdHJva2VXaWR0aH1cbiAgICAgICAgICBmaWxsPXtzY3JvbGxhYmxlRG90RmlsbH1cbiAgICAgICAgLz5cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICByZW5kZXJTaGFkb3cgPSAoe1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBkYXRhLFxuICAgIHVzZUNvbG9yRnJvbURhdGFzZXRcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxuICA+ICYge1xuICAgIHVzZUNvbG9yRnJvbURhdGFzZXQ6IEFic3RyYWN0Q2hhcnRDb25maWdbXCJ1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XCJdO1xuICB9KSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuYmV6aWVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJCZXppZXJTaGFkb3coe1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHVzZUNvbG9yRnJvbURhdGFzZXRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIHJldHVybiBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxQb2x5Z29uXG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICBwb2ludHM9e1xuICAgICAgICAgICAgZGF0YXNldC5kYXRhXG4gICAgICAgICAgICAgIC5tYXAoKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID1cbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodCArXG4gICAgICAgICAgICAgICAgICAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCAtIDgpKSAvIGRhdGFzZXQuZGF0YS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB5ID1cbiAgICAgICAgICAgICAgICAgICgoYmFzZUhlaWdodCAtIHRoaXMuY2FsY0hlaWdodChkLCBkYXRhcywgaGVpZ2h0KSkgLyA0KSAqIDMgK1xuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDtcblxuICAgICAgICAgICAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmpvaW4oXCIgXCIpICtcbiAgICAgICAgICAgIGAgJHtwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIGRhdGFzZXQuZGF0YS5sZW5ndGgpICpcbiAgICAgICAgICAgICAgICAoZGF0YXNldC5kYXRhLmxlbmd0aCAtIDEpfSwkeyhoZWlnaHQgLyA0KSAqIDMgK1xuICAgICAgICAgICAgICBwYWRkaW5nVG9wfSAke3BhZGRpbmdSaWdodH0sJHsoaGVpZ2h0IC8gNCkgKiAzICsgcGFkZGluZ1RvcH1gXG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGw9e2B1cmwoI2ZpbGxTaGFkb3dHcmFkaWVudCR7XG4gICAgICAgICAgICB1c2VDb2xvckZyb21EYXRhc2V0ID8gYF8ke2luZGV4fWAgOiBcIlwiXG4gICAgICAgICAgfSlgfVxuICAgICAgICAgIHN0cm9rZVdpZHRoPXswfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXJMaW5lID0gKHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgZGF0YSxcbiAgICBsaW5lam9pblR5cGVcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIiB8IFwibGluZWpvaW5UeXBlXCJcbiAgPikgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmJlemllcikge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQmV6aWVyTGluZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgICAgcGFkZGluZ1RvcFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0ID0gW107XG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgbGV0IGxhc3RQb2ludDogc3RyaW5nID0gXCJcIjtcblxuICAgIGRhdGEuZm9yRWFjaCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHsgaGlkZUxpbmVBdEluZGV4IH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgbGluZURhdGEgPSBkYXRhc2V0LmRhdGE7XG4gICAgICBjb25zdCBlbXB0eUtleSA9IFwiZW1wdHlcIjtcbiAgICAgIGNvbnN0IHBvaW50cyA9IGxpbmVEYXRhLm1hcCgoZCwgaSkgPT4ge1xuICAgICAgICBpZiAoaGlkZUxpbmVBdEluZGV4LmluY2x1ZGVzKGkpKSByZXR1cm4gZW1wdHlLZXk7XG4gICAgICAgIGlmIChkID09PSBudWxsKSByZXR1cm4gbGFzdFBvaW50O1xuICAgICAgICBjb25zdCB4ID1cbiAgICAgICAgICAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCAtIDgpKSAvIChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMSkgK1xuICAgICAgICAgIHBhZGRpbmdSaWdodDtcbiAgICAgICAgY29uc3QgeSA9XG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KGQsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXG4gICAgICAgICAgcGFkZGluZ1RvcDtcbiAgICAgICAgbGFzdFBvaW50ID0gYCR7eH0sJHt5fWA7XG4gICAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICAgIH0pO1xuXG4gICAgICBvdXRwdXQucHVzaChcbiAgICAgICAgPFBvbHlsaW5lXG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICBzdHJva2VMaW5lam9pbj17bGluZWpvaW5UeXBlfVxuICAgICAgICAgIHBvaW50cz17cG9pbnRzLmpvaW4oXCIgXCIpfVxuICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC4yKX1cbiAgICAgICAgICBzdHJva2VXaWR0aD17dGhpcy5nZXRTdHJva2VXaWR0aChkYXRhc2V0KX1cbiAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e2RhdGFzZXQuc3Ryb2tlRGFzaEFycmF5fVxuICAgICAgICAgIHN0cm9rZURhc2hvZmZzZXQ9e2RhdGFzZXQuc3Ryb2tlRGFzaE9mZnNldH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIGdldEJlemllckxpbmVQb2ludHMgPSAoXG4gICAgZGF0YXNldDogRGF0YXNldCxcbiAgICB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgIHBhZGRpbmdUb3AsXG4gICAgICBkYXRhXG4gICAgfTogUGljazxcbiAgICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgICBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJkYXRhXCJcbiAgICA+XG4gICkgPT4ge1xuICAgIGlmIChkYXRhc2V0LmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJNMCwwXCI7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuXG4gICAgY29uc3QgeCA9IChpOiBudW1iZXIpID0+XG4gICAgICBNYXRoLmZsb29yKFxuICAgICAgICBwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0IC0gOCkpIC8gKGRhdGFzZXQuZGF0YS5sZW5ndGggLSAxKVxuICAgICAgKTtcblxuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgeSA9IChpOiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IHlIZWlnaHQgPSB0aGlzLmNhbGNIZWlnaHQoZGF0YXNldC5kYXRhW2ldLCBkYXRhcywgaGVpZ2h0KTtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKCgoYmFzZUhlaWdodCAtIHlIZWlnaHQpIC8gNCkgKiAzICsgcGFkZGluZ1RvcCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHsgaGlkZUxpbmVBdEluZGV4IH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGZpcnN0SW5kZXhXaXRoRGF0YSA9IGRhdGFzZXQuZGF0YS5maW5kSW5kZXgoXG4gICAgICAoaXRlbSwgaW5kZXgpID0+ICFoaWRlTGluZUF0SW5kZXguaW5jbHVkZXMoaW5kZXgpICYmIGl0ZW0gIT09IG51bGxcbiAgICApO1xuXG4gICAgaWYgKGZpcnN0SW5kZXhXaXRoRGF0YSA8IDApIHJldHVybiBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0WCA9IHgoZmlyc3RJbmRleFdpdGhEYXRhKTtcbiAgICBjb25zdCBzdGFydFkgPSB5KGZpcnN0SW5kZXhXaXRoRGF0YSk7XG5cbiAgICBpZiAoIXN0YXJ0WCB8fCAhc3RhcnRZKSByZXR1cm4gXCJcIjtcblxuICAgIHJldHVybiBbYE0ke3N0YXJ0WH0sJHtzdGFydFl9YF1cbiAgICAgIC5jb25jYXQoXG4gICAgICAgIGRhdGFzZXQuZGF0YS5zbGljZSgwLCAtMSkubWFwKChuLCBpKSA9PiB7XG4gICAgICAgICAgaWYgKGkgPCBmaXJzdEluZGV4V2l0aERhdGEpIHJldHVybiBcIlwiO1xuICAgICAgICAgIGlmIChuID09PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICAgICAgICBpZiAoZGF0YXNldC5kYXRhW2kgKyAxXSA9PT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgY29uc3QgeF9taWQgPSAoeChpKSArIHgoaSArIDEpKSAvIDI7XG4gICAgICAgICAgY29uc3QgeV9taWQgPSAoeShpKSArIHkoaSArIDEpKSAvIDI7XG4gICAgICAgICAgY29uc3QgY3BfeDEgPSAoeF9taWQgKyB4KGkpKSAvIDI7XG4gICAgICAgICAgY29uc3QgY3BfeDIgPSAoeF9taWQgKyB4KGkgKyAxKSkgLyAyO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBgUSAke2NwX3gxfSwgJHt5KGkpfSwgJHt4X21pZH0sICR7eV9taWR9YCArXG4gICAgICAgICAgICBgIFEgJHtjcF94Mn0sICR7eShpICsgMSl9LCAke3goaSArIDEpfSwgJHt5KGkgKyAxKX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5qb2luKFwiIFwiKTtcbiAgfTtcblxuICByZW5kZXJCZXppZXJMaW5lID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcFxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4pID0+IHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgcmVhbERhdGFzZXRzOiBhbnlbXSA9IFtbXV07XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YXNldC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBwb2ludCA9IGRhdGFzZXQuZGF0YVtpXTtcbiAgICAgICAgaWYgKHBvaW50ID09PSBudWxsKSByZWFsRGF0YXNldHMucHVzaChbXSk7XG4gICAgICAgIGVsc2UgcmVhbERhdGFzZXRzW3JlYWxEYXRhc2V0cy5sZW5ndGggLSAxXS5wdXNoKHsgcG9pbnQsIGluZGV4OiBpIH0pO1xuICAgICAgfVxuXG4gICAgICByZWFsRGF0YXNldHMgPSByZWFsRGF0YXNldHNcbiAgICAgICAgLmZpbHRlcihpID0+IGkubGVuZ3RoID4gMClcbiAgICAgICAgLm1hcChpID0+IHtcbiAgICAgICAgICBjb25zdCBpTGVmdE51bGxzTGVuID0gaVswXS5pbmRleDtcbiAgICAgICAgICBjb25zdCBpUmlnaHROdWxsc0xlbiA9IGlbaS5sZW5ndGggLSAxXS5pbmRleDtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGlMZWZ0TnVsbHNMZW47IGorKykge1xuICAgICAgICAgICAgaS51bnNoaWZ0KG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGxldCBqID0gaVJpZ2h0TnVsbHNMZW47IGkubGVuZ3RoIDwgZGF0YXNldC5kYXRhLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpLnB1c2gobnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7IGRhdGE6IGkubWFwKGogPT4gKGogPT09IG51bGwgPyBqIDogai5wb2ludCkpIH07XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSByZWFsRGF0YXNldHMubWFwKHIgPT5cbiAgICAgICAgdGhpcy5nZXRCZXppZXJMaW5lUG9pbnRzKHIsIHtcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgZGF0YVxuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdC5tYXAoZCA9PiAoXG4gICAgICAgIDxQYXRoXG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICBkPXtkfVxuICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC4yKX1cbiAgICAgICAgICBzdHJva2VXaWR0aD17dGhpcy5nZXRTdHJva2VXaWR0aChkYXRhc2V0KX1cbiAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e2RhdGFzZXQuc3Ryb2tlRGFzaEFycmF5fVxuICAgICAgICAgIHN0cm9rZURhc2hvZmZzZXQ9e2RhdGFzZXQuc3Ryb2tlRGFzaE9mZnNldH1cbiAgICAgICAgLz5cbiAgICAgICkpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlckJlemllclNoYWRvdyA9ICh7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIGRhdGEsXG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldFxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4gJiB7XG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldDogQWJzdHJhY3RDaGFydENvbmZpZ1tcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIl07XG4gIH0pID0+XG4gICAgZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBkID1cbiAgICAgICAgdGhpcy5nZXRCZXppZXJMaW5lUG9pbnRzKGRhdGFzZXQsIHtcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgZGF0YVxuICAgICAgICB9KSArXG4gICAgICAgIGAgTCR7cGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMSkpICpcbiAgICAgICAgICAgIChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMSl9LCR7KGhlaWdodCAvIDQpICogMyArXG4gICAgICAgICAgcGFkZGluZ1RvcH0gTCR7cGFkZGluZ1JpZ2h0fSwkeyhoZWlnaHQgLyA0KSAqIDMgKyBwYWRkaW5nVG9wfSBaYDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFBhdGhcbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIGQ9e2R9XG4gICAgICAgICAgZmlsbD17YHVybCgjZmlsbFNoYWRvd0dyYWRpZW50JHtcbiAgICAgICAgICAgIHVzZUNvbG9yRnJvbURhdGFzZXQgPyBgXyR7aW5kZXh9YCA6IFwiXCJcbiAgICAgICAgICB9KWB9XG4gICAgICAgICAgc3Ryb2tlV2lkdGg9ezB9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuXG4gIHJlbmRlckxlZ2VuZCA9ICh3aWR0aCwgbGVnZW5kT2Zmc2V0KSA9PiB7XG4gICAgY29uc3QgeyBsZWdlbmQsIGRhdGFzZXRzIH0gPSB0aGlzLnByb3BzLmRhdGE7XG4gICAgY29uc3QgYmFzZUxlZ2VuZEl0ZW1YID0gd2lkdGggLyAobGVnZW5kLmxlbmd0aCArIDEpO1xuXG4gICAgcmV0dXJuIGxlZ2VuZC5tYXAoKGxlZ2VuZEl0ZW0sIGkpID0+IChcbiAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XG4gICAgICAgIDxMZWdlbmRJdGVtXG4gICAgICAgICAgaW5kZXg9e2l9XG4gICAgICAgICAgaWNvbkNvbG9yPXt0aGlzLmdldENvbG9yKGRhdGFzZXRzW2ldLCAwLjkpfVxuICAgICAgICAgIGJhc2VMZWdlbmRJdGVtWD17YmFzZUxlZ2VuZEl0ZW1YfVxuICAgICAgICAgIGxlZ2VuZFRleHQ9e2xlZ2VuZEl0ZW19XG4gICAgICAgICAgbGFiZWxQcm9wcz17eyAuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCkgfX1cbiAgICAgICAgICBsZWdlbmRPZmZzZXQ9e2xlZ2VuZE9mZnNldH1cbiAgICAgICAgLz5cbiAgICAgIDwvRz5cbiAgICApKTtcbiAgfTtcblxuICB0aW1lb3V0ID0gbnVsbDtcbiAgb25Ub3VjaEVuZCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy50aW1lb3V0KSBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUudG91Y2hNb3ZlWENvb3Jkcy5zZXRWYWx1ZSgtMSk7XG4gICAgICB0aGlzLnN0YXRlLnRvdWNoTW92ZVlDb29yZHMuc2V0VmFsdWUoLTEpO1xuICAgIH0sIDEwMDApO1xuICB9O1xuICBvblRvdWNoTW92ZSA9IGUgPT4ge1xuICAgIGlmICh0aGlzLnRpbWVvdXQpIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIHRoaXMuc3RhdGUudG91Y2hNb3ZlWENvb3Jkcy5zZXRWYWx1ZShlLm5hdGl2ZUV2ZW50LmxvY2F0aW9uWCk7XG4gICAgdGhpcy5zdGF0ZS50b3VjaE1vdmVZQ29vcmRzLnNldFZhbHVlKGUubmF0aXZlRXZlbnQubG9jYXRpb25ZKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBkYXRhLFxuICAgICAgd2l0aFNjcm9sbGFibGVEb3QgPSBmYWxzZSxcbiAgICAgIHdpdGhTaGFkb3cgPSB0cnVlLFxuICAgICAgd2l0aERvdHMgPSB0cnVlLFxuICAgICAgd2l0aElubmVyTGluZXMgPSB0cnVlLFxuICAgICAgd2l0aE91dGVyTGluZXMgPSB0cnVlLFxuICAgICAgd2l0aEhvcml6b250YWxMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoVmVydGljYWxMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoQ3VzdG9tWUF4aXMgPSBmYWxzZSxcbiAgICAgIHdpdGhIb3Jpem9udGFsTGFiZWxzID0gdHJ1ZSxcbiAgICAgIHdpdGhWZXJ0aWNhbExhYmVscyA9IHRydWUsXG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgZGVjb3JhdG9yLFxuICAgICAgb25EYXRhUG9pbnRDbGljayxcbiAgICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBmb3JtYXRZTGFiZWwgPSB5TGFiZWwgPT4geUxhYmVsLFxuICAgICAgZm9ybWF0WExhYmVsID0geExhYmVsID0+IHhMYWJlbCxcbiAgICAgIHNlZ21lbnRzLFxuICAgICAgdHJhbnNwYXJlbnQgPSBmYWxzZSxcbiAgICAgIGNoYXJ0Q29uZmlnLFxuICAgICAgc2hvd0RvdEluZm9PblRvdWNoXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbGFiZWxzID0gW10gfSA9IGRhdGE7XG4gICAgY29uc3Qge1xuICAgICAgYm9yZGVyUmFkaXVzID0gMCxcbiAgICAgIHBhZGRpbmdUb3AgPSAxNixcbiAgICAgIHBhZGRpbmdSaWdodCA9IDUwLFxuICAgICAgbWFyZ2luID0gMCxcbiAgICAgIG1hcmdpblJpZ2h0ID0gMCxcbiAgICAgIHBhZGRpbmdCb3R0b20gPSAwXG4gICAgfSA9IHN0eWxlO1xuXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24sXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvblxuICAgIH07XG5cbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YS5kYXRhc2V0cyk7XG5cbiAgICBsZXQgY291bnQgPVxuICAgICAgdGhpcy5wcm9wcy5jb3VudCB8fCAoTWF0aC5taW4oLi4uZGF0YXMpID09PSBNYXRoLm1heCguLi5kYXRhcykgPyAxIDogNCk7XG4gICAgaWYgKHNlZ21lbnRzKSB7XG4gICAgICBjb3VudCA9IHNlZ21lbnRzO1xuICAgIH1cblxuICAgIGNvbnN0IGxlZ2VuZE9mZnNldCA9IHRoaXMucHJvcHMuZGF0YS5sZWdlbmQgPyBoZWlnaHQgKiAwLjE1IDogMDtcbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXcgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgPFN2Z1xuICAgICAgICAgIGhlaWdodD17aGVpZ2h0ICsgKHBhZGRpbmdCb3R0b20gYXMgbnVtYmVyKSArIGxlZ2VuZE9mZnNldH1cbiAgICAgICAgICB3aWR0aD17d2lkdGggLSAobWFyZ2luIGFzIG51bWJlcikgKiAyIC0gKG1hcmdpblJpZ2h0IGFzIG51bWJlcikgKyAxNX1cbiAgICAgICAgICBvblRvdWNoTW92ZT17dGhpcy5vblRvdWNoTW92ZX1cbiAgICAgICAgICBvblRvdWNoRW5kPXt0aGlzLm9uVG91Y2hFbmR9XG4gICAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hNb3ZlfVxuICAgICAgICA+XG4gICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodCArIGxlZ2VuZE9mZnNldH1cbiAgICAgICAgICAgIHJ4PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICByeT17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgZmlsbD1cInVybCgjYmFja2dyb3VuZEdyYWRpZW50KVwiXG4gICAgICAgICAgICBmaWxsT3BhY2l0eT17dHJhbnNwYXJlbnQgPyAwIDogMX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmRhdGEubGVnZW5kICYmXG4gICAgICAgICAgICB0aGlzLnJlbmRlckxlZ2VuZChjb25maWcud2lkdGgsIGxlZ2VuZE9mZnNldCl9XG4gICAgICAgICAgPEcgeD1cIjBcIiB5PXtsZWdlbmRPZmZzZXR9PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyRGVmcyh7XG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgLi4uY2hhcnRDb25maWcsXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoSG9yaXpvbnRhbExpbmVzICYmXG4gICAgICAgICAgICAgICAgKHdpdGhJbm5lckxpbmVzXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVySG9yaXpvbnRhbExpbmVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IHdpdGhPdXRlckxpbmVzXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVySG9yaXpvbnRhbExpbmUoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgOiBudWxsKX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7d2l0aEhvcml6b250YWxMYWJlbHMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckhvcml6b250YWxMYWJlbHMoe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YXMsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIGZvcm1hdFlMYWJlbCxcbiAgICAgICAgICAgICAgICAgIGRlY2ltYWxQbGFjZXM6IGNoYXJ0Q29uZmlnLmRlY2ltYWxQbGFjZXMsXG4gICAgICAgICAgICAgICAgICBub0RlY2ltYWxzT25Ub3BBbmRCb3RWYWx1ZXM6IHRoaXMucHJvcHNcbiAgICAgICAgICAgICAgICAgICAgLm5vRGVjaW1hbHNPblRvcEFuZEJvdFZhbHVlc1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoQ3VzdG9tWUF4aXMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckN1c3RvbVlBeGlzKHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmN1c3RvbVhBeGlzTGVnZW5kICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJDdXN0b21YQXhpc0xlZ2VuZCh7XG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIGN1c3RvbVhBeGlzTGVnZW5kOiB0aGlzLnByb3BzLmN1c3RvbVhBeGlzTGVnZW5kXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhWZXJ0aWNhbExpbmVzICYmXG4gICAgICAgICAgICAgICAgKHdpdGhJbm5lckxpbmVzXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyVmVydGljYWxMaW5lcyh7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNbMF0uZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIDogd2l0aE91dGVyTGluZXNcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJWZXJ0aWNhbExpbmUoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIDogbnVsbCl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhWZXJ0aWNhbExhYmVscyAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVmVydGljYWxMYWJlbHMoe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgbGFiZWxzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBmb3JtYXRYTGFiZWxcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJMaW5lKHtcbiAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgLi4uY2hhcnRDb25maWcsXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhTaGFkb3cgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNoYWRvdyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICB1c2VDb2xvckZyb21EYXRhc2V0OiBjaGFydENvbmZpZy51c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhEb3RzICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJEb3RzKHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHMsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIG9uRGF0YVBvaW50Q2xpY2tcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7c2hvd0RvdEluZm9PblRvdWNoICYmIChcbiAgICAgICAgICAgICAgICA8QW5pbWF0ZWREb3RJbmZvR3JvdXBcbiAgICAgICAgICAgICAgICAgIHRvdWNoTW92ZVhDb29yZHM9e3RoaXMuc3RhdGUudG91Y2hNb3ZlWENvb3Jkc31cbiAgICAgICAgICAgICAgICAgIHRvdWNoTW92ZVlDb29yZHM9e3RoaXMuc3RhdGUudG91Y2hNb3ZlWUNvb3Jkc31cbiAgICAgICAgICAgICAgICAgIGdldERhdGFzPXt0aGlzLmdldERhdGFzfVxuICAgICAgICAgICAgICAgICAgY2FsY0Jhc2VIZWlnaHQ9e3RoaXMuY2FsY0Jhc2VIZWlnaHR9XG4gICAgICAgICAgICAgICAgICBmcm9tTnVtYmVyPXt0aGlzLnByb3BzLmZyb21OdW1iZXJ9XG4gICAgICAgICAgICAgICAgICBjYWxjSGVpZ2h0PXt0aGlzLmNhbGNIZWlnaHR9XG4gICAgICAgICAgICAgICAgICBsYWJlbEluVG9vbHRpcEZvcm1hdHRlcj17dGhpcy5wcm9wcy5sYWJlbEluVG9vbHRpcEZvcm1hdHRlcn1cbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A9e3BhZGRpbmdUb3B9XG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ9e3BhZGRpbmdSaWdodH1cbiAgICAgICAgICAgICAgICAgIGRvdEluZm9Nb2RhbFByb3BzPXt0aGlzLnByb3BzLmRvdEluZm9Nb2RhbFByb3BzfVxuICAgICAgICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICAgICAgICAgICAgdG9vbHRpcExhYmVscz17dGhpcy5wcm9wcy50b29sdGlwTGFiZWxzfVxuICAgICAgICAgICAgICAgICAgbGFiZWxzPXtsYWJlbHN9XG4gICAgICAgICAgICAgICAgICBkb3RzUmVuZGVyZWQ9e3RoaXMuZG90c1JlbmRlcmVkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhTY3JvbGxhYmxlRG90ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTY3JvbGxhYmxlRG90KHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgb25EYXRhUG9pbnRDbGljayxcbiAgICAgICAgICAgICAgICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge2RlY29yYXRvciAmJlxuICAgICAgICAgICAgICAgIGRlY29yYXRvcih7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgIDwvRz5cbiAgICAgICAgPC9Tdmc+XG4gICAgICAgIHt3aXRoU2Nyb2xsYWJsZURvdCAmJiAoXG4gICAgICAgICAgPFNjcm9sbFZpZXdcbiAgICAgICAgICAgIHN0eWxlPXtTdHlsZVNoZWV0LmFic29sdXRlRmlsbH1cbiAgICAgICAgICAgIGNvbnRlbnRDb250YWluZXJTdHlsZT17eyB3aWR0aDogd2lkdGggKiAyIH19XG4gICAgICAgICAgICBzaG93c0hvcml6b250YWxTY3JvbGxJbmRpY2F0b3I9e2ZhbHNlfVxuICAgICAgICAgICAgc2Nyb2xsRXZlbnRUaHJvdHRsZT17MTZ9XG4gICAgICAgICAgICBvblNjcm9sbD17QW5pbWF0ZWQuZXZlbnQoW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmF0aXZlRXZlbnQ6IHtcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnRPZmZzZXQ6IHsgeDogc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSl9XG4gICAgICAgICAgICBob3Jpem9udGFsXG4gICAgICAgICAgICBib3VuY2VzPXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGluZUNoYXJ0O1xuIl19
