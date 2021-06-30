import React, { ReactNode, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  ViewStyle
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

import AbstractChart, {
  AbstractChartConfig,
  AbstractChartProps
} from "../AbstractChart";
import { ChartData, Dataset } from "../HelperTypes";
import { LegendItem } from "./LegendItem";

let AnimatedCircle = Animated.createAnimatedComponent(Circle);

const differenceBetween = (num1: number, num2: number) =>
  Math.abs(Math.abs(num1) - Math.abs(num2));

const _recursiveFindDot = (
  needle: number,
  haystack,
  start,
  end,
  currentIndex
) => {
  // Base Condition
  if (start > end) return currentIndex;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);
  let newCurrentIndex =
    haystack[mid] &&
    differenceBetween(haystack[mid].x, needle) <
      differenceBetween(haystack[currentIndex].x, needle)
      ? mid
      : currentIndex;

  if (haystack.length === 1) return newCurrentIndex;

  // If element at mid is greater than x,
  // search in the left half of mid
  if (haystack[mid].x > needle)
    return _recursiveFindDot(needle, haystack, start, mid - 1, newCurrentIndex);
  // If element at mid is smaller than x,
  // search in the right half of mid
  else
    return _recursiveFindDot(needle, haystack, mid + 1, end, newCurrentIndex);
};

const recursiveFindDot = (
  needle: number,
  haystack: { index: number; value: number; x: number; y: number }[]
) => {
  return _recursiveFindDot(
    needle,
    haystack,
    0,
    haystack.length,
    Math.floor(haystack.length / 2)
  );
};

export interface LineChartData extends ChartData {
  legend?: string[];
}

export interface LineChartProps extends AbstractChartProps {
  /**
   * Data for the chart.
   *
   * Example from [docs](https://github.com/indiespirit/react-native-chart-kit#line-chart):
   *
   * ```javascript
   * const data = {
   *   labels: ['January', 'February', 'March', 'April', 'May', 'June'],
   *   datasets: [{
   *     data: [ 20, 45, 28, 80, 99, 43 ],
   *     color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
   *     strokeWidth: 2 // optional
   *   }],
   *   legend: ["Rainy Days", "Sunny Days", "Snowy Days"] // optional
   * }
   * ```
   */
  data: LineChartData;
  /**
   * Width of the chart, use 'Dimensions' library to get the width of your screen for responsive.
   */
  width: number;
  /**
   * Height of the chart.
   */
  height: number;
  /**
   * Show dots on the line - default: True.
   */
  withDots?: boolean;
  /**
   * Show shadow for line - default: True.
   */
  withShadow?: boolean;
  /**
   * Show inner dashed lines - default: True.
   */

  withScrollableDot?: boolean;
  withInnerLines?: boolean;
  /**
   * Show outer dashed lines - default: True.
   */
  withOuterLines?: boolean;
  /**
   * Show vertical lines - default: True.
   */
  withVerticalLines?: boolean;
  /**
   * Show horizontal lines - default: True.
   */
  withHorizontalLines?: boolean;
  /**
   * Show vertical labels - default: True.
   */
  withVerticalLabels?: boolean;
  /**
   * Show a custom Y axis
   */
  withCustomYAxis?: boolean;
  /**
   * Show horizontal labels - default: True.
   */
  withHorizontalLabels?: boolean;
  /**
   * Render charts from 0 not from the minimum value. - default: False.
   */
  fromZero?: boolean;
  /**
   * Prepend text to horizontal labels -- default: ''.
   */
  yAxisLabel?: string;
  /**
   * Append text to horizontal labels -- default: ''.
   */
  yAxisSuffix?: string;
  /**
   * Prepend text to vertical labels -- default: ''.
   */
  xAxisLabel?: string;
  /*
   * customXAxisLegend
   *
   * */
  customXAxisLegend?: string;
  /**
   * Configuration object for the chart, see example:
   *
   * ```javascript
   * const chartConfig = {
   *   backgroundGradientFrom: "#1E2923",
   *   backgroundGradientFromOpacity: 0,
   *   backgroundGradientTo: "#08130D",
   *   backgroundGradientToOpacity: 0.5,
   *   color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
   *   labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
   *   strokeWidth: 2, // optional, default 3
   *   barPercentage: 0.5
   * };
   * ```
   */
  chartConfig?: AbstractChartConfig;

  /**
   * Divide axis quantity by the input number -- default: 1.
   */
  yAxisInterval?: number;

  /**
   * Defines if chart is transparent
   */
  transparent?: boolean;
  /**
   * This function takes a [whole bunch](https://github.com/indiespirit/react-native-chart-kit/blob/master/src/line-chart.js#L266)
   * of stuff and can render extra elements,
   * such as data point info or additional markup.
   */
  decorator?: Function;
  /**
   * Callback that is called when a data point is clicked.
   */
  onDataPointClick?: (data: {
    index: number;
    value: number;
    dataset: Dataset;
    x: number;
    y: number;
    getColor: (opacity: number) => string;
  }) => void;
  /**
   * Style of the container view of the chart.
   */
  style?: Partial<ViewStyle>;
  /**
   * Add this prop to make the line chart smooth and curvy.
   *
   * [Example](https://github.com/indiespirit/react-native-chart-kit#bezier-line-chart)
   */
  bezier?: boolean;
  /**
   * Defines the dot color function that is used to calculate colors of dots in a line chart.
   * Takes `(dataPoint, dataPointIndex)` as arguments.
   */
  getDotColor?: (dataPoint: any, index: number) => string;
  /**
   * Renders additional content for dots in a line chart.
   * Takes `({x, y, index})` as arguments.
   */
  renderDotContent?: (params: {
    x: number;
    y: number;
    index: number;
    indexData: number;
  }) => React.ReactNode;
  /**
   * Rotation angle of the horizontal labels - default 0 (degrees).
   */
  horizontalLabelRotation?: number;
  /**
   * Rotation angle of the vertical labels - default 0 (degrees).
   */
  verticalLabelRotation?: number;
  /**
   * Offset for Y axis labels.
   */
  yLabelsOffset?: number;
  /**
   * Offset for X axis labels.
   */
  xLabelsOffset?: number;
  /**
   * Array of indices of the data points you don't want to display.
   */
  hidePointsAtIndex?: number[];
  /**
   * This function change the format of the display value of the Y label.
   * Takes the y value as argument and should return the desirable string.
   */
  formatYLabel?: (yValue: string) => string;
  /**
   * This function change the format of the display value of the X label.
   * Takes the X value as argument and should return the desirable string.
   */
  formatXLabel?: (xValue: string) => string;
  /**
   * Provide props for a data point dot.
   */
  getDotProps?: (dataPoint: any, index: number) => object;
  /**
   * The number of horizontal lines
   */
  segments?: number;
  hideLineAtIndex?: number[];
  /*
   * shows dot info on touch event
   * */
  showDotInfoOnTouch?: boolean;
}

type LineChartState = {
  scrollableDotHorizontalOffset: Animated.Value;
  touchMoveCoords: { x: number; y: number } | null;
};

class LineChart extends AbstractChart<LineChartProps, LineChartState> {
  label = React.createRef<TextInput>();

  state = {
    scrollableDotHorizontalOffset: new Animated.Value(0),
    touchMoveCoords: null
  };

  getColor = (dataset: Dataset, opacity: number) => {
    return (dataset.color || this.props.chartConfig.color)(opacity);
  };

  getStrokeWidth = (dataset: Dataset) => {
    return dataset.strokeWidth || this.props.chartConfig.strokeWidth || 3;
  };

  getDatas = (data: Dataset[]): number[] => {
    return data.reduce(
      (acc, item) => (item.data ? [...acc, ...item.data] : acc),
      []
    );
  };

  getPropsForDots = (x: any, i: number) => {
    const { getDotProps, chartConfig } = this.props;

    if (typeof getDotProps === "function") {
      return getDotProps(x, i);
    }

    const { propsForDots = {} } = chartConfig;

    return { r: "4", ...propsForDots };
  };

  renderDotInfo = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    onDataPointClick
  }: any) => {
    if (
      !this.state.touchMoveCoords ||
      !this.dotsRendered ||
      !this.dotsRendered.length
    )
      return null;
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);

    const maxGraphHeight =
      ((baseHeight -
        this.calcHeight(
          this.props.fromNumber || Math.min(...datas),
          datas,
          height
        )) /
        4) *
        3 +
      paddingTop;
    const { x, y } = this.state.touchMoveCoords;
    /** Merge Datasets **/
    const mergedDots = [].concat.apply([], this.dotsRendered);
    /** Get index of the closest x element **/
    const index = recursiveFindDot(x, mergedDots);
    const lineX = mergedDots[index].x;
    const y1 = 0;
    const y2 = height;

    return (
      <G>
        <Rect
          y={mergedDots[index].y + 10}
          x={lineX}
          width={50}
          height={25}
          fill="white"
          rx={12}
          ry={12}
        />
        <Text
          y={mergedDots[index].y + 28}
          x={lineX + 24}
          fill="black"
          fontSize="16"
          fontWeight="normal"
          textAnchor="middle"
        >
          {mergedDots[index].value}
        </Text>
        <Line
          key={Math.random()}
          x1={lineX}
          y1={maxGraphHeight}
          x2={lineX}
          y2={0}
          stroke={"white"}
          strokeWidth={2}
        />
      </G>
    );
  };

  dotsRendered = [];

  renderDots = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    onDataPointClick
  }: Pick<
    AbstractChartConfig,
    "data" | "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    onDataPointClick: LineChartProps["onDataPointClick"];
  }) => {
    const output: ReactNode[] = [];
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);

    const {
      getDotColor,
      hidePointsAtIndex = [],
      renderDotContent = () => {
        return null;
      }
    } = this.props;

    data.forEach((dataset, datasetIndex) => {
      if (dataset.withDots == false) return;
      const datasetDots = [];
      dataset.data.forEach((x, i) => {
        if (hidePointsAtIndex.includes(i)) {
          return;
        }

        const cx =
          paddingRight +
          (i * (width - paddingRight - 8)) / (dataset.data.length - 1);

        const cy =
          ((baseHeight - this.calcHeight(x, datas, height)) / 4) * 3 +
          paddingTop;

        datasetDots.push({
          index: i,
          value: x,
          x: cx,
          y: cy
        });

        const onPress = () => {
          if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
            return;
          }

          onDataPointClick({
            index: i,
            value: x,
            dataset,
            x: cx,
            y: cy,
            getColor: opacity => this.getColor(dataset, opacity)
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
                : this.getColor(dataset, 0.9)
            }
            onPress={onPress}
            {...this.getPropsForDots(x, i)}
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
      this.dotsRendered[datasetIndex] = datasetDots;
    });

    return output;
  };

  renderScrollableDot = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    scrollableDotHorizontalOffset,
    scrollableDotFill,
    scrollableDotStrokeColor,
    scrollableDotStrokeWidth,
    scrollableDotRadius,
    scrollableInfoViewStyle,
    scrollableInfoTextStyle,
    scrollableInfoTextDecorator = x => `${x}`,
    scrollableInfoSize,
    scrollableInfoOffset
  }: AbstractChartConfig & {
    onDataPointClick: LineChartProps["onDataPointClick"];
    scrollableDotHorizontalOffset: Animated.Value;
  }) => {
    const output = [];
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);

    let vl: number[] = [];

    const perData = width / data[0].data.length;
    for (let index = 0; index < data[0].data.length; index++) {
      vl.push(index * perData);
    }
    let lastIndex: number;

    scrollableDotHorizontalOffset.addListener(value => {
      const index = value.value / perData;
      if (!lastIndex) {
        lastIndex = index;
      }

      let abs = Math.floor(index);
      let percent = index - abs;
      abs = data[0].data.length - abs - 1;

      if (index >= data[0].data.length - 1) {
        this.label.current.setNativeProps({
          text: scrollableInfoTextDecorator(Math.floor(data[0].data[0]))
        });
      } else {
        if (index > lastIndex) {
          // to right

          const base = data[0].data[abs];
          const prev = data[0].data[abs - 1];
          if (prev > base) {
            let rest = prev - base;
            this.label.current.setNativeProps({
              text: scrollableInfoTextDecorator(
                Math.floor(base + percent * rest)
              )
            });
          } else {
            let rest = base - prev;
            this.label.current.setNativeProps({
              text: scrollableInfoTextDecorator(
                Math.floor(base - percent * rest)
              )
            });
          }
        } else {
          // to left

          const base = data[0].data[abs - 1];
          const next = data[0].data[abs];
          percent = 1 - percent;
          if (next > base) {
            let rest = next - base;
            this.label.current.setNativeProps({
              text: scrollableInfoTextDecorator(
                Math.floor(base + percent * rest)
              )
            });
          } else {
            let rest = base - next;
            this.label.current.setNativeProps({
              text: scrollableInfoTextDecorator(
                Math.floor(base - percent * rest)
              )
            });
          }
        }
      }
      lastIndex = index;
    });

    data.forEach(dataset => {
      if (dataset.withScrollableDot == false) return;

      const perData = width / dataset.data.length;
      let values = [];
      let yValues = [];
      let xValues = [];

      let yValuesLabel = [];
      let xValuesLabel = [];

      for (let index = 0; index < dataset.data.length; index++) {
        values.push(index * perData);
        const yval =
          ((baseHeight -
            this.calcHeight(
              dataset.data[dataset.data.length - index - 1],
              datas,
              height
            )) /
            4) *
            3 +
          paddingTop;
        yValues.push(yval);
        const xval =
          paddingRight +
          ((dataset.data.length - index - 1) * (width - paddingRight)) /
            dataset.data.length;
        xValues.push(xval);

        yValuesLabel.push(
          yval - (scrollableInfoSize.height + scrollableInfoOffset)
        );
        xValuesLabel.push(xval - scrollableInfoSize.width / 2);
      }

      const translateX = scrollableDotHorizontalOffset.interpolate({
        inputRange: values,
        outputRange: xValues,
        extrapolate: "clamp"
      });

      const translateY = scrollableDotHorizontalOffset.interpolate({
        inputRange: values,
        outputRange: yValues,
        extrapolate: "clamp"
      });

      const labelTranslateX = scrollableDotHorizontalOffset.interpolate({
        inputRange: values,
        outputRange: xValuesLabel,
        extrapolate: "clamp"
      });

      const labelTranslateY = scrollableDotHorizontalOffset.interpolate({
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
            onLayout={() => {
              this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(data[0].data[data[0].data.length - 1])
                )
              });
            }}
            style={scrollableInfoTextStyle}
            ref={this.label}
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

  renderShadow = ({
    width,
    height,
    paddingRight,
    paddingTop,
    data,
    useColorFromDataset
  }: Pick<
    AbstractChartConfig,
    "data" | "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    useColorFromDataset: AbstractChartConfig["useShadowColorFromDataset"];
  }) => {
    if (this.props.bezier) {
      return this.renderBezierShadow({
        width,
        height,
        paddingRight,
        paddingTop,
        data,
        useColorFromDataset
      });
    }

    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);

    return data.map((dataset, index) => {
      return (
        <Polygon
          key={index}
          points={
            dataset.data
              .map((d, i) => {
                const x =
                  paddingRight +
                  (i * (width - paddingRight - 8)) / dataset.data.length;

                const y =
                  ((baseHeight - this.calcHeight(d, datas, height)) / 4) * 3 +
                  paddingTop;

                return `${x},${y}`;
              })
              .join(" ") +
            ` ${paddingRight +
              ((width - paddingRight) / dataset.data.length) *
                (dataset.data.length - 1)},${(height / 4) * 3 +
              paddingTop} ${paddingRight},${(height / 4) * 3 + paddingTop}`
          }
          fill={`url(#fillShadowGradient${
            useColorFromDataset ? `_${index}` : ""
          })`}
          strokeWidth={0}
        />
      );
    });
  };

  renderLine = ({
    width,
    height,
    paddingRight,
    paddingTop,
    data,
    linejoinType
  }: Pick<
    AbstractChartConfig,
    "data" | "width" | "height" | "paddingRight" | "paddingTop" | "linejoinType"
  >) => {
    if (this.props.bezier) {
      return this.renderBezierLine({
        data,
        width,
        height,
        paddingRight,
        paddingTop
      });
    }

    const output = [];
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);

    let lastPoint: string;

    data.forEach((dataset, index) => {
      const { hideLineAtIndex } = this.props;
      const lineData = hideLineAtIndex
        ? dataset.data.filter((_, i) => !hideLineAtIndex.includes(i))
        : dataset.data;
      const points = lineData.map((d, i) => {
        if (d === null) return lastPoint;
        const x =
          (i * (width - paddingRight - 8)) / (dataset.data.length - 1) +
          paddingRight;
        const y =
          ((baseHeight - this.calcHeight(d, datas, height)) / 4) * 3 +
          paddingTop;
        lastPoint = `${x},${y}`;
        return `${x},${y}`;
      });

      output.push(
        <Polyline
          key={index}
          strokeLinejoin={linejoinType}
          points={points.join(" ")}
          fill="none"
          stroke={this.getColor(dataset, 0.2)}
          strokeWidth={this.getStrokeWidth(dataset)}
          strokeDasharray={dataset.strokeDashArray}
          strokeDashoffset={dataset.strokeDashOffset}
        />
      );
    });

    return output;
  };

  getBezierLinePoints = (
    dataset: Dataset,
    {
      width,
      height,
      paddingRight,
      paddingTop,
      data
    }: Pick<
      AbstractChartConfig,
      "width" | "height" | "paddingRight" | "paddingTop" | "data"
    >
  ) => {
    if (dataset.data.length === 0) {
      return "M0,0";
    }

    const datas = this.getDatas(data);

    const x = (i: number) =>
      Math.floor(
        paddingRight +
          (i * (width - paddingRight - 8)) / (dataset.data.length - 1)
      );

    const baseHeight = this.calcBaseHeight(datas, height);

    const y = (i: number) => {
      const yHeight = this.calcHeight(dataset.data[i], datas, height);

      return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
    };

    const { hideLineAtIndex } = this.props;
    const firstIndexWithData = dataset.data.findIndex(
      (item, index) => !hideLineAtIndex.includes(index) && item !== null
    );
    if (firstIndexWithData < 0) return "";
    const startX = x(firstIndexWithData);
    const startY = y(firstIndexWithData);

    if (!startX || !startY) return "";

    return [`M${startX},${startY}`]
      .concat(
        dataset.data.slice(0, -1).map((_, i) => {
          if (hideLineAtIndex && hideLineAtIndex.includes(i)) return "";

          const x_mid = (x(i) + x(i + 1)) / 2;
          const y_mid = (y(i) + y(i + 1)) / 2;
          const cp_x1 = (x_mid + x(i)) / 2;
          const cp_x2 = (x_mid + x(i + 1)) / 2;
          return (
            `Q ${cp_x1}, ${y(i)}, ${x_mid}, ${y_mid}` +
            ` Q ${cp_x2}, ${y(i + 1)}, ${x(i + 1)}, ${y(i + 1)}`
          );
        })
      )
      .join(" ");
  };

  renderBezierLine = ({
    data,
    width,
    height,
    paddingRight,
    paddingTop
  }: Pick<
    AbstractChartConfig,
    "data" | "width" | "height" | "paddingRight" | "paddingTop"
  >) => {
    return data.map((dataset, index) => {
      const result = this.getBezierLinePoints(dataset, {
        width,
        height,
        paddingRight,
        paddingTop,
        data
      });

      return (
        <Path
          key={index}
          d={result}
          fill="none"
          stroke={this.getColor(dataset, 0.2)}
          strokeWidth={this.getStrokeWidth(dataset)}
          strokeDasharray={dataset.strokeDashArray}
          strokeDashoffset={dataset.strokeDashOffset}
        />
      );
    });
  };

  renderBezierShadow = ({
    width,
    height,
    paddingRight,
    paddingTop,
    data,
    useColorFromDataset
  }: Pick<
    AbstractChartConfig,
    "data" | "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    useColorFromDataset: AbstractChartConfig["useShadowColorFromDataset"];
  }) =>
    data.map((dataset, index) => {
      const d =
        this.getBezierLinePoints(dataset, {
          width,
          height,
          paddingRight,
          paddingTop,
          data
        }) +
        ` L${paddingRight +
          ((width - paddingRight) / (dataset.data.length - 1)) *
            (dataset.data.length - 1)},${(height / 4) * 3 +
          paddingTop} L${paddingRight},${(height / 4) * 3 + paddingTop} Z`;

      return (
        <Path
          key={index}
          d={d}
          fill={`url(#fillShadowGradient${
            useColorFromDataset ? `_${index}` : ""
          })`}
          strokeWidth={0}
        />
      );
    });

  renderLegend = (width, legendOffset) => {
    const { legend, datasets } = this.props.data;
    const baseLegendItemX = width / (legend.length + 1);

    return legend.map((legendItem, i) => (
      <G key={Math.random()}>
        <LegendItem
          index={i}
          iconColor={this.getColor(datasets[i], 0.9)}
          baseLegendItemX={baseLegendItemX}
          legendText={legendItem}
          labelProps={{ ...this.getPropsForLabels() }}
          legendOffset={legendOffset}
        />
      </G>
    ));
  };

  render() {
    const {
      width,
      height,
      data,
      withScrollableDot = false,
      withShadow = true,
      withDots = true,
      withInnerLines = true,
      withOuterLines = true,
      withHorizontalLines = true,
      withVerticalLines = true,
      withCustomYAxis = false,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      style = {},
      decorator,
      onDataPointClick,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      formatYLabel = yLabel => yLabel,
      formatXLabel = xLabel => xLabel,
      segments,
      transparent = false,
      chartConfig,
      showDotInfoOnTouch
    } = this.props;

    const { scrollableDotHorizontalOffset } = this.state;
    const { labels = [] } = data;
    const {
      borderRadius = 0,
      paddingTop = 16,
      paddingRight = 50,
      margin = 0,
      marginRight = 0,
      paddingBottom = 0
    } = style;

    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation
    };

    const datas = this.getDatas(data.datasets);

    let count = Math.min(...datas) === Math.max(...datas) ? 1 : 4;
    if (segments) {
      count = segments;
    }

    const legendOffset = this.props.data.legend ? height * 0.15 : 0;
    return (
      <View style={style}>
        <Svg
          height={height + (paddingBottom as number) + legendOffset}
          width={width - (margin as number) * 2 - (marginRight as number) + 15}
          onTouchMove={e =>
            this.setState({
              touchMoveCoords: {
                y: e.nativeEvent.locationY,
                x: e.nativeEvent.locationX
              }
            })
          }
          onTouchEnd={() => this.setState({ touchMoveCoords: null })}
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
            {this.renderDefs({
              ...config,
              ...chartConfig,
              data: data.datasets
            })}
            <G>
              {withHorizontalLines &&
                (withInnerLines
                  ? this.renderHorizontalLines({
                      ...config,
                      count: count,
                      paddingTop,
                      paddingRight
                    })
                  : withOuterLines
                  ? this.renderHorizontalLine({
                      ...config,
                      paddingTop,
                      paddingRight
                    })
                  : null)}
            </G>
            <G>
              {withHorizontalLabels &&
                this.renderHorizontalLabels({
                  ...config,
                  count: count,
                  data: datas,
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number,
                  formatYLabel,
                  decimalPlaces: chartConfig.decimalPlaces
                })}
            </G>
            <G>
              {withCustomYAxis &&
                this.renderCustomYAxis({
                  ...config,
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number,
                  data: data.datasets
                })}
            </G>
            <G>
              {this.props.customXAxisLegend &&
                this.renderCustomXAxisLegend({
                  paddingTop: paddingTop as number,
                  customXAxisLegend: this.props.customXAxisLegend
                })}
            </G>
            <G>
              {withVerticalLines &&
                (withInnerLines
                  ? this.renderVerticalLines({
                      ...config,
                      data: data.datasets[0].data,
                      paddingTop: paddingTop as number,
                      paddingRight: paddingRight as number
                    })
                  : withOuterLines
                  ? this.renderVerticalLine({
                      ...config,
                      paddingTop: paddingTop as number,
                      paddingRight: paddingRight as number
                    })
                  : null)}
            </G>
            <G>
              {withVerticalLabels &&
                this.renderVerticalLabels({
                  ...config,
                  labels,
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number,
                  formatXLabel
                })}
            </G>
            <G>
              {this.renderLine({
                ...config,
                ...chartConfig,
                paddingRight: paddingRight as number,
                paddingTop: paddingTop as number,
                data: data.datasets
              })}
            </G>
            <G>
              {withShadow &&
                this.renderShadow({
                  ...config,
                  data: data.datasets,
                  paddingRight: paddingRight as number,
                  paddingTop: paddingTop as number,
                  useColorFromDataset: chartConfig.useShadowColorFromDataset
                })}
            </G>
            <G>
              {withDots &&
                this.renderDots({
                  ...config,
                  data: data.datasets,
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number,
                  onDataPointClick
                })}
            </G>
            <G>
              {showDotInfoOnTouch &&
                this.renderDotInfo({
                  ...config,
                  touchCoords: {},
                  data: data.datasets,
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number
                })}
            </G>
            <G>
              {withScrollableDot &&
                this.renderScrollableDot({
                  ...config,
                  ...chartConfig,
                  data: data.datasets,
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number,
                  onDataPointClick,
                  scrollableDotHorizontalOffset
                })}
            </G>
            <G>
              {decorator &&
                decorator({
                  ...config,
                  data: data.datasets,
                  paddingTop,
                  paddingRight
                })}
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
  }
}

export default LineChart;
