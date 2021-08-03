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
import React, { Component } from "react";
import { Defs, Line, LinearGradient, Stop, Text } from "react-native-svg";
export var DEFAULT_X_LABELS_HEIGHT_PERCENTAGE = 0.75;
var AbstractChart = /** @class */ (function(_super) {
  __extends(AbstractChart, _super);
  function AbstractChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.calcScaler = function(data) {
      var _a = _this.props.chartConfig,
        fromNumber = _a.fromNumber,
        toNumber = _a.toNumber;
      if (_this.props.fromZero && fromNumber === undefined) {
        var minNumber = __spreadArrays(data, [0]);
        return Math.max.apply(Math, __spreadArrays(minNumber, [0])) - 1;
      } else if (fromNumber !== undefined) {
        return (
          Math.max.apply(Math, __spreadArrays(data, [toNumber])) - fromNumber
        );
      } else {
        return Math.max.apply(Math, data) - 1;
      }
    };
    _this.calcBaseHeight = function(data, height) {
      var _a = _this.props.chartConfig,
        fromNumber = _a.fromNumber,
        toNumber = _a.toNumber;
      var min =
        fromNumber !== undefined ? fromNumber : Math.min.apply(Math, data);
      var max = toNumber !== undefined ? toNumber : Math.max.apply(Math, data);
      if (min >= 0 && max >= 0) {
        return height;
      } else if (min < 0 && max <= 0) {
        return 0;
      } else if (min < 0 && max > 0) {
        return (height * max) / _this.calcScaler(data);
      }
    };
    _this.calcHeight = function(val, data, height) {
      var _a = _this.props.chartConfig,
        fromNumber = _a.fromNumber,
        toNumber = _a.toNumber;
      var max = toNumber !== undefined ? toNumber : Math.max.apply(Math, data);
      var min =
        fromNumber !== undefined ? fromNumber : Math.min.apply(Math, data);
      if (min < 0 && max > 0) {
        return height * (val / _this.calcScaler(data));
      } else if (min >= 0 && max >= 0) {
        return _this.props.fromZero
          ? height * (val / _this.calcScaler(data))
          : height * ((val - min) / _this.calcScaler(data));
      } else if (min < 0 && max <= 0) {
        return _this.props.fromZero
          ? height * (val / _this.calcScaler(data))
          : height * ((val - max) / _this.calcScaler(data));
      }
    };
    _this.renderCustomXAxisLegend = function(config) {
      var paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        customXAxisLegend = config.customXAxisLegend;
      return customXAxisLegend;
    };
    _this.renderCustomYAxis = function(config) {
      var height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        data = config.data;
      var _a = _this.props,
        yAxisIntervals = _a.yAxisIntervals,
        toNumber = _a.toNumber;
      return yAxisIntervals.map(function(interval, i) {
        var horizontalAlignment = paddingRight - 8;
        var datas = data.reduce(function(acc, item) {
          return item.data ? __spreadArrays(acc, item.data) : acc;
        }, []);
        var baseHeight = _this.calcBaseHeight(datas, height);
        var start =
          ((baseHeight - _this.calcHeight(interval.from, datas, height)) / 4) *
            3 +
          paddingTop;
        var isLastInterval = i === yAxisIntervals.length - 1;
        var endValue = isLastInterval
          ? Math.max.apply(Math, __spreadArrays(datas, [interval.to || 0]))
          : interval.to;
        var end =
          ((baseHeight - _this.calcHeight(endValue, datas, height)) / 4) * 3 +
          paddingTop;
        var fromNumber = _this.props.chartConfig.fromNumber;
        var maxGraphHeight =
          ((baseHeight -
            _this.calcHeight(
              fromNumber !== undefined
                ? fromNumber
                : Math.min.apply(Math, datas),
              datas,
              height
            )) /
            4) *
            3 +
          paddingTop;
        return (
          <Line
            key={Math.random()}
            x1={horizontalAlignment}
            y1={Math.max(Math.min(start, maxGraphHeight), paddingTop) || 0}
            x2={horizontalAlignment}
            y2={Math.max(Math.min(end, maxGraphHeight), paddingTop) || 0}
            stroke={interval.color}
            {...(_this.props.yAxisLineProps || {})}
          />
        );
      });
    };
    _this.renderHorizontalLines = function(config) {
      var count = config.count,
        width = config.width,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _a === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _a;
      var basePosition = height * verticalLabelsHeightPercentage;
      return __spreadArrays(new Array((_this.props.count || count) + 1)).map(
        function(_, i) {
          var y =
            (basePosition / (_this.props.count || count)) * i + paddingTop;
          return (
            <Line
              key={Math.random()}
              x1={paddingRight - (_this.props.smallPaddingRight ? 8 : 0)}
              y1={y}
              x2={width}
              y2={y}
              {..._this.getPropsForBackgroundLines()}
            />
          );
        }
      );
    };
    _this.renderHorizontalLine = function(config) {
      var width = config.width,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _a === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _a;
      return (
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height * verticalLabelsHeightPercentage + paddingTop}
          x2={width}
          y2={height * verticalLabelsHeightPercentage + paddingTop}
          {..._this.getPropsForBackgroundLines()}
        />
      );
    };
    _this.renderHorizontalLabels = function(config) {
      var count = config.count,
        data = config.data,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.horizontalLabelRotation,
        horizontalLabelRotation = _a === void 0 ? 0 : _a,
        _b = config.decimalPlaces,
        decimalPlaces = _b === void 0 ? 2 : _b,
        _c = config.formatYLabel,
        formatYLabel =
          _c === void 0
            ? function(yLabel) {
                return yLabel;
              }
            : _c,
        _d = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _d === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _d,
        noDecimalsOnTopAndBotValues = config.noDecimalsOnTopAndBotValues;
      var _e = _this.props,
        _f = _e.yAxisLabel,
        yAxisLabel = _f === void 0 ? "" : _f,
        _g = _e.yAxisSuffix,
        yAxisSuffix = _g === void 0 ? "" : _g,
        _h = _e.yLabelsOffset,
        yLabelsOffset = _h === void 0 ? 12 : _h;
      return new Array(
        (_this.props.count || count) === 1
          ? 1
          : (_this.props.count || count) + 1
      )
        .fill(1)
        .map(function(_, i) {
          var _a;
          var yLabel = String(i * count);
          var newDecimalPlaces = decimalPlaces;
          if (
            _this.props.noDecimalsOnTopAndBotValues &&
            (i === 0 ||
              i ===
                new Array(
                  (_this.props.count || count) === 1
                    ? 1
                    : (_this.props.count || count) + 1
                ).length -
                  1)
          ) {
            newDecimalPlaces = 0;
          }
          var _b = _this.props.chartConfig,
            fromNumber = _b.fromNumber,
            toNumber = _b.toNumber;
          if ((_this.props.count || count) === 1) {
            yLabel =
              "" +
              yAxisLabel +
              formatYLabel(
                //@ts-ignore
                ((_a = data[0]) === null || _a === void 0
                ? void 0
                : _a.toFixed)
                  ? data[0].toFixed(newDecimalPlaces)
                  : data[0]
              ) +
              yAxisSuffix;
          } else {
            var label = _this.props.fromZero
              ? (_this.calcScaler(data) / (_this.props.count || count)) * i +
                (fromNumber !== undefined
                  ? fromNumber
                  : Math.min.apply(Math, __spreadArrays(data, [0])))
              : (_this.calcScaler(data) / (_this.props.count || count)) * i +
                (fromNumber !== undefined
                  ? fromNumber
                  : Math.min.apply(Math, data));
            yLabel =
              "" +
              yAxisLabel +
              formatYLabel(label.toFixed(newDecimalPlaces)) +
              yAxisSuffix;
          }
          var basePosition = height * verticalLabelsHeightPercentage;
          var x = paddingRight - yLabelsOffset + 3;
          var y =
            count === 1 && _this.props.fromZero
              ? paddingTop + 4
              : height * verticalLabelsHeightPercentage -
                (basePosition / (_this.props.count || count)) * i +
                paddingTop;
          return (
            <Text
              rotation={horizontalLabelRotation}
              origin={x + ", " + y}
              key={Math.random()}
              x={x}
              textAnchor="end"
              y={y}
              {..._this.getPropsForLabels()}
              {..._this.getPropsForHorizontalLabels()}
            >
              {yLabel}
            </Text>
          );
        });
    };
    _this.renderYUnitsLabel = function(config) {
      var count = config.count,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _a === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _a;
      var _b = _this.props,
        yAxisUnitLabel = _b.yAxisUnitLabel,
        _c = _b.yLabelsOffset,
        yLabelsOffset = _c === void 0 ? 12 : _c;
      var x = paddingRight - yLabelsOffset + 3;
      var y =
        count === 1 && _this.props.fromZero
          ? paddingTop + 4
          : height * verticalLabelsHeightPercentage + paddingTop;
      return yAxisUnitLabel ? (
        <Text
          origin={x + ", " + y}
          x={x}
          textAnchor="middle"
          y={0}
          {..._this.getPropsForLabels()}
          {..._this.getPropsForHorizontalLabels()}
        >
          {yAxisUnitLabel}
        </Text>
      ) : null;
    };
    _this.renderVerticalLabels = function(_a) {
      var _b = _a.labels,
        labels = _b === void 0 ? [] : _b,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        _c = _a.horizontalOffset,
        horizontalOffset = _c === void 0 ? 0 : _c,
        _d = _a.stackedBar,
        stackedBar = _d === void 0 ? false : _d,
        _e = _a.verticalLabelRotation,
        verticalLabelRotation = _e === void 0 ? 0 : _e,
        _f = _a.formatXLabel,
        formatXLabel =
          _f === void 0
            ? function(xLabel) {
                return xLabel;
              }
            : _f,
        _g = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _g === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _g,
        // @ts-ignore
        _h = _a.isBarChart,
        // @ts-ignore
        isBarChart = _h === void 0 ? false : _h;
      var _j = _this.props,
        _k = _j.xAxisLabel,
        xAxisLabel = _k === void 0 ? "" : _k,
        _l = _j.xLabelsOffset,
        xLabelsOffset = _l === void 0 ? 0 : _l,
        _m = _j.hidePointsAtIndex,
        hidePointsAtIndex = _m === void 0 ? [] : _m;
      var fontSize = 12;
      var fac = 1;
      if (stackedBar) {
        fac = 0.71;
      }
      return labels.map(function(label, i) {
        //if (hidePointsAtIndex.includes(i)) {
        //  return null;
        //}
        var x =
          (((width - paddingRight - 8) /
            (labels.length - (isBarChart ? 0 : 1))) *
            i *
            (isBarChart ? 1.013 : 1) +
            paddingRight +
            horizontalOffset) *
          fac;
        var y =
          height * verticalLabelsHeightPercentage +
          paddingTop +
          fontSize * 2 +
          xLabelsOffset;
        return (
          <Text
            origin={x + ", " + y}
            rotation={verticalLabelRotation}
            key={Math.random()}
            x={x}
            y={y}
            textAnchor={verticalLabelRotation === 0 ? "middle" : "start"}
            {..._this.getPropsForLabels()}
            {..._this.getPropsForVerticalLabels()}
          >
            {"" + formatXLabel(label) + xAxisLabel}
          </Text>
        );
      });
    };
    _this.renderVerticalLines = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        _b = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _b === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _b;
      var _c = _this.props.yAxisInterval,
        yAxisInterval = _c === void 0 ? 1 : _c;
      return __spreadArrays(
        new Array(Math.ceil(data.length / yAxisInterval))
      ).map(function(_, i) {
        return (
          <Line
            key={Math.random()}
            x1={Math.floor(
              ((width - paddingRight) / (data.length / yAxisInterval)) * i +
                paddingRight
            )}
            y1={0}
            x2={Math.floor(
              ((width - paddingRight) / (data.length / yAxisInterval)) * i +
                paddingRight
            )}
            y2={height * verticalLabelsHeightPercentage + paddingTop}
            {..._this.getPropsForBackgroundLines()}
          />
        );
      });
    };
    _this.renderVerticalLine = function(_a) {
      var height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        _b = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _b === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _b;
      return (
        <Line
          key={Math.random()}
          x1={Math.floor(paddingRight)}
          y1={0}
          x2={Math.floor(paddingRight)}
          y2={height * verticalLabelsHeightPercentage + paddingTop}
          {..._this.getPropsForBackgroundLines()}
        />
      );
    };
    _this.renderDefs = function(config) {
      var width = config.width,
        height = config.height,
        backgroundGradientFrom = config.backgroundGradientFrom,
        backgroundGradientTo = config.backgroundGradientTo,
        useShadowColorFromDataset = config.useShadowColorFromDataset,
        data = config.data;
      var fromOpacity = config.hasOwnProperty("backgroundGradientFromOpacity")
        ? config.backgroundGradientFromOpacity
        : 1.0;
      var toOpacity = config.hasOwnProperty("backgroundGradientToOpacity")
        ? config.backgroundGradientToOpacity
        : 1.0;
      var fillShadowGradient = config.hasOwnProperty("fillShadowGradient")
        ? config.fillShadowGradient
        : _this.props.chartConfig.color(1.0);
      var fillShadowGradientOpacity = config.hasOwnProperty(
        "fillShadowGradientOpacity"
      )
        ? config.fillShadowGradientOpacity
        : 0.1;
      return (
        <Defs>
          <LinearGradient
            id="backgroundGradient"
            x1={0}
            y1={height}
            x2={width}
            y2={0}
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0"
              stopColor={backgroundGradientFrom}
              stopOpacity={fromOpacity}
            />
            <Stop
              offset="1"
              stopColor={backgroundGradientTo}
              stopOpacity={toOpacity}
            />
          </LinearGradient>
          {useShadowColorFromDataset ? (
            data.map(function(dataset, index) {
              return (
                <LinearGradient
                  id={"fillShadowGradient_" + index}
                  key={"" + index}
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={height}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop
                    offset="0"
                    stopColor={
                      dataset.color ? dataset.color(1.0) : fillShadowGradient
                    }
                    stopOpacity={fillShadowGradientOpacity}
                  />
                  <Stop
                    offset="1"
                    stopColor={
                      dataset.color
                        ? dataset.color(fillShadowGradientOpacity)
                        : fillShadowGradient
                    }
                    stopOpacity="0"
                  />
                </LinearGradient>
              );
            })
          ) : (
            <LinearGradient
              id="fillShadowGradient"
              x1={0}
              y1={0}
              x2={0}
              y2={height}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={fillShadowGradient}
                stopOpacity={fillShadowGradientOpacity}
              />
              <Stop offset="1" stopColor={fillShadowGradient} stopOpacity="0" />
            </LinearGradient>
          )}
        </Defs>
      );
    };
    return _this;
  }
  AbstractChart.prototype.getPropsForBackgroundLines = function() {
    var _a = this.props.chartConfig.propsForBackgroundLines,
      propsForBackgroundLines = _a === void 0 ? {} : _a;
    return __assign(
      {
        stroke: this.props.chartConfig.color(0.2),
        strokeDasharray: "5, 10",
        strokeWidth: 1
      },
      propsForBackgroundLines
    );
  };
  AbstractChart.prototype.getPropsForLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForLabels,
      propsForLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fontSize: 12, fill: labelColor(0.8) }, propsForLabels);
  };
  AbstractChart.prototype.getPropsForVerticalLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForVerticalLabels,
      propsForVerticalLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fill: labelColor(0.8) }, propsForVerticalLabels);
  };
  AbstractChart.prototype.getPropsForHorizontalLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForHorizontalLabels,
      propsForHorizontalLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fill: labelColor(0.8) }, propsForHorizontalLabels);
  };
  return AbstractChart;
})(Component);
export default AbstractChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWJzdHJhY3RDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BYnN0cmFjdENoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQWdEMUUsTUFBTSxDQUFDLElBQU0sa0NBQWtDLEdBQUcsSUFBSSxDQUFDO0FBRXZEO0lBR1UsaUNBQW1FO0lBSDdFO1FBQUEscUVBaWpCQztRQTdpQkMsZ0JBQVUsR0FBRyxVQUFDLElBQWM7WUFDcEIsSUFBQSxLQUEyQixLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBL0MsVUFBVSxnQkFBQSxFQUFFLFFBQVEsY0FBMkIsQ0FBQztZQUN4RCxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQ25ELElBQU0sU0FBUyxrQkFBaUIsSUFBSSxHQUFFLENBQUMsRUFBQyxDQUFDO2dCQUN6QyxPQUFPLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxTQUFTLEdBQUUsQ0FBQyxNQUFJLENBQUMsQ0FBQzthQUN0QztpQkFBTSxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQ25DLE9BQU8sSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxRQUFRLE1BQUksVUFBVSxDQUFDO2FBQ2pEO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQzthQUM5QjtRQUNILENBQUMsQ0FBQztRQUVGLG9CQUFjLEdBQUcsVUFBQyxJQUFjLEVBQUUsTUFBYztZQUN4QyxJ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S0FJRixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFIeEIsc0JBQW1CLEVBQW5CLGNBQWMsbUJBQUcsRUFBRSxLQUFBLEVBQ25CLEtBQUssV0FBQSxFQUNMLGtCQUFrQixFQUFsQixVQUFVLG1CQUFHLEtBQUssS0FDTSxDQUFDO1FBQzNCLGtCQUNFLFFBQVEsRUFBRSxFQUFFLEVBQ1osSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFDbEIsY0FBYyxFQUNqQjtJQUNKLENBQUM7SUFFRCxpREFBeUIsR0FBekI7UUFDUSxJQUFBLEtBSUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBSHhCLDhCQUEyQixFQUEzQixzQkFBc0IsbUJBQUcsRUFBRSxLQUFBLEVBQzNCLEtBQUssV0FBQSxFQUNMLGtCQUFrQixFQUFsQixVQUFVLG1CQUFHLEtBQUssS0FDTSxDQUFDO1FBQzNCLGtCQUNFLElBQUksRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLElBQ2xCLHNCQUFzQixFQUN6QjtJQUNKLENBQUM7SUFFRCxtREFBMkIsR0FBM0I7UUFDUSxJQUFBLEtBSUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBSHhCLGdDQUE2QixFQUE3Qix3QkFBd0IsbUJBQUcsRUFBRSxLQUFBLEVBQzdCLEtBQUssV0FBQSxFQUNMLGtCQUFrQixFQUFsQixVQUFVLG1CQUFHLEtBQUssS0FDTSxDQUFDO1FBQzNCLGtCQUNFLElBQUksRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLElBQ2xCLHdCQUF3QixFQUMzQjtJQUNKLENBQUM7SUFzZEgsb0JBQUM7QUFBRCxDQUFDLEFBampCRCxDQUdVLFNBQVMsR0E4aUJsQjtBQUVELGVBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgRGVmcywgTGluZSwgTGluZWFyR3JhZGllbnQsIFN0b3AsIFRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgeyBDaGFydENvbmZpZywgRGF0YXNldCwgUGFydGlhbEJ5IH0gZnJvbSBcIi4vSGVscGVyVHlwZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBmcm9tWmVybz86IGJvb2xlYW47XG4gIGNoYXJ0Q29uZmlnPzogQWJzdHJhY3RDaGFydENvbmZpZztcbiAgeUF4aXNMYWJlbD86IHN0cmluZztcbiAgeUF4aXNTdWZmaXg/OiBzdHJpbmc7XG4gIHlMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIHlBeGlzSW50ZXJ2YWw/OiBudW1iZXI7XG4gIHhBeGlzTGFiZWw/OiBzdHJpbmc7XG4gIHhMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIGhpZGVQb2ludHNBdEluZGV4PzogbnVtYmVyW107XG4gIGN1c3RvbVlBeGlzPzogYm9vbGVhbjtcbiAgeUF4aXNMaW5lUHJvcHM/OiBvYmplY3Q7XG4gIHNtYWxsUGFkZGluZ1JpZ2h0PzogYm9vbGVhbjtcbiAgeUF4aXNJbnRlcnZhbHM/OiB7IGNvbG9yOiBzdHJpbmc7IHRvOiBudW1iZXI7IGZyb206IG51bWJlciB9W107XG4gIG5vRGVjaW1hbHNPblRvcEFuZEJvdFZhbHVlcz86IGJvb2xlYW47XG4gIHlBeGlzVW5pdExhYmVsPzogc3RyaW5nO1xuICBib3RBbmRUb3BWYWx1ZXM/OiB7IHRvcDogbnVtYmVyOyBib3R0b206IG51bWJlciB9IHwgbnVsbDtcbiAgY291bnQ/OiBudW1iZXI7XG4gIGZyb21OdW1iZXI/OiBudW1iZXI7XG4gIHRvTnVtYmVyPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFic3RyYWN0Q2hhcnRDb25maWcgZXh0ZW5kcyBDaGFydENvbmZpZyB7XG4gIGNvdW50PzogbnVtYmVyO1xuICBkYXRhPzogRGF0YXNldFtdO1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBwYWRkaW5nVG9wPzogbnVtYmVyO1xuICBwYWRkaW5nUmlnaHQ/OiBudW1iZXI7XG4gIGhvcml6b250YWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICBmb3JtYXRZTGFiZWw/OiAoeUxhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIGhvcml6b250YWxPZmZzZXQ/OiBudW1iZXI7XG4gIHN0YWNrZWRCYXI/OiBib29sZWFuO1xuICB2ZXJ0aWNhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XG4gIGZvcm1hdFhMYWJlbD86ICh4TGFiZWw6IHN0cmluZykgPT4gc3RyaW5nO1xuICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2U/OiBudW1iZXI7XG4gIG5vRGVjaW1hbHNPblRvcEFuZEJvdFZhbHVlcz86IGJvb2xlYW47XG4gIGZyb21OdW1iZXI/OiBudW1iZXI7XG4gIHRvTnVtYmVyPzogbnVtYmVyO1xufVxuXG5leHBvcnQgdHlwZSBBYnN0cmFjdENoYXJ0U3RhdGUgPSB7fTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0UgPSAwLjc1O1xuXG5jbGFzcyBBYnN0cmFjdENoYXJ0PFxuICBJUHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMsXG4gIElTdGF0ZSBleHRlbmRzIEFic3RyYWN0Q2hhcnRTdGF0ZVxuPiBleHRlbmRzIENvbXBvbmVudDxBYnN0cmFjdENoYXJ0UHJvcHMgJiBJUHJvcHMsIEFic3RyYWN0Q2hhcnRTdGF0ZSAmIElTdGF0ZT4ge1xuICBjYWxjU2NhbGVyID0gKGRhdGE6IG51bWJlcltdKSA9PiB7XG4gICAgY29uc3QgeyBmcm9tTnVtYmVyLCB0b051bWJlciB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICBpZiAodGhpcy5wcm9wcy5mcm9tWmVybyAmJiBmcm9tTnVtYmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IG1pbk51bWJlcjogbnVtYmVyW10gPSBbLi4uZGF0YSwgMF07XG4gICAgICByZXR1cm4gTWF0aC5tYXgoLi4ubWluTnVtYmVyLCAwKSAtIDE7XG4gICAgfSBlbHNlIGlmIChmcm9tTnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCguLi5kYXRhLCB0b051bWJlcikgLSBmcm9tTnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoLi4uZGF0YSkgLSAxO1xuICAgIH1cbiAgfTtcblxuICBjYWxjQmFzZUhlaWdodCA9IChkYXRhOiBudW1iZXJbXSwgaGVpZ2h0OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCB7IGZyb21OdW1iZXIsIHRvTnVtYmVyIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIGNvbnN0IG1pbiA9IGZyb21OdW1iZXIgIT09IHVuZGVmaW5lZCA/IGZyb21OdW1iZXIgOiBNYXRoLm1pbiguLi5kYXRhKTtcbiAgICBjb25zdCBtYXggPSB0b051bWJlciAhPT0gdW5kZWZpbmVkID8gdG9OdW1iZXIgOiBNYXRoLm1heCguLi5kYXRhKTtcbiAgICBpZiAobWluID49IDAgJiYgbWF4ID49IDApIHtcbiAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA8PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2UgaWYgKG1pbiA8IDAgJiYgbWF4ID4gMCkge1xuICAgICAgcmV0dXJuIChoZWlnaHQgKiBtYXgpIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpO1xuICAgIH1cbiAgfTtcblxuICBjYWxjSGVpZ2h0ID0gKHZhbDogbnVtYmVyLCBkYXRhOiBudW1iZXJbXSwgaGVpZ2h0OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCB7IGZyb21OdW1iZXIsIHRvTnVtYmVyIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIGNvbnN0IG1heCA9IHRvTnVtYmVyICE9PSB1bmRlZmluZWQgPyB0b051bWJlciA6IE1hdGgubWF4KC4uLmRhdGEpO1xuICAgIGNvbnN0IG1pbiA9IGZyb21OdW1iZXIgIT09IHVuZGVmaW5lZCA/IGZyb21OdW1iZXIgOiBNYXRoLm1pbiguLi5kYXRhKTtcbiAgICBpZiAobWluIDwgMCAmJiBtYXggPiAwKSB7XG4gICAgICByZXR1cm4gaGVpZ2h0ICogKHZhbCAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSk7XG4gICAgfSBlbHNlIGlmIChtaW4gPj0gMCAmJiBtYXggPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgPyBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKVxuICAgICAgICA6IGhlaWdodCAqICgodmFsIC0gbWluKSAvIHRoaXMuY2FsY1NjYWxlcihkYXRhKSk7XG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA8PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5mcm9tWmVyb1xuICAgICAgICA/IGhlaWdodCAqICh2YWwgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpXG4gICAgICAgIDogaGVpZ2h0ICogKCh2YWwgLSBtYXgpIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKTtcbiAgICB9XG4gIH07XG5cbiAgZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKSB7XG4gICAgY29uc3QgeyBwcm9wc0ZvckJhY2tncm91bmRMaW5lcyA9IHt9IH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiB7XG4gICAgICBzdHJva2U6IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoMC4yKSxcbiAgICAgIHN0cm9rZURhc2hhcnJheTogXCI1LCAxMFwiLFxuICAgICAgc3Ryb2tlV2lkdGg6IDEsXG4gICAgICAuLi5wcm9wc0ZvckJhY2tncm91bmRMaW5lc1xuICAgIH07XG4gIH1cblxuICBnZXRQcm9wc0ZvckxhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0ZvckxhYmVscyA9IHt9LFxuICAgICAgY29sb3IsXG4gICAgICBsYWJlbENvbG9yID0gY29sb3JcbiAgICB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4ge1xuICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgZmlsbDogbGFiZWxDb2xvcigwLjgpLFxuICAgICAgLi4ucHJvcHNGb3JMYWJlbHNcbiAgICB9O1xuICB9XG5cbiAgZ2V0UHJvcHNGb3JWZXJ0aWNhbExhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0ZvclZlcnRpY2FsTGFiZWxzID0ge30sXG4gICAgICBjb2xvcixcbiAgICAgIGxhYmVsQ29sb3IgPSBjb2xvclxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiB7XG4gICAgICBmaWxsOiBsYWJlbENvbG9yKDAuOCksXG4gICAgICAuLi5wcm9wc0ZvclZlcnRpY2FsTGFiZWxzXG4gICAgfTtcbiAgfVxuXG4gIGdldFByb3BzRm9ySG9yaXpvbnRhbExhYmVscygpIHtcbiAgICBjb25zdCB7XG4gICAgICBwcm9wc0Zvckhvcml6b250YWxMYWJlbHMgPSB7fSxcbiAgICAgIGNvbG9yLFxuICAgICAgbGFiZWxDb2xvciA9IGNvbG9yXG4gICAgfSA9IHRoaXMucHJvcHMuY2hhcnRDb25maWc7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGw6IGxhYmVsQ29sb3IoMC44KSxcbiAgICAgIC4uLnByb3BzRm9ySG9yaXpvbnRhbExhYmVsc1xuICAgIH07XG4gIH1cblxuICByZW5kZXJDdXN0b21YQXhpc0xlZ2VuZCA9IChjb25maWc6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgcGFkZGluZ1RvcCwgcGFkZGluZ1JpZ2h0LCBjdXN0b21YQXhpc0xlZ2VuZCB9ID0gY29uZmlnO1xuICAgIHJldHVybiBjdXN0b21YQXhpc0xlZ2VuZDtcbiAgfTtcblxuICByZW5kZXJDdXN0b21ZQXhpcyA9IChjb25maWc6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgaGVpZ2h0LCBwYWRkaW5nVG9wLCBwYWRkaW5nUmlnaHQsIGRhdGEgfSA9IGNvbmZpZztcblxuICAgIGNvbnN0IHsgeUF4aXNJbnRlcnZhbHMsIHRvTnVtYmVyIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiB5QXhpc0ludGVydmFscy5tYXAoKGludGVydmFsLCBpKSA9PiB7XG4gICAgICBjb25zdCBob3Jpem9udGFsQWxpZ25tZW50ID0gcGFkZGluZ1JpZ2h0IC0gODtcblxuICAgICAgY29uc3QgZGF0YXMgPSBkYXRhLnJlZHVjZShcbiAgICAgICAgKGFjYywgaXRlbSkgPT4gKGl0ZW0uZGF0YSA/IFsuLi5hY2MsIC4uLml0ZW0uZGF0YV0gOiBhY2MpLFxuICAgICAgICBbXVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuICAgICAgbGV0IHN0YXJ0ID1cbiAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KGludGVydmFsLmZyb20sIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXG4gICAgICAgIHBhZGRpbmdUb3A7XG5cbiAgICAgIGNvbnN0IGlzTGFzdEludGVydmFsID0gaSA9PT0geUF4aXNJbnRlcnZhbHMubGVuZ3RoIC0gMTtcblxuICAgICAgY29uc3QgZW5kVmFsdWUgPSBpc0xhc3RJbnRlcnZhbFxuICAgICAgICA/IE1hdGgubWF4KC4uLlsuLi5kYXRhcywgaW50ZXJ2YWwudG8gfHwgMF0pXG4gICAgICAgIDogaW50ZXJ2YWwudG87XG4gICAgICBjb25zdCBlbmQgPVxuICAgICAgICAoKGJhc2VIZWlnaHQgLSB0aGlzLmNhbGNIZWlnaHQoZW5kVmFsdWUsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXG4gICAgICAgIHBhZGRpbmdUb3A7XG4gICAgICBjb25zdCB7IGZyb21OdW1iZXIgfSA9IHRoaXMucHJvcHMuY2hhcnRDb25maWc7XG5cbiAgICAgIGNvbnN0IG1heEdyYXBoSGVpZ2h0ID1cbiAgICAgICAgKChiYXNlSGVpZ2h0IC1cbiAgICAgICAgICB0aGlzLmNhbGNIZWlnaHQoXG4gICAgICAgICAgICBmcm9tTnVtYmVyICE9PSB1bmRlZmluZWQgPyBmcm9tTnVtYmVyIDogTWF0aC5taW4oLi4uZGF0YXMpLFxuICAgICAgICAgICAgZGF0YXMsXG4gICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICApKSAvXG4gICAgICAgICAgNCkgKlxuICAgICAgICAgIDMgK1xuICAgICAgICBwYWRkaW5nVG9wO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPExpbmVcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgeDE9e2hvcml6b250YWxBbGlnbm1lbnR9XG4gICAgICAgICAgeTE9e01hdGgubWF4KE1hdGgubWluKHN0YXJ0LCBtYXhHcmFwaEhlaWdodCksIHBhZGRpbmdUb3ApIHx8IDB9XG4gICAgICAgICAgeDI9e2hvcml6b250YWxBbGlnbm1lbnR9XG4gICAgICAgICAgeTI9e01hdGgubWF4KE1hdGgubWluKGVuZCwgbWF4R3JhcGhIZWlnaHQpLCBwYWRkaW5nVG9wKSB8fCAwfVxuICAgICAgICAgIHN0cm9rZT17aW50ZXJ2YWwuY29sb3J9XG4gICAgICAgICAgey4uLih0aGlzLnByb3BzLnlBeGlzTGluZVByb3BzIHx8IHt9KX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVySG9yaXpvbnRhbExpbmVzID0gY29uZmlnID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBjb3VudCxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcGFkZGluZ1RvcCxcbiAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgICB9ID0gY29uZmlnO1xuICAgIGNvbnN0IGJhc2VQb3NpdGlvbiA9IGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZTtcbiAgICByZXR1cm4gWy4uLm5ldyBBcnJheSgodGhpcy5wcm9wcy5jb3VudCB8fCBjb3VudCkgKyAxKV0ubWFwKChfLCBpKSA9PiB7XG4gICAgICBjb25zdCB5ID0gKGJhc2VQb3NpdGlvbiAvICh0aGlzLnByb3BzLmNvdW50IHx8IGNvdW50KSkgKiBpICsgcGFkZGluZ1RvcDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxMaW5lXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHgxPXtwYWRkaW5nUmlnaHQgLSAodGhpcy5wcm9wcy5zbWFsbFBhZGRpbmdSaWdodCA/IDggOiAwKX1cbiAgICAgICAgICB5MT17eX1cbiAgICAgICAgICB4Mj17d2lkdGh9XG4gICAgICAgICAgeTI9e3l9XG4gICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVySG9yaXpvbnRhbExpbmUgPSBjb25maWcgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcGFkZGluZ1RvcCxcbiAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgICB9ID0gY29uZmlnO1xuICAgIHJldHVybiAoXG4gICAgICA8TGluZVxuICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgIHgxPXtwYWRkaW5nUmlnaHR9XG4gICAgICAgIHkxPXtoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgKyBwYWRkaW5nVG9wfVxuICAgICAgICB4Mj17d2lkdGh9XG4gICAgICAgIHkyPXtoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgKyBwYWRkaW5nVG9wfVxuICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpfVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIHJlbmRlckhvcml6b250YWxMYWJlbHMgPSAoXG4gICAgY29uZmlnOiBPbWl0PEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPiAmIHsgZGF0YTogbnVtYmVyW10gfVxuICApID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBjb3VudCxcbiAgICAgIGRhdGEsXG4gICAgICBoZWlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24gPSAwLFxuICAgICAgZGVjaW1hbFBsYWNlcyA9IDIsXG4gICAgICBmb3JtYXRZTGFiZWwgPSAoeUxhYmVsOiBzdHJpbmcpID0+IHlMYWJlbCxcbiAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0UsXG4gICAgICBub0RlY2ltYWxzT25Ub3BBbmRCb3RWYWx1ZXNcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3Qge1xuICAgICAgeUF4aXNMYWJlbCA9IFwiXCIsXG4gICAgICB5QXhpc1N1ZmZpeCA9IFwiXCIsXG4gICAgICB5TGFiZWxzT2Zmc2V0ID0gMTJcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gbmV3IEFycmF5KFxuICAgICAgKHRoaXMucHJvcHMuY291bnQgfHwgY291bnQpID09PSAxID8gMSA6ICh0aGlzLnByb3BzLmNvdW50IHx8IGNvdW50KSArIDFcbiAgICApXG4gICAgICAuZmlsbCgxKVxuICAgICAgLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICBsZXQgeUxhYmVsID0gU3RyaW5nKGkgKiBjb3VudCk7XG4gICAgICAgIGxldCBuZXdEZWNpbWFsUGxhY2VzID0gZGVjaW1hbFBsYWNlcztcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMucHJvcHMubm9EZWNpbWFsc09uVG9wQW5kQm90VmFsdWVzICYmXG4gICAgICAgICAgKGkgPT09IDAgfHxcbiAgICAgICAgICAgIGkgPT09XG4gICAgICAgICAgICAgIG5ldyBBcnJheShcbiAgICAgICAgICAgICAgICAodGhpcy5wcm9wcy5jb3VudCB8fCBjb3VudCkgPT09IDFcbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiAodGhpcy5wcm9wcy5jb3VudCB8fCBjb3VudCkgKyAxXG4gICAgICAgICAgICAgICkubGVuZ3RoIC1cbiAgICAgICAgICAgICAgICAxKVxuICAgICAgICApIHtcbiAgICAgICAgICBuZXdEZWNpbWFsUGxhY2VzID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGZyb21OdW1iZXIsIHRvTnVtYmVyIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuXG4gICAgICAgIGlmICgodGhpcy5wcm9wcy5jb3VudCB8fCBjb3VudCkgPT09IDEpIHtcbiAgICAgICAgICB5TGFiZWwgPSBgJHt5QXhpc0xhYmVsfSR7Zm9ybWF0WUxhYmVsKFxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBkYXRhWzBdPy50b0ZpeGVkID8gZGF0YVswXS50b0ZpeGVkKG5ld0RlY2ltYWxQbGFjZXMpIDogZGF0YVswXVxuICAgICAgICAgICl9JHt5QXhpc1N1ZmZpeH1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5wcm9wcy5mcm9tWmVyb1xuICAgICAgICAgICAgPyAodGhpcy5jYWxjU2NhbGVyKGRhdGEpIC8gKHRoaXMucHJvcHMuY291bnQgfHwgY291bnQpKSAqIGkgK1xuICAgICAgICAgICAgICAoZnJvbU51bWJlciAhPT0gdW5kZWZpbmVkID8gZnJvbU51bWJlciA6IE1hdGgubWluKC4uLmRhdGEsIDApKVxuICAgICAgICAgICAgOiAodGhpcy5jYWxjU2NhbGVyKGRhdGEpIC8gKHRoaXMucHJvcHMuY291bnQgfHwgY291bnQpKSAqIGkgK1xuICAgICAgICAgICAgICAoZnJvbU51bWJlciAhPT0gdW5kZWZpbmVkID8gZnJvbU51bWJlciA6IE1hdGgubWluKC4uLmRhdGEpKTtcbiAgICAgICAgICB5TGFiZWwgPSBgJHt5QXhpc0xhYmVsfSR7Zm9ybWF0WUxhYmVsKFxuICAgICAgICAgICAgbGFiZWwudG9GaXhlZChuZXdEZWNpbWFsUGxhY2VzKVxuICAgICAgICAgICl9JHt5QXhpc1N1ZmZpeH1gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmFzZVBvc2l0aW9uID0gaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlO1xuICAgICAgICBjb25zdCB4ID0gcGFkZGluZ1JpZ2h0IC0geUxhYmVsc09mZnNldCArIDM7XG4gICAgICAgIGNvbnN0IHkgPVxuICAgICAgICAgIGNvdW50ID09PSAxICYmIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgICAgID8gcGFkZGluZ1RvcCArIDRcbiAgICAgICAgICAgIDogaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlIC1cbiAgICAgICAgICAgICAgKGJhc2VQb3NpdGlvbiAvICh0aGlzLnByb3BzLmNvdW50IHx8IGNvdW50KSkgKiBpICtcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxUZXh0XG4gICAgICAgICAgICByb3RhdGlvbj17aG9yaXpvbnRhbExhYmVsUm90YXRpb259XG4gICAgICAgICAgICBvcmlnaW49e2Ake3h9LCAke3l9YH1cbiAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICAgIHg9e3h9XG4gICAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCJcbiAgICAgICAgICAgIHk9e3l9XG4gICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckxhYmVscygpfVxuICAgICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JIb3Jpem9udGFsTGFiZWxzKCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3lMYWJlbH1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgfTtcblxuICByZW5kZXJZVW5pdHNMYWJlbCA9IGNvbmZpZyA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgY291bnQsXG4gICAgICBoZWlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxuICAgIH0gPSBjb25maWc7XG4gICAgY29uc3QgeyB5QXhpc1VuaXRMYWJlbCwgeUxhYmVsc09mZnNldCA9IDEyIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHggPSBwYWRkaW5nUmlnaHQgLSB5TGFiZWxzT2Zmc2V0ICsgMztcbiAgICBjb25zdCB5ID1cbiAgICAgIGNvdW50ID09PSAxICYmIHRoaXMucHJvcHMuZnJvbVplcm9cbiAgICAgICAgPyBwYWRkaW5nVG9wICsgNFxuICAgICAgICA6IGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArIHBhZGRpbmdUb3A7XG5cbiAgICByZXR1cm4geUF4aXNVbml0TGFiZWwgPyAoXG4gICAgICA8VGV4dFxuICAgICAgICBvcmlnaW49e2Ake3h9LCAke3l9YH1cbiAgICAgICAgeD17eH1cbiAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgIHk9ezB9XG4gICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCl9XG4gICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9ySG9yaXpvbnRhbExhYmVscygpfVxuICAgICAgPlxuICAgICAgICB7eUF4aXNVbml0TGFiZWx9XG4gICAgICA8L1RleHQ+XG4gICAgKSA6IG51bGw7XG4gIH07XG5cbiAgcmVuZGVyVmVydGljYWxMYWJlbHMgPSAoe1xuICAgIGxhYmVscyA9IFtdLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBob3Jpem9udGFsT2Zmc2V0ID0gMCxcbiAgICBzdGFja2VkQmFyID0gZmFsc2UsXG4gICAgdmVydGljYWxMYWJlbFJvdGF0aW9uID0gMCxcbiAgICBmb3JtYXRYTGFiZWwgPSB4TGFiZWwgPT4geExhYmVsLFxuICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0UsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlzQmFyQ2hhcnQgPSBmYWxzZVxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgfCBcImxhYmVsc1wiXG4gICAgfCBcIndpZHRoXCJcbiAgICB8IFwiaGVpZ2h0XCJcbiAgICB8IFwicGFkZGluZ1JpZ2h0XCJcbiAgICB8IFwicGFkZGluZ1RvcFwiXG4gICAgfCBcImhvcml6b250YWxPZmZzZXRcIlxuICAgIHwgXCJzdGFja2VkQmFyXCJcbiAgICB8IFwidmVydGljYWxMYWJlbFJvdGF0aW9uXCJcbiAgICB8IFwiZm9ybWF0WExhYmVsXCJcbiAgICB8IFwidmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXCJcbiAgPikgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHhBeGlzTGFiZWwgPSBcIlwiLFxuICAgICAgeExhYmVsc09mZnNldCA9IDAsXG4gICAgICBoaWRlUG9pbnRzQXRJbmRleCA9IFtdXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBmb250U2l6ZSA9IDEyO1xuXG4gICAgbGV0IGZhYyA9IDE7XG4gICAgaWYgKHN0YWNrZWRCYXIpIHtcbiAgICAgIGZhYyA9IDAuNzE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhYmVscy5tYXAoKGxhYmVsLCBpKSA9PiB7XG4gICAgICAvL2lmIChoaWRlUG9pbnRzQXRJbmRleC5pbmNsdWRlcyhpKSkge1xuICAgICAgLy8gIHJldHVybiBudWxsO1xuICAgICAgLy99XG5cbiAgICAgIGNvbnN0IHggPVxuICAgICAgICAoKCh3aWR0aCAtIHBhZGRpbmdSaWdodCAtIDgpIC8gKGxhYmVscy5sZW5ndGggLSAoaXNCYXJDaGFydCA/IDAgOiAxKSkpICpcbiAgICAgICAgICBpICpcbiAgICAgICAgICAoaXNCYXJDaGFydCA/IDEuMDEzIDogMSkgK1xuICAgICAgICAgIHBhZGRpbmdSaWdodCArXG4gICAgICAgICAgaG9yaXpvbnRhbE9mZnNldCkgKlxuICAgICAgICBmYWM7XG5cbiAgICAgIGNvbnN0IHkgPVxuICAgICAgICBoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgK1xuICAgICAgICBwYWRkaW5nVG9wICtcbiAgICAgICAgZm9udFNpemUgKiAyICtcbiAgICAgICAgeExhYmVsc09mZnNldDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRleHRcbiAgICAgICAgICBvcmlnaW49e2Ake3h9LCAke3l9YH1cbiAgICAgICAgICByb3RhdGlvbj17dmVydGljYWxMYWJlbFJvdGF0aW9ufVxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICB4PXt4fVxuICAgICAgICAgIHk9e3l9XG4gICAgICAgICAgdGV4dEFuY2hvcj17dmVydGljYWxMYWJlbFJvdGF0aW9uID09PSAwID8gXCJtaWRkbGVcIiA6IFwic3RhcnRcIn1cbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckxhYmVscygpfVxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yVmVydGljYWxMYWJlbHMoKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtgJHtmb3JtYXRYTGFiZWwobGFiZWwpfSR7eEF4aXNMYWJlbH1gfVxuICAgICAgICA8L1RleHQ+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlclZlcnRpY2FsTGluZXMgPSAoe1xuICAgIGRhdGEsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgfTogT21pdDxcbiAgICBQaWNrPFxuICAgICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICAgIHwgXCJkYXRhXCJcbiAgICAgIHwgXCJ3aWR0aFwiXG4gICAgICB8IFwiaGVpZ2h0XCJcbiAgICAgIHwgXCJwYWRkaW5nUmlnaHRcIlxuICAgICAgfCBcInBhZGRpbmdUb3BcIlxuICAgICAgfCBcInZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZVwiXG4gICAgPixcbiAgICBcImRhdGFcIlxuICA+ICYgeyBkYXRhOiBudW1iZXJbXSB9KSA9PiB7XG4gICAgY29uc3QgeyB5QXhpc0ludGVydmFsID0gMSB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBbLi4ubmV3IEFycmF5KE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIHlBeGlzSW50ZXJ2YWwpKV0ubWFwKFxuICAgICAgKF8sIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TGluZVxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgeDE9e01hdGguZmxvb3IoXG4gICAgICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gKGRhdGEubGVuZ3RoIC8geUF4aXNJbnRlcnZhbCkpICogaSArXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgeTE9ezB9XG4gICAgICAgICAgICB4Mj17TWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgKCh3aWR0aCAtIHBhZGRpbmdSaWdodCkgLyAoZGF0YS5sZW5ndGggLyB5QXhpc0ludGVydmFsKSkgKiBpICtcbiAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB5Mj17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cbiAgICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG4gIHJlbmRlclZlcnRpY2FsTGluZSA9ICh7XG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcInZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZVwiXG4gID4pID0+IChcbiAgICA8TGluZVxuICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgeDE9e01hdGguZmxvb3IocGFkZGluZ1JpZ2h0KX1cbiAgICAgIHkxPXswfVxuICAgICAgeDI9e01hdGguZmxvb3IocGFkZGluZ1JpZ2h0KX1cbiAgICAgIHkyPXtoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgKyBwYWRkaW5nVG9wfVxuICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cbiAgICAvPlxuICApO1xuXG4gIHJlbmRlckRlZnMgPSAoXG4gICAgY29uZmlnOiBQaWNrPFxuICAgICAgUGFydGlhbEJ5PFxuICAgICAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHlcIlxuICAgICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCJcbiAgICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudFwiXG4gICAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XCJcbiAgICAgID4sXG4gICAgICB8IFwid2lkdGhcIlxuICAgICAgfCBcImhlaWdodFwiXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbVwiXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9cIlxuICAgICAgfCBcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIlxuICAgICAgfCBcImRhdGFcIlxuICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XCJcbiAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHlcIlxuICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudFwiXG4gICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVwiXG4gICAgPlxuICApID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGJhY2tncm91bmRHcmFkaWVudEZyb20sXG4gICAgICBiYWNrZ3JvdW5kR3JhZGllbnRUbyxcbiAgICAgIHVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXQsXG4gICAgICBkYXRhXG4gICAgfSA9IGNvbmZpZztcblxuICAgIGNvbnN0IGZyb21PcGFjaXR5ID0gY29uZmlnLmhhc093blByb3BlcnR5KFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHlcIilcbiAgICAgID8gY29uZmlnLmJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XG4gICAgICA6IDEuMDtcbiAgICBjb25zdCB0b09wYWNpdHkgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXCJiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHlcIilcbiAgICAgID8gY29uZmlnLmJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVxuICAgICAgOiAxLjA7XG5cbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnQgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXCJmaWxsU2hhZG93R3JhZGllbnRcIilcbiAgICAgID8gY29uZmlnLmZpbGxTaGFkb3dHcmFkaWVudFxuICAgICAgOiB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKDEuMCk7XG5cbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5ID0gY29uZmlnLmhhc093blByb3BlcnR5KFxuICAgICAgXCJmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XCJcbiAgICApXG4gICAgICA/IGNvbmZpZy5maWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XG4gICAgICA6IDAuMTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RGVmcz5cbiAgICAgICAgPExpbmVhckdyYWRpZW50XG4gICAgICAgICAgaWQ9XCJiYWNrZ3JvdW5kR3JhZGllbnRcIlxuICAgICAgICAgIHgxPXswfVxuICAgICAgICAgIHkxPXtoZWlnaHR9XG4gICAgICAgICAgeDI9e3dpZHRofVxuICAgICAgICAgIHkyPXswfVxuICAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8U3RvcFxuICAgICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICAgICBzdG9wQ29sb3I9e2JhY2tncm91bmRHcmFkaWVudEZyb219XG4gICAgICAgICAgICBzdG9wT3BhY2l0eT17ZnJvbU9wYWNpdHl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U3RvcFxuICAgICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICAgICBzdG9wQ29sb3I9e2JhY2tncm91bmRHcmFkaWVudFRvfVxuICAgICAgICAgICAgc3RvcE9wYWNpdHk9e3RvT3BhY2l0eX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxuICAgICAgICB7dXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldCA/IChcbiAgICAgICAgICBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxMaW5lYXJHcmFkaWVudFxuICAgICAgICAgICAgICBpZD17YGZpbGxTaGFkb3dHcmFkaWVudF8ke2luZGV4fWB9XG4gICAgICAgICAgICAgIGtleT17YCR7aW5kZXh9YH1cbiAgICAgICAgICAgICAgeDE9ezB9XG4gICAgICAgICAgICAgIHkxPXswfVxuICAgICAgICAgICAgICB4Mj17MH1cbiAgICAgICAgICAgICAgeTI9e2hlaWdodH1cbiAgICAgICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgICAgICAgICBzdG9wQ29sb3I9e1xuICAgICAgICAgICAgICAgICAgZGF0YXNldC5jb2xvciA/IGRhdGFzZXQuY29sb3IoMS4wKSA6IGZpbGxTaGFkb3dHcmFkaWVudFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdG9wT3BhY2l0eT17ZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0b3BcbiAgICAgICAgICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgICAgICAgICBzdG9wQ29sb3I9e1xuICAgICAgICAgICAgICAgICAgZGF0YXNldC5jb2xvclxuICAgICAgICAgICAgICAgICAgICA/IGRhdGFzZXQuY29sb3IoZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eSlcbiAgICAgICAgICAgICAgICAgICAgOiBmaWxsU2hhZG93R3JhZGllbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RvcE9wYWNpdHk9XCIwXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvTGluZWFyR3JhZGllbnQ+XG4gICAgICAgICAgKSlcbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8TGluZWFyR3JhZGllbnRcbiAgICAgICAgICAgIGlkPVwiZmlsbFNoYWRvd0dyYWRpZW50XCJcbiAgICAgICAgICAgIHgxPXswfVxuICAgICAgICAgICAgeTE9ezB9XG4gICAgICAgICAgICB4Mj17MH1cbiAgICAgICAgICAgIHkyPXtoZWlnaHR9XG4gICAgICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdG9wXG4gICAgICAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgICAgICBzdG9wQ29sb3I9e2ZpbGxTaGFkb3dHcmFkaWVudH1cbiAgICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2ZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFN0b3Agb2Zmc2V0PVwiMVwiIHN0b3BDb2xvcj17ZmlsbFNoYWRvd0dyYWRpZW50fSBzdG9wT3BhY2l0eT1cIjBcIiAvPlxuICAgICAgICAgIDwvTGluZWFyR3JhZGllbnQ+XG4gICAgICAgICl9XG4gICAgICA8L0RlZnM+XG4gICAgKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RDaGFydDtcbiJdfQ==
