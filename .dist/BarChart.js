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
import React from "react";
import { Animated, View } from "react-native";
import {
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text
} from "react-native-svg";
import AbstractChart from "./AbstractChart";
var barWidth = 32;
var differenceBetween = function(num1, num2) {
  return Math.abs(Math.abs(num1) - Math.abs(num2));
};
var _recursiveFindBar = function(needle, haystack, start, end, currentIndex) {
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
    return _recursiveFindBar(needle, haystack, start, mid - 1, newCurrentIndex);
  // If element at mid is smaller than x,
  // search in the right half of mid
  else
    return _recursiveFindBar(needle, haystack, mid + 1, end, newCurrentIndex);
};
var recursiveFindBar = function(needle, haystack) {
  return _recursiveFindBar(
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
      calcBaseHeight = _a.calcBaseHeight,
      fromNumber = _a.fromNumber,
      calcHeight = _a.calcHeight,
      paddingTop = _a.paddingTop,
      height = _a.height,
      data = _a.data,
      paddingRight = _a.paddingRight,
      barsRendered = _a.barsRendered,
      barRadius = _a.barRadius,
      width = _a.width,
      labelInTooltipFormatter = _a.labelInTooltipFormatter,
      tooltipLabels = _a.tooltipLabels;
    var units = (dotInfoModalProps || {}).units;
    if (touchMoveXCoords < 0 || !data) return null;
    var baseHeight = calcBaseHeight(data, height);
    var maxGraphHeight =
      ((baseHeight -
        calcHeight(fromNumber || Math.min.apply(Math, data), data, height)) /
        4) *
        3 +
      paddingTop;
    var x = touchMoveXCoords;
    /** Get index of the closest x element **/
    var index = recursiveFindBar(x, barsRendered);
    if (!barsRendered[index]) return null;
    var dotX = barsRendered[index].x;
    var dotY = barsRendered[index].y;
    var barWidth = barsRendered[index].barWidth;
    var rectHeight = barsRendered[index].height;
    var infoTextGoesOnTop = true;
    if ((touchMoveYCoords < dotY && dotY < maxGraphHeight - 25) || dotY < 50) {
      infoTextGoesOnTop = false;
    }
    var tooltipLabel = tooltipLabels
      ? tooltipLabels[index]
      : ((data === null || data === void 0 ? void 0 : data.labels[index]) &&
          labelInTooltipFormatter &&
          labelInTooltipFormatter(
            data === null || data === void 0 ? void 0 : data.labels[index]
          )) ||
        (data === null || data === void 0 ? void 0 : data.labels[index]);
    var halfOfBarWidth = barWidth / 2;
    return (
      <G>
        <Rect
          key={Math.random()}
          x={dotX}
          y={dotY}
          rx={barRadius}
          width={barWidth}
          height={rectHeight}
          fill={"transparent"}
          stroke="#fff"
          strokeWidth={2}
        />
        <Rect
          y={dotY + (infoTextGoesOnTop ? -45 : 8)}
          x={Math.min(
            Math.max(dotX - 40 + halfOfBarWidth, paddingRight),
            width - paddingRight - 24 - barWidth
          )}
          width={80}
          height={40}
          fill="white"
          rx={12}
          ry={12}
        />
        <Text
          y={dotY + (infoTextGoesOnTop ? -28 : 26)}
          x={Math.min(
            Math.max(dotX + halfOfBarWidth, paddingRight + 40),
            width - 45
          )}
          fill="black"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          {barsRendered[index].value
            ? barsRendered[index].value.toFixed(2) + " " + (units || "")
            : ""}
        </Text>
        <Text
          y={dotY + (infoTextGoesOnTop ? -15 : 39)}
          x={Math.min(
            Math.max(dotX + halfOfBarWidth, paddingRight + 40),
            width - 45
          )}
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
var BarChart = /** @class */ (function(_super) {
  __extends(BarChart, _super);
  function BarChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.state = {
      touchMoveXCoords: new Animated.Value(-1),
      touchMoveYCoords: new Animated.Value(-1)
    };
    _this.getBarPercentage = function() {
      var _a = _this.props.chartConfig.barPercentage,
        barPercentage = _a === void 0 ? 1 : _a;
      return barPercentage;
    };
    _this.barsRendered = [];
    _this.renderBars = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        barRadius = _a.barRadius,
        withCustomBarColorFromData = _a.withCustomBarColorFromData;
      var baseHeight = _this.calcBaseHeight(data, height);
      _this.barsRendered = [];
      return data.map(function(x, i) {
        if (x === null) return null;
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
        var rectX =
          paddingRight +
          (i * (width - paddingRight)) / data.length +
          barWidth / 2;
        var y =
          ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
          paddingTop;
        var rectHeight = (Math.abs(barHeight) / 4) * 3;
        _this.barsRendered.push({
          index: i,
          value: x,
          x: rectX,
          y: y,
          barWidth: barWidth,
          height: rectHeight
        });
        return (
          <Rect
            key={Math.random()}
            x={rectX}
            y={y}
            rx={barRadius}
            width={barWidth}
            height={rectHeight}
            fill={
              withCustomBarColorFromData
                ? "url(#customColor_0_" + i + ")"
                : "url(#fillShadowGradient)"
            }
          />
        );
      });
    };
    _this.renderBarTops = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        withCustomBarColorFromData = _a.withCustomBarColorFromData;
      var baseHeight = _this.calcBaseHeight(data, height);
      var minY = height * 0.75 + paddingTop;
      return data.map(function(x, i) {
        if (x === null) return null;
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
        var yHeight = ((baseHeight - barHeight) / 4) * 3 + paddingTop;
        return (
          <Rect
            key={Math.random()}
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2
            }
            y={yHeight < minY ? minY : yHeight}
            width={barWidth}
            height={1}
            fill={
              withCustomBarColorFromData
                ? "url(#customColor_0_" + i + ")"
                : _this.props.chartConfig.color(0.6)
            }
          />
        );
      });
    };
    _this.renderColors = function(_a) {
      var data = _a.data,
        flatColor = _a.flatColor;
      return data.map(function(dataset, index) {
        var _a, _b;
        return (
          <Defs key={(_a = dataset.key) !== null && _a !== void 0 ? _a : index}>
            {(_b = dataset.colors) === null || _b === void 0
              ? void 0
              : _b.map(function(color, colorIndex) {
                  var highOpacityColor = color(1.0);
                  var lowOpacityColor = color(0.1);
                  return (
                    <LinearGradient
                      id={"customColor_" + index + "_" + colorIndex}
                      key={index + "_" + colorIndex}
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={1}
                    >
                      <Stop
                        offset="0"
                        stopColor={highOpacityColor}
                        stopOpacity="1"
                      />
                      {flatColor ? (
                        <Stop
                          offset="1"
                          stopColor={highOpacityColor}
                          stopOpacity="1"
                        />
                      ) : (
                        <Stop
                          offset="1"
                          stopColor={lowOpacityColor}
                          stopOpacity="0"
                        />
                      )}
                    </LinearGradient>
                  );
                })}
          </Defs>
        );
      });
    };
    _this.renderValuesOnTopOfBars = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight;
      var baseHeight = _this.calcBaseHeight(data, height);
      return data.map(function(x, i) {
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
        return (
          <Text
            key={Math.random()}
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 1
            }
            y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 1}
            fill={_this.props.chartConfig.color(0.6)}
            fontSize="12"
            textAnchor="middle"
          >
            {data[i]}
          </Text>
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
  BarChart.prototype.render = function() {
    var _a;
    var _b = this.props,
      width = _b.width,
      height = _b.height,
      data = _b.data,
      _c = _b.style,
      style = _c === void 0 ? {} : _c,
      _d = _b.withHorizontalLabels,
      withHorizontalLabels = _d === void 0 ? true : _d,
      _e = _b.withVerticalLabels,
      withVerticalLabels = _e === void 0 ? true : _e,
      _f = _b.verticalLabelRotation,
      verticalLabelRotation = _f === void 0 ? 0 : _f,
      _g = _b.horizontalLabelRotation,
      horizontalLabelRotation = _g === void 0 ? 0 : _g,
      _h = _b.withInnerLines,
      withInnerLines = _h === void 0 ? true : _h,
      _j = _b.showBarTops,
      showBarTops = _j === void 0 ? true : _j,
      _k = _b.withCustomBarColorFromData,
      withCustomBarColorFromData = _k === void 0 ? false : _k,
      _l = _b.showValuesOnTopOfBars,
      showValuesOnTopOfBars = _l === void 0 ? false : _l,
      _m = _b.flatColor,
      flatColor = _m === void 0 ? false : _m,
      _o = _b.segments,
      segments = _o === void 0 ? 4 : _o,
      _p = _b.transparent,
      transparent = _p === void 0 ? false : _p,
      showBarInfoOnTouch = _b.showBarInfoOnTouch,
      labels = _b.labels;
    var _q = style.borderRadius,
      borderRadius = _q === void 0 ? 0 : _q,
      _r = style.paddingTop,
      paddingTop = _r === void 0 ? 16 : _r,
      _s = style.paddingRight,
      paddingRight = _s === void 0 ? 46 : _s;
    var config = {
      width: width,
      height: height,
      verticalLabelRotation: verticalLabelRotation,
      horizontalLabelRotation: horizontalLabelRotation,
      barRadius:
        (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      decimalPlaces:
        (_a =
          this.props.chartConfig && this.props.chartConfig.decimalPlaces) !==
          null && _a !== void 0
          ? _a
          : 2,
      formatYLabel:
        (this.props.chartConfig && this.props.chartConfig.formatYLabel) ||
        function(label) {
          return label;
        },
      formatXLabel:
        (this.props.chartConfig && this.props.chartConfig.formatXLabel) ||
        function(label) {
          return label;
        }
    };
    return (
      <View style={style}>
        <Svg
          height={height}
          width={width}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onTouchStart={this.onTouchMove}
        >
          {this.renderDefs(
            __assign(__assign({}, config), this.props.chartConfig)
          )}
          {this.renderColors(
            __assign(__assign({}, this.props.chartConfig), {
              flatColor: flatColor,
              data: this.props.data.datasets
            })
          )}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill={transparent ? "transparent" : "url(#backgroundGradient)"}
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines(
                  __assign(__assign({}, config), {
                    count: segments,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: segments,
                    data: data.datasets[0].data,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: data.labels,
                    // @ts-ignore
                    isBarChart: true,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    horizontalOffset: barWidth * this.getBarPercentage()
                  })
                )
              : null}
          </G>
          <G>
            {this.renderBars(
              __assign(__assign({}, config), {
                data: data.datasets[0].data,
                paddingTop: paddingTop,
                paddingRight: paddingRight,
                withCustomBarColorFromData: withCustomBarColorFromData
              })
            )}
          </G>
          <G>
            {showValuesOnTopOfBars &&
              this.renderValuesOnTopOfBars(
                __assign(__assign({}, config), {
                  data: data.datasets[0].data,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight
                })
              )}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops(
                __assign(__assign({}, config), {
                  data: data.datasets[0].data,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight,
                  withCustomBarColorFromData: withCustomBarColorFromData
                })
              )}
          </G>
          <G>
            {showBarInfoOnTouch && (
              <AnimatedDotInfoGroup
                touchMoveXCoords={this.state.touchMoveXCoords}
                touchMoveYCoords={this.state.touchMoveYCoords}
                calcBaseHeight={this.calcBaseHeight}
                fromNumber={this.props.fromNumber}
                calcHeight={this.calcHeight}
                getBarPercentage={this.getBarPercentage}
                paddingTop={paddingTop}
                paddingRight={paddingRight}
                dotInfoModalProps={this.props.dotInfoModalProps}
                labelInTooltipFormatter={this.props.labelInTooltipFormatter}
                tooltipLabels={this.props.tooltipLabels}
                height={height}
                width={width}
                barRadius={config.barRadius}
                data={data}
                labels={labels}
                barsRendered={this.barsRendered}
              />
            )}
          </G>
        </Svg>
      </View>
    );
  };
  return BarChart;
})(AbstractChart);
export default BarChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFyQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQmFyQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBYSxNQUFNLGNBQWMsQ0FBQztBQUN6RCxPQUFPLEVBQ0wsSUFBSSxFQUNKLENBQUMsRUFFRCxjQUFjLEVBQ2QsSUFBSSxFQUNKLElBQUksRUFDSixHQUFHLEVBQ0gsSUFBSSxFQUNMLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxhQUdOLE1BQU0saUJBQWlCLENBQUM7QUFHekIsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBc0NwQixJQUFNLGlCQUFpQixHQUFHLFVBQUMsSUFBWSxFQUFFLElBQVk7SUFDbkQsT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUF6QyxDQUF5QyxDQUFDO0FBRTVDLElBQU0saUJBQWlCLEdBQUcsVUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsWUFBWTtJQUNuRSxpQkFBaUI7SUFDakIsSUFBSSxLQUFLLEdBQUcsR0FBRztRQUFFLE9BQU8sWUFBWSxDQUFDO0lBRXJDLHdCQUF3QjtJQUN4QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLElBQUksZUFBZSxHQUNqQixRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ2IsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDZixpQkFBaUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFF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LENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDZixZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQ2hDLENBQ0gsQ0FDSDtVQUFBLEVBQUUsQ0FBQyxDQUNMO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUF0V0QsQ0FBdUIsYUFBYSxHQXNXbkM7QUFFRCxlQUFlLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEFuaW1hdGVkLCBWaWV3LCBWaWV3U3R5bGUgfSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG5pbXBvcnQge1xuICBEZWZzLFxuICBHLFxuICBMaW5lLFxuICBMaW5lYXJHcmFkaWVudCxcbiAgUmVjdCxcbiAgU3RvcCxcbiAgU3ZnLFxuICBUZXh0XG59IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7XG4gIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gIEFic3RyYWN0Q2hhcnRQcm9wc1xufSBmcm9tIFwiLi9BYnN0cmFjdENoYXJ0XCI7XG5pbXBvcnQgeyBDaGFydERhdGEgfSBmcm9tIFwiLi9IZWxwZXJUeXBlc1wiO1xuXG5jb25zdCBiYXJXaWR0aCA9IDMyO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJhckNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBkYXRhOiBDaGFydERhdGE7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBmcm9tWmVybz86IGJvb2xlYW47XG4gIHdpdGhJbm5lckxpbmVzPzogYm9vbGVhbjtcbiAgeUF4aXNMYWJlbDogc3RyaW5nO1xuICB5QXhpc1N1ZmZpeDogc3RyaW5nO1xuICBjaGFydENvbmZpZzogQWJzdHJhY3RDaGFydENvbmZpZztcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGhvcml6b250YWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICB2ZXJ0aWNhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBTaG93IHZlcnRpY2FsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoVmVydGljYWxMYWJlbHM/OiBib29sZWFuO1xuICAvKipcbiAgICogU2hvdyBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoSG9yaXpvbnRhbExhYmVscz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGhvcml6b250YWwgbGluZXNcbiAgICovXG4gIHNlZ21lbnRzPzogbnVtYmVyO1xuICBzaG93QmFyVG9wcz86IGJvb2xlYW47XG4gIHNob3dWYWx1ZXNPblRvcE9mQmFycz86IGJvb2xlYW47XG4gIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhPzogYm9vbGVhbjtcbiAgZmxhdENvbG9yPzogYm9vbGVhbjtcbiAgdHJhbnNwYXJlbnQ/OiBib29sZWFuO1xuICBzaG93QmFySW5mb09uVG91Y2g/OiBib29sZWFuO1xuICBkb3RJbmZvTW9kYWxQcm9wcz86IGFueTtcbiAgbGFiZWxzPzogc3RyaW5nW107XG4gIGxhYmVsSW5Ub29sdGlwRm9ybWF0dGVyPzogKGxhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcbiAgdG9vbHRpcExhYmVscz86IHN0cmluZ1tdO1xufVxuXG5jb25zdCBkaWZmZXJlbmNlQmV0d2VlbiA9IChudW0xOiBudW1iZXIsIG51bTI6IG51bWJlcikgPT5cbiAgTWF0aC5hYnMoTWF0aC5hYnMobnVtMSkgLSBNYXRoLmFicyhudW0yKSk7XG5cbmNvbnN0IF9yZWN1cnNpdmVGaW5kQmFyID0gKG5lZWRsZSwgaGF5c3RhY2ssIHN0YXJ0LCBlbmQsIGN1cnJlbnRJbmRleCkgPT4ge1xuICAvLyBCYXNlIENvbmRpdGlvblxuICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBjdXJyZW50SW5kZXg7XG5cbiAgLy8gRmluZCB0aGUgbWlkZGxlIGluZGV4XG4gIGxldCBtaWQgPSBNYXRoLmZsb29yKChzdGFydCArIGVuZCkgLyAyKTtcbiAgbGV0IG5ld0N1cnJlbnRJbmRleCA9XG4gICAgaGF5c3RhY2tbbWlkXSAmJlxuICAgIGhheXN0YWNrW21pZF0ueCAmJlxuICAgIGRpZmZlcmVuY2VCZXR3ZWVuKGhheXN0YWNrW21pZF0ueCwgbmVlZGxlKSA8XG4gICAgICBkaWZmZXJlbmNlQmV0d2VlbihoYXlzdGFja1tjdXJyZW50SW5kZXhdLngsIG5lZWRsZSlcbiAgICAgID8gbWlkXG4gICAgICA6IGN1cnJlbnRJbmRleDtcblxuICBpZiAoaGF5c3RhY2subGVuZ3RoID09PSAxKSByZXR1cm4gbmV3Q3VycmVudEluZGV4O1xuICBpZiAoIWhheXN0YWNrW21pZF0pIHJldHVybiBoYXlzdGFjay5sZW5ndGggLSAxO1xuXG4gIC8vIElmIGVsZW1lbnQgYXQgbWlkIGlzIGdyZWF0ZXIgdGhhbiB4LFxuICAvLyBzZWFyY2ggaW4gdGhlIGxlZnQgaGFsZiBvZiBtaWRcbiAgaWYgKGhheXN0YWNrW21pZF0ueCA+IG5lZWRsZSlcbiAgICByZXR1cm4gX3JlY3Vyc2l2ZUZpbmRCYXIobmVlZGxlLCBoYXlzdGFjaywgc3RhcnQsIG1pZCAtIDEsIG5ld0N1cnJlbnRJbmRleCk7XG4gIC8vIElmIGVsZW1lbnQgYXQgbWlkIGlzIHNtYWxsZXIgdGhhbiB4LFxuICAvLyBzZWFyY2ggaW4gdGhlIHJpZ2h0IGhhbGYgb2YgbWlkXG4gIGVsc2VcbiAgICByZXR1cm4gX3JlY3Vyc2l2ZUZpbmRCYXIobmVlZGxlLCBoYXlzdGFjaywgbWlkICsgMSwgZW5kLCBuZXdDdXJyZW50SW5kZXgpO1xufTtcblxuY29uc3QgcmVjdXJzaXZlRmluZEJhciA9IChcbiAgbmVlZGxlOiBBbmltYXRlZC5WYWx1ZSxcbiAgaGF5c3RhY2s6IHsgaW5kZXg6IG51bWJlcjsgdmFsdWU6IG51bWJlcjsgeDogbnVtYmVyOyB5OiBudW1iZXIgfVtdXG4pID0+IHtcbiAgcmV0dXJuIF9yZWN1cnNpdmVGaW5kQmFyKFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBuZWVkbGUsXG4gICAgaGF5c3RhY2ssXG4gICAgMCxcbiAgICBoYXlzdGFjay5sZW5ndGgsXG4gICAgTWF0aC5mbG9vcihoYXlzdGFjay5sZW5ndGggLyAyKVxuICApO1xufTtcblxuY2xhc3MgRG90SW5mb0dyb3VwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBkb3RJbmZvTW9kYWxQcm9wcyxcbiAgICAgIHRvdWNoTW92ZVhDb29yZHMsXG4gICAgICB0b3VjaE1vdmVZQ29vcmRzLFxuICAgICAgY2FsY0Jhc2VIZWlnaHQsXG4gICAgICBmcm9tTnVtYmVyLFxuICAgICAgY2FsY0hlaWdodCxcbiAgICAgIHBhZGRpbmdUb3AsXG4gICAgICBoZWlnaHQsXG4gICAgICBkYXRhLFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgYmFyc1JlbmRlcmVkLFxuICAgICAgYmFyUmFkaXVzLFxuICAgICAgd2lkdGgsXG4gICAgICBsYWJlbEluVG9vbHRpcEZvcm1hdHRlcixcbiAgICAgIHRvb2x0aXBMYWJlbHNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHsgdW5pdHMgfSA9IGRvdEluZm9Nb2RhbFByb3BzIHx8IHt9O1xuXG4gICAgaWYgKHRvdWNoTW92ZVhDb29yZHMgPCAwIHx8ICFkYXRhKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSBjYWxjQmFzZUhlaWdodChkYXRhLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgbWF4R3JhcGhIZWlnaHQgPVxuICAgICAgKChiYXNlSGVpZ2h0IC1cbiAgICAgICAgY2FsY0hlaWdodChmcm9tTnVtYmVyIHx8IE1hdGgubWluKC4uLmRhdGEpLCBkYXRhLCBoZWlnaHQpKSAvXG4gICAgICAgIDQpICpcbiAgICAgICAgMyArXG4gICAgICBwYWRkaW5nVG9wO1xuICAgIGNvbnN0IHggPSB0b3VjaE1vdmVYQ29vcmRzO1xuICAgIC8qKiBHZXQgaW5kZXggb2YgdGhlIGNsb3Nlc3QgeCBlbGVtZW50ICoqL1xuICAgIGNvbnN0IGluZGV4ID0gcmVjdXJzaXZlRmluZEJhcih4LCBiYXJzUmVuZGVyZWQpO1xuICAgIGlmICghYmFyc1JlbmRlcmVkW2luZGV4XSkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZG90WCA9IGJhcnNSZW5kZXJlZFtpbmRleF0ueDtcbiAgICBjb25zdCBkb3RZID0gYmFyc1JlbmRlcmVkW2luZGV4XS55O1xuICAgIGNvbnN0IGJhcldpZHRoID0gYmFyc1JlbmRlcmVkW2luZGV4XS5iYXJXaWR0aDtcbiAgICBjb25zdCByZWN0SGVpZ2h0ID0gYmFyc1JlbmRlcmVkW2luZGV4XS5oZWlnaHQ7XG4gICAgbGV0IGluZm9UZXh0R29lc09uVG9wID0gdHJ1ZTtcbiAgICBpZiAoKHRvdWNoTW92ZVlDb29yZHMgPCBkb3RZICYmIGRvdFkgPCBtYXhHcmFwaEhlaWdodCAtIDI1KSB8fCBkb3RZIDwgNTApIHtcbiAgICAgIGluZm9UZXh0R29lc09uVG9wID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHRvb2x0aXBMYWJlbCA9IHRvb2x0aXBMYWJlbHNcbiAgICAgID8gdG9vbHRpcExhYmVsc1tpbmRleF1cbiAgICAgIDogKGRhdGE/LmxhYmVsc1tpbmRleF0gJiZcbiAgICAgICAgICBsYWJlbEluVG9vbHRpcEZvcm1hdHRlciAmJlxuICAgICAgICAgIGxhYmVsSW5Ub29sdGlwRm9ybWF0dGVyKGRhdGE/LmxhYmVsc1tpbmRleF0pKSB8fFxuICAgICAgICBkYXRhPy5sYWJlbHNbaW5kZXhdO1xuXG4gICAgY29uc3QgaGFsZk9mQmFyV2lkdGggPSBiYXJXaWR0aCAvIDI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEc+XG4gICAgICAgIDxSZWN0XG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHg9e2RvdFh9XG4gICAgICAgICAgeT17ZG90WX1cbiAgICAgICAgICByeD17YmFyUmFkaXVzfVxuICAgICAgICAgIHdpZHRoPXtiYXJXaWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e3JlY3RIZWlnaHR9XG4gICAgICAgICAgZmlsbD17XCJ0cmFuc3BhcmVudFwifVxuICAgICAgICAgIHN0cm9rZT1cIiNmZmZcIlxuICAgICAgICAgIHN0cm9rZVdpZHRoPXsyfVxuICAgICAgICAvPlxuICAgICAgICA8UmVjdFxuICAgICAgICAgIHk9e2RvdFkgKyAoaW5mb1RleHRHb2VzT25Ub3AgPyAtNDUgOiA4KX1cbiAgICAgICAgICB4PXtNYXRoLm1pbihcbiAgICAgICAgICAgIE1hdGgubWF4KGRvdFggLSA0MCArIGhhbGZPZkJhcldpZHRoLCBwYWRkaW5nUmlnaHQpLFxuICAgICAgICAgICAgd2lkdGggLSBwYWRkaW5nUmlnaHQgLSAyNCAtIGJhcldpZHRoXG4gICAgICAgICAgKX1cbiAgICAgICAgICB3aWR0aD17ODB9XG4gICAgICAgICAgaGVpZ2h0PXs0MH1cbiAgICAgICAgICBmaWxsPVwid2hpdGVcIlxuICAgICAgICAgIHJ4PXsxMn1cbiAgICAgICAgICByeT17MTJ9XG4gICAgICAgIC8+XG4gICAgICAgIDxUZXh0XG4gICAgICAgICAgeT17ZG90WSArIChpbmZvVGV4dEdvZXNPblRvcCA/IC0yOCA6IDI2KX1cbiAgICAgICAgICB4PXtNYXRoLm1pbihcbiAgICAgICAgICAgIE1hdGgubWF4KGRvdFggKyBoYWxmT2ZCYXJXaWR0aCwgcGFkZGluZ1JpZ2h0ICsgNDApLFxuICAgICAgICAgICAgd2lkdGggLSA0NVxuICAgICAgICAgICl9XG4gICAgICAgICAgZmlsbD1cImJsYWNrXCJcbiAgICAgICAgICBmb250U2l6ZT1cIjEwXCJcbiAgICAgICAgICBmb250V2VpZ2h0PVwiYm9sZFwiXG4gICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgID5cbiAgICAgICAgICB7YmFyc1JlbmRlcmVkW2luZGV4XS52YWx1ZVxuICAgICAgICAgICAgPyBiYXJzUmVuZGVyZWRbaW5kZXhdLnZhbHVlLnRvRml4ZWQoMikgKyBcIiBcIiArICh1bml0cyB8fCBcIlwiKVxuICAgICAgICAgICAgOiBcIlwifVxuICAgICAgICA8L1RleHQ+XG4gICAgICAgIDxUZXh0XG4gICAgICAgICAgeT17ZG90WSArIChpbmZvVGV4dEdvZXNPblRvcCA/IC0xNSA6IDM5KX1cbiAgICAgICAgICB4PXtNYXRoLm1pbihcbiAgICAgICAgICAgIE1hdGgubWF4KGRvdFggKyBoYWxmT2ZCYXJXaWR0aCwgcGFkZGluZ1JpZ2h0ICsgNDApLFxuICAgICAgICAgICAgd2lkdGggLSA0NVxuICAgICAgICAgICl9XG4gICAgICAgICAgZmlsbD1cImJsYWNrXCJcbiAgICAgICAgICBmb250U2l6ZT1cIjhcIlxuICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICA+XG4gICAgICAgICAge3Rvb2x0aXBMYWJlbH1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9HPlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgQW5pbWF0ZWREb3RJbmZvR3JvdXAgPSBBbmltYXRlZC5jcmVhdGVBbmltYXRlZENvbXBvbmVudChEb3RJbmZvR3JvdXApO1xuXG50eXBlIEJhckNoYXJ0U3RhdGUgPSB7XG4gIHRvdWNoTW92ZVhDb29yZHM6IEFuaW1hdGVkLlZhbHVlO1xuICB0b3VjaE1vdmVZQ29vcmRzOiBBbmltYXRlZC5WYWx1ZTtcbn07XG5cbmNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxCYXJDaGFydFByb3BzLCBCYXJDaGFydFN0YXRlPiB7XG4gIHN0YXRlID0ge1xuICAgIHRvdWNoTW92ZVhDb29yZHM6IG5ldyBBbmltYXRlZC5WYWx1ZSgtMSksXG4gICAgdG91Y2hNb3ZlWUNvb3JkczogbmV3IEFuaW1hdGVkLlZhbHVlKC0xKVxuICB9O1xuXG4gIGdldEJhclBlcmNlbnRhZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBiYXJQZXJjZW50YWdlID0gMSB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4gYmFyUGVyY2VudGFnZTtcbiAgfTtcblxuICBiYXJzUmVuZGVyZWQgPSBbXTtcblxuICByZW5kZXJCYXJzID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBiYXJSYWRpdXMsXG4gICAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGFcbiAgfTogUGljazxcbiAgICBPbWl0PEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPixcbiAgICBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJiYXJSYWRpdXNcIlxuICA+ICYge1xuICAgIGRhdGE6IG51bWJlcltdO1xuICAgIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhOiBib29sZWFuO1xuICB9KSA9PiB7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YSwgaGVpZ2h0KTtcbiAgICB0aGlzLmJhcnNSZW5kZXJlZCA9IFtdO1xuICAgIHJldHVybiBkYXRhLm1hcCgoeCwgaSkgPT4ge1xuICAgICAgaWYgKHggPT09IG51bGwpIHJldHVybiBudWxsO1xuICAgICAgY29uc3QgYmFySGVpZ2h0ID0gdGhpcy5jYWxjSGVpZ2h0KHgsIGRhdGEsIGhlaWdodCk7XG4gICAgICBjb25zdCBiYXJXaWR0aCA9IDMyICogdGhpcy5nZXRCYXJQZXJjZW50YWdlKCk7XG5cbiAgICAgIGNvbnN0IHJlY3RYID1cbiAgICAgICAgcGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGRhdGEubGVuZ3RoICtcbiAgICAgICAgYmFyV2lkdGggLyAyO1xuICAgICAgY29uc3QgeSA9XG4gICAgICAgICgoYmFySGVpZ2h0ID4gMCA/IGJhc2VIZWlnaHQgLSBiYXJIZWlnaHQgOiBiYXNlSGVpZ2h0KSAvIDQpICogMyArXG4gICAgICAgIHBhZGRpbmdUb3A7XG5cbiAgICAgIGNvbnN0IHJlY3RIZWlnaHQgPSAoTWF0aC5hYnMoYmFySGVpZ2h0KSAvIDQpICogMztcblxuICAgICAgdGhpcy5iYXJzUmVuZGVyZWQucHVzaCh7XG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICB2YWx1ZTogeCxcbiAgICAgICAgeDogcmVjdFgsXG4gICAgICAgIHksXG4gICAgICAgIGJhcldpZHRoLFxuICAgICAgICBoZWlnaHQ6IHJlY3RIZWlnaHRcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UmVjdFxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICB4PXtyZWN0WH1cbiAgICAgICAgICB5PXt5fVxuICAgICAgICAgIHJ4PXtiYXJSYWRpdXN9XG4gICAgICAgICAgd2lkdGg9e2JhcldpZHRofVxuICAgICAgICAgIGhlaWdodD17cmVjdEhlaWdodH1cbiAgICAgICAgICBmaWxsPXtcbiAgICAgICAgICAgIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhXG4gICAgICAgICAgICAgID8gYHVybCgjY3VzdG9tQ29sb3JfMF8ke2l9KWBcbiAgICAgICAgICAgICAgOiBcInVybCgjZmlsbFNoYWRvd0dyYWRpZW50KVwiXG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXJCYXJUb3BzID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICB3aXRoQ3VzdG9tQmFyQ29sb3JGcm9tRGF0YVxuICB9OiBQaWNrPFxuICAgIE9taXQ8QWJzdHJhY3RDaGFydENvbmZpZywgXCJkYXRhXCI+LFxuICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcbiAgPiAmIHtcbiAgICBkYXRhOiBudW1iZXJbXTtcbiAgICB3aXRoQ3VzdG9tQmFyQ29sb3JGcm9tRGF0YT86IGJvb2xlYW47XG4gIH0pID0+IHtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgbWluWSA9IGhlaWdodCAqIDAuNzUgKyBwYWRkaW5nVG9wO1xuXG4gICAgcmV0dXJuIGRhdGEubWFwKCh4LCBpKSA9PiB7XG4gICAgICBpZiAoeCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgICBjb25zdCBiYXJIZWlnaHQgPSB0aGlzLmNhbGNIZWlnaHQoeCwgZGF0YSwgaGVpZ2h0KTtcbiAgICAgIGNvbnN0IGJhcldpZHRoID0gMzIgKiB0aGlzLmdldEJhclBlcmNlbnRhZ2UoKTtcbiAgICAgIGNvbnN0IHlIZWlnaHQgPSAoKGJhc2VIZWlnaHQgLSBiYXJIZWlnaHQpIC8gNCkgKiAzICsgcGFkZGluZ1RvcDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxSZWN0XG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHg9e1xuICAgICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhLmxlbmd0aCArXG4gICAgICAgICAgICBiYXJXaWR0aCAvIDJcbiAgICAgICAgICB9XG4gICAgICAgICAgeT17eUhlaWdodCA8IG1pblkgPyBtaW5ZIDogeUhlaWdodH1cbiAgICAgICAgICB3aWR0aD17YmFyV2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXsxfVxuICAgICAgICAgIGZpbGw9e1xuICAgICAgICAgICAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGFcbiAgICAgICAgICAgICAgPyBgdXJsKCNjdXN0b21Db2xvcl8wXyR7aX0pYFxuICAgICAgICAgICAgICA6IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoMC42KVxuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyQ29sb3JzID0gKHtcbiAgICBkYXRhLFxuICAgIGZsYXRDb2xvclxuICB9OiBQaWNrPEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPiAmIHtcbiAgICBmbGF0Q29sb3I6IGJvb2xlYW47XG4gIH0pID0+IHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiAoXG4gICAgICA8RGVmcyBrZXk9e2RhdGFzZXQua2V5ID8/IGluZGV4fT5cbiAgICAgICAge2RhdGFzZXQuY29sb3JzPy5tYXAoKGNvbG9yLCBjb2xvckluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlnaE9wYWNpdHlDb2xvciA9IGNvbG9yKDEuMCk7XG4gICAgICAgICAgY29uc3QgbG93T3BhY2l0eUNvbG9yID0gY29sb3IoMC4xKTtcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TGluZWFyR3JhZGllbnRcbiAgICAgICAgICAgICAgaWQ9e2BjdXN0b21Db2xvcl8ke2luZGV4fV8ke2NvbG9ySW5kZXh9YH1cbiAgICAgICAgICAgICAga2V5PXtgJHtpbmRleH1fJHtjb2xvckluZGV4fWB9XG4gICAgICAgICAgICAgIHgxPXswfVxuICAgICAgICAgICAgICB5MT17MH1cbiAgICAgICAgICAgICAgeDI9ezB9XG4gICAgICAgICAgICAgIHkyPXsxfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U3RvcCBvZmZzZXQ9XCIwXCIgc3RvcENvbG9yPXtoaWdoT3BhY2l0eUNvbG9yfSBzdG9wT3BhY2l0eT1cIjFcIiAvPlxuICAgICAgICAgICAgICB7ZmxhdENvbG9yID8gKFxuICAgICAgICAgICAgICAgIDxTdG9wIG9mZnNldD1cIjFcIiBzdG9wQ29sb3I9e2hpZ2hPcGFjaXR5Q29sb3J9IHN0b3BPcGFjaXR5PVwiMVwiIC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPFN0b3Agb2Zmc2V0PVwiMVwiIHN0b3BDb2xvcj17bG93T3BhY2l0eUNvbG9yfSBzdG9wT3BhY2l0eT1cIjBcIiAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9MaW5lYXJHcmFkaWVudD5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgIDwvRGVmcz5cbiAgICApKTtcbiAgfTtcblxuICByZW5kZXJWYWx1ZXNPblRvcE9mQmFycyA9ICh7XG4gICAgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBwYWRkaW5nUmlnaHRcbiAgfTogUGljazxcbiAgICBPbWl0PEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPixcbiAgICBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4gJiB7XG4gICAgZGF0YTogbnVtYmVyW107XG4gIH0pID0+IHtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhLCBoZWlnaHQpO1xuXG4gICAgcmV0dXJuIGRhdGEubWFwKCh4LCBpKSA9PiB7XG4gICAgICBjb25zdCBiYXJIZWlnaHQgPSB0aGlzLmNhbGNIZWlnaHQoeCwgZGF0YSwgaGVpZ2h0KTtcbiAgICAgIGNvbnN0IGJhcldpZHRoID0gMzIgKiB0aGlzLmdldEJhclBlcmNlbnRhZ2UoKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUZXh0XG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHg9e1xuICAgICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhLmxlbmd0aCArXG4gICAgICAgICAgICBiYXJXaWR0aCAvIDFcbiAgICAgICAgICB9XG4gICAgICAgICAgeT17KChiYXNlSGVpZ2h0IC0gYmFySGVpZ2h0KSAvIDQpICogMyArIHBhZGRpbmdUb3AgLSAxfVxuICAgICAgICAgIGZpbGw9e3RoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoMC42KX1cbiAgICAgICAgICBmb250U2l6ZT1cIjEyXCJcbiAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgPlxuICAgICAgICAgIHtkYXRhW2ldfVxuICAgICAgICA8L1RleHQ+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHRpbWVvdXQgPSBudWxsO1xuICBvblRvdWNoRW5kID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnRpbWVvdXQpIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS50b3VjaE1vdmVYQ29vcmRzLnNldFZhbHVlKC0xKTtcbiAgICAgIHRoaXMuc3RhdGUudG91Y2hNb3ZlWUNvb3Jkcy5zZXRWYWx1ZSgtMSk7XG4gICAgfSwgMTAwMCk7XG4gIH07XG4gIG9uVG91Y2hNb3ZlID0gZSA9PiB7XG4gICAgaWYgKHRoaXMudGltZW91dCkgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgdGhpcy5zdGF0ZS50b3VjaE1vdmVYQ29vcmRzLnNldFZhbHVlKGUubmF0aXZlRXZlbnQubG9jYXRpb25YKTtcbiAgICB0aGlzLnN0YXRlLnRvdWNoTW92ZVlDb29yZHMuc2V0VmFsdWUoZS5uYXRpdmVFdmVudC5sb2NhdGlvblkpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGRhdGEsXG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgd2l0aEhvcml6b250YWxMYWJlbHMgPSB0cnVlLFxuICAgICAgd2l0aFZlcnRpY2FsTGFiZWxzID0gdHJ1ZSxcbiAgICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICB3aXRoSW5uZXJMaW5lcyA9IHRydWUsXG4gICAgICBzaG93QmFyVG9wcyA9IHRydWUsXG4gICAgICB3aXRoQ3VzdG9tQmFyQ29sb3JGcm9tRGF0YSA9IGZhbHNlLFxuICAgICAgc2hvd1ZhbHVlc09uVG9wT2ZCYXJzID0gZmFsc2UsXG4gICAgICBmbGF0Q29sb3IgPSBmYWxzZSxcbiAgICAgIHNlZ21lbnRzID0gNCxcbiAgICAgIHRyYW5zcGFyZW50ID0gZmFsc2UsXG4gICAgICBzaG93QmFySW5mb09uVG91Y2gsXG4gICAgICBsYWJlbHNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHsgYm9yZGVyUmFkaXVzID0gMCwgcGFkZGluZ1RvcCA9IDE2LCBwYWRkaW5nUmlnaHQgPSA0NiB9ID0gc3R5bGU7XG5cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbixcbiAgICAgIGhvcml6b250YWxMYWJlbFJvdGF0aW9uLFxuICAgICAgYmFyUmFkaXVzOlxuICAgICAgICAodGhpcy5wcm9wcy5jaGFydENvbmZpZyAmJiB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmJhclJhZGl1cykgfHwgMCxcbiAgICAgIGRlY2ltYWxQbGFjZXM6XG4gICAgICAgICh0aGlzLnByb3BzLmNoYXJ0Q29uZmlnICYmIHRoaXMucHJvcHMuY2hhcnRDb25maWcuZGVjaW1hbFBsYWNlcykgPz8gMixcbiAgICAgIGZvcm1hdFlMYWJlbDpcbiAgICAgICAgKHRoaXMucHJvcHMuY2hhcnRDb25maWcgJiYgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5mb3JtYXRZTGFiZWwpIHx8XG4gICAgICAgIGZ1bmN0aW9uKGxhYmVsKSB7XG4gICAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgICAgICB9LFxuICAgICAgZm9ybWF0WExhYmVsOlxuICAgICAgICAodGhpcy5wcm9wcy5jaGFydENvbmZpZyAmJiB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmZvcm1hdFhMYWJlbCkgfHxcbiAgICAgICAgZnVuY3Rpb24obGFiZWwpIHtcbiAgICAgICAgICByZXR1cm4gbGFiZWw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgIDxTdmdcbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgb25Ub3VjaE1vdmU9e3RoaXMub25Ub3VjaE1vdmV9XG4gICAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5vblRvdWNoRW5kfVxuICAgICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5vblRvdWNoTW92ZX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jaGFydENvbmZpZ1xuICAgICAgICAgIH0pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbG9ycyh7XG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgZmxhdENvbG9yOiBmbGF0Q29sb3IsXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnByb3BzLmRhdGEuZGF0YXNldHNcbiAgICAgICAgICB9KX1cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBmaWxsPXt0cmFuc3BhcmVudCA/IFwidHJhbnNwYXJlbnRcIiA6IFwidXJsKCNiYWNrZ3JvdW5kR3JhZGllbnQpXCJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt3aXRoSW5uZXJMaW5lc1xuICAgICAgICAgICAgICA/IHRoaXMucmVuZGVySG9yaXpvbnRhbExpbmVzKHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGNvdW50OiBzZWdtZW50cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICA6IG51bGx9XG4gICAgICAgICAgPC9HPlxuICAgICAgICAgIDxHPlxuICAgICAgICAgICAge3dpdGhIb3Jpem9udGFsTGFiZWxzXG4gICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGFiZWxzKHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGNvdW50OiBzZWdtZW50cyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNbMF0uZGF0YSxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgOiBudWxsfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt3aXRoVmVydGljYWxMYWJlbHNcbiAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlclZlcnRpY2FsTGFiZWxzKHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczogZGF0YS5sYWJlbHMsXG4gICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICBpc0JhckNoYXJ0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBob3Jpem9udGFsT2Zmc2V0OiBiYXJXaWR0aCAqIHRoaXMuZ2V0QmFyUGVyY2VudGFnZSgpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgOiBudWxsfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckJhcnMoe1xuICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNbMF0uZGF0YSxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGE6IHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7c2hvd1ZhbHVlc09uVG9wT2ZCYXJzICYmXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyVmFsdWVzT25Ub3BPZkJhcnMoe1xuICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzWzBdLmRhdGEsXG4gICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHtzaG93QmFyVG9wcyAmJlxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckJhclRvcHMoe1xuICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzWzBdLmRhdGEsXG4gICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHtzaG93QmFySW5mb09uVG91Y2ggJiYgKFxuICAgICAgICAgICAgICA8QW5pbWF0ZWREb3RJbmZvR3JvdXBcbiAgICAgICAgICAgICAgICB0b3VjaE1vdmVYQ29vcmRzPXt0aGlzLnN0YXRlLnRvdWNoTW92ZVhDb29yZHN9XG4gICAgICAgICAgICAgICAgdG91Y2hNb3ZlWUNvb3Jkcz17dGhpcy5zdGF0ZS50b3VjaE1vdmVZQ29vcmRzfVxuICAgICAgICAgICAgICAgIGNhbGNCYXNlSGVpZ2h0PXt0aGlzLmNhbGNCYXNlSGVpZ2h0fVxuICAgICAgICAgICAgICAgIGZyb21OdW1iZXI9e3RoaXMucHJvcHMuZnJvbU51bWJlcn1cbiAgICAgICAgICAgICAgICBjYWxjSGVpZ2h0PXt0aGlzLmNhbGNIZWlnaHR9XG4gICAgICAgICAgICAgICAgZ2V0QmFyUGVyY2VudGFnZT17dGhpcy5nZXRCYXJQZXJjZW50YWdlfVxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A9e3BhZGRpbmdUb3B9XG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0PXtwYWRkaW5nUmlnaHR9XG4gICAgICAgICAgICAgICAgZG90SW5mb01vZGFsUHJvcHM9e3RoaXMucHJvcHMuZG90SW5mb01vZGFsUHJvcHN9XG4gICAgICAgICAgICAgICAgbGFiZWxJblRvb2x0aXBGb3JtYXR0ZXI9e3RoaXMucHJvcHMubGFiZWxJblRvb2x0aXBGb3JtYXR0ZXJ9XG4gICAgICAgICAgICAgICAgdG9vbHRpcExhYmVscz17dGhpcy5wcm9wcy50b29sdGlwTGFiZWxzfVxuICAgICAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgICAgICBiYXJSYWRpdXM9e2NvbmZpZy5iYXJSYWRpdXN9XG4gICAgICAgICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICAgICAgICBsYWJlbHM9e2xhYmVsc31cbiAgICAgICAgICAgICAgICBiYXJzUmVuZGVyZWQ9e3RoaXMuYmFyc1JlbmRlcmVkfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgIDwvU3ZnPlxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFyQ2hhcnQ7XG4iXX0=
