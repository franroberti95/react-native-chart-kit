import React from "react";
import { Animated, View, ViewStyle } from "react-native";
import {
  Defs,
  G,
  Line,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text
} from "react-native-svg";

import AbstractChart, {
  AbstractChartConfig,
  AbstractChartProps
} from "./AbstractChart";
import { ChartData } from "./HelperTypes";

const barWidth = 32;

export interface BarChartProps extends AbstractChartProps {
  data: ChartData;
  width: number;
  height: number;
  fromZero?: boolean;
  withInnerLines?: boolean;
  yAxisLabel: string;
  yAxisSuffix: string;
  chartConfig: AbstractChartConfig;
  style?: Partial<ViewStyle>;
  horizontalLabelRotation?: number;
  verticalLabelRotation?: number;
  /**
   * Show vertical labels - default: True.
   */
  withVerticalLabels?: boolean;
  /**
   * Show horizontal labels - default: True.
   */
  withHorizontalLabels?: boolean;
  /**
   * The number of horizontal lines
   */
  segments?: number;
  showBarTops?: boolean;
  showValuesOnTopOfBars?: boolean;
  withCustomBarColorFromData?: boolean;
  flatColor?: boolean;
  transparent?: boolean;
  showBarInfoOnTouch?: boolean;
  dotInfoModalProps?: any;
  labels?: string[];
  labelInTooltipFormatter?: (label: string) => string;
  tooltipLabels?: string[];
}

const differenceBetween = (num1: number, num2: number) =>
  Math.abs(Math.abs(num1) - Math.abs(num2));

const _recursiveFindBar = (needle, haystack, start, end, currentIndex) => {
  // Base Condition
  if (start > end) return currentIndex;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);
  let newCurrentIndex =
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

const recursiveFindBar = (
  needle: Animated.Value,
  haystack: { index: number; value: number; x: number; y: number }[]
) => {
  return _recursiveFindBar(
    // @ts-ignore
    needle,
    haystack,
    0,
    haystack.length,
    Math.floor(haystack.length / 2)
  );
};

class DotInfoGroup extends React.Component<any, any> {
  render() {
    const {
      dotInfoModalProps,
      touchMoveXCoords,
      touchMoveYCoords,
      calcBaseHeight,
      fromNumber,
      calcHeight,
      paddingTop,
      height,
      data,
      paddingRight,
      barsRendered,
      barRadius,
      width,
      labelInTooltipFormatter,
      tooltipLabels
    } = this.props;

    const { units } = dotInfoModalProps || {};

    if (touchMoveXCoords < 0 || !data) return null;

    const baseHeight = calcBaseHeight(data, height);

    const maxGraphHeight =
      ((baseHeight -
        calcHeight(fromNumber || Math.min(...data), data, height)) /
        4) *
        3 +
      paddingTop;
    const x = touchMoveXCoords;
    /** Get index of the closest x element **/
    const index = recursiveFindBar(x, barsRendered);
    if (!barsRendered[index]) return null;
    const dotX = barsRendered[index].x;
    const dotY = barsRendered[index].y;
    const barWidth = barsRendered[index].barWidth;
    const rectHeight = barsRendered[index].height;
    let infoTextGoesOnTop = true;
    if ((touchMoveYCoords < dotY && dotY < maxGraphHeight - 25) || dotY < 50) {
      infoTextGoesOnTop = false;
    }
    const tooltipLabel = tooltipLabels
      ? tooltipLabels[index]
      : (data?.labels[index] &&
          labelInTooltipFormatter &&
          labelInTooltipFormatter(data?.labels[index])) ||
        data?.labels[index];

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
          x={Math.min(Math.max(dotX, paddingRight + 40), width - 45)}
          fill="black"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          {barsRendered[index].value + " " + (units || "")}
        </Text>
        <Text
          y={dotY + (infoTextGoesOnTop ? -15 : 39)}
          x={Math.min(Math.max(dotX, paddingRight + 40), width - 45)}
          fill="black"
          fontSize="8"
          textAnchor="middle"
        >
          {tooltipLabel}
        </Text>
      </G>
    );
  }
}

const AnimatedDotInfoGroup = Animated.createAnimatedComponent(DotInfoGroup);

type BarChartState = {
  touchMoveXCoords: Animated.Value;
  touchMoveYCoords: Animated.Value;
};

class BarChart extends AbstractChart<BarChartProps, BarChartState> {
  state = {
    touchMoveXCoords: new Animated.Value(-1),
    touchMoveYCoords: new Animated.Value(-1)
  };

  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  barsRendered = [];

  renderBars = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    barRadius,
    withCustomBarColorFromData
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop" | "barRadius"
  > & {
    data: number[];
    withCustomBarColorFromData: boolean;
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);
    this.barsRendered = [];
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();

      const rectX =
        paddingRight +
        (i * (width - paddingRight)) / data.length +
        barWidth / 2;
      const y =
        ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
        paddingTop;

      const rectHeight = (Math.abs(barHeight) / 4) * 3;

      this.barsRendered.push({
        index: i,
        value: x,
        x: rectX,
        y,
        barWidth,
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
              ? `url(#customColor_0_${i})`
              : "url(#fillShadowGradient)"
          }
        />
      );
    });
  };

  renderBarTops = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    withCustomBarColorFromData
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
    withCustomBarColorFromData?: boolean;
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);

    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      return (
        <Rect
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2
          }
          y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
          width={barWidth}
          height={1}
          fill={
            withCustomBarColorFromData
              ? `url(#customColor_0_${i})`
              : this.props.chartConfig.color(0.6)
          }
        />
      );
    });
  };

  renderColors = ({
    data,
    flatColor
  }: Pick<AbstractChartConfig, "data"> & {
    flatColor: boolean;
  }) => {
    return data.map((dataset, index) => (
      <Defs key={dataset.key ?? index}>
        {dataset.colors?.map((color, colorIndex) => {
          const highOpacityColor = color(1.0);
          const lowOpacityColor = color(0.1);

          return (
            <LinearGradient
              id={`customColor_${index}_${colorIndex}`}
              key={`${index}_${colorIndex}`}
              x1={0}
              y1={0}
              x2={0}
              y2={1}
            >
              <Stop offset="0" stopColor={highOpacityColor} stopOpacity="1" />
              {flatColor ? (
                <Stop offset="1" stopColor={highOpacityColor} stopOpacity="1" />
              ) : (
                <Stop offset="1" stopColor={lowOpacityColor} stopOpacity="0" />
              )}
            </LinearGradient>
          );
        })}
      </Defs>
    ));
  };

  renderValuesOnTopOfBars = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);

    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      return (
        <Text
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 1
          }
          y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 1}
          fill={this.props.chartConfig.color(0.6)}
          fontSize="12"
          textAnchor="middle"
        >
          {data[i]}
        </Text>
      );
    });
  };

  timeout = null;
  onTouchEnd = () => {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.state.touchMoveXCoords.setValue(-1);
      this.state.touchMoveYCoords.setValue(-1);
    }, 1000);
  };
  onTouchMove = e => {
    if (this.timeout) clearTimeout(this.timeout);
    this.state.touchMoveXCoords.setValue(e.nativeEvent.locationX);
    this.state.touchMoveYCoords.setValue(e.nativeEvent.locationY);
  };

  render() {
    const {
      width,
      height,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withInnerLines = true,
      showBarTops = true,
      withCustomBarColorFromData = false,
      showValuesOnTopOfBars = false,
      flatColor = false,
      segments = 4,
      transparent = false,
      showBarInfoOnTouch,
      labels
    } = this.props;

    const { borderRadius = 0, paddingTop = 16, paddingRight = 46 } = style;

    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation,
      barRadius:
        (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      decimalPlaces:
        (this.props.chartConfig && this.props.chartConfig.decimalPlaces) ?? 2,
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
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          {this.renderColors({
            ...this.props.chartConfig,
            flatColor: flatColor,
            data: this.props.data.datasets
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill={transparent ? "transparent" : "url(#backgroundGradient)"}
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines({
                  ...config,
                  count: segments,
                  paddingTop,
                  paddingRight
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: segments,
                  data: data.datasets[0].data,
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  // @ts-ignore
                  isBarChart: true,
                  paddingRight: paddingRight as number,
                  paddingTop: paddingTop as number,
                  horizontalOffset: barWidth * this.getBarPercentage()
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
              paddingTop: paddingTop as number,
              paddingRight: paddingRight as number,
              withCustomBarColorFromData: withCustomBarColorFromData
            })}
          </G>
          <G>
            {showValuesOnTopOfBars &&
              this.renderValuesOnTopOfBars({
                ...config,
                data: data.datasets[0].data,
                paddingTop: paddingTop as number,
                paddingRight: paddingRight as number
              })}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops({
                ...config,
                data: data.datasets[0].data,
                paddingTop: paddingTop as number,
                paddingRight: paddingRight as number,
                withCustomBarColorFromData
              })}
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
  }
}

export default BarChart;
