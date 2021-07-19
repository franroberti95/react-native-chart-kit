import React, { Component } from "react";
import { Defs, Line, LinearGradient, Stop, Text } from "react-native-svg";

import { ChartConfig, Dataset, PartialBy } from "./HelperTypes";

export interface AbstractChartProps {
  fromZero?: boolean;
  fromNumber?: number;
  chartConfig?: AbstractChartConfig;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  yLabelsOffset?: number;
  yAxisInterval?: number;
  xAxisLabel?: string;
  xLabelsOffset?: number;
  hidePointsAtIndex?: number[];
  customYAxis?: boolean;
  toNumber?: number;
  yAxisLineProps?: object;
  smallPaddingRight?: boolean;
  yAxisIntervals?: { color: string; to: number; from: number }[];
  noDecimalsOnTopAndBotValues?: boolean;
  yAxisUnitLabel?: string;
}

export interface AbstractChartConfig extends ChartConfig {
  count?: number;
  data?: Dataset[];
  width?: number;
  height?: number;
  paddingTop?: number;
  paddingRight?: number;
  horizontalLabelRotation?: number;
  formatYLabel?: (yLabel: string) => string;
  labels?: string[];
  horizontalOffset?: number;
  stackedBar?: boolean;
  verticalLabelRotation?: number;
  formatXLabel?: (xLabel: string) => string;
  verticalLabelsHeightPercentage?: number;
  noDecimalsOnTopAndBotValues?: boolean;
}

export type AbstractChartState = {};

export const DEFAULT_X_LABELS_HEIGHT_PERCENTAGE = 0.75;

class AbstractChart<
  IProps extends AbstractChartProps,
  IState extends AbstractChartState
> extends Component<AbstractChartProps & IProps, AbstractChartState & IState> {
  calcScaler = (data: number[]) => {
    if (this.props.fromZero) {
      const toNumber: number[] = [...data, this.props.toNumber || 0];
      return Math.max(...toNumber, 0) - this.props.fromNumber || 1;
    } else if (this.props.fromNumber) {
      return Math.max(...data) - this.props.fromNumber || 1;
    } else {
      return Math.max(...data) - this.props.fromNumber || 1;
    }
  };

  calcBaseHeight = (data: number[], height: number) => {
    const min = this.props.fromNumber
      ? this.props.fromNumber
      : Math.min(...data);
    const max = this.props.toNumber
      ? Math.max(...[...data, this.props.toNumber])
      : Math.max(...data);
    if (min >= 0 && max >= 0) {
      return height;
    } else if (min < 0 && max <= 0) {
      return 0;
    } else if (min < 0 && max > 0) {
      return (height * max) / this.calcScaler(data);
    }
  };

  calcHeight = (val: number, data: number[], height: number) => {
    const max = this.props.toNumber
      ? Math.max(...[...data, this.props.toNumber])
      : Math.max(...data);
    const min = this.props.fromNumber
      ? this.props.fromNumber
      : Math.min(...data);

    if (min < 0 && max > 0) {
      return height * (val / this.calcScaler(data));
    } else if (min >= 0 && max >= 0) {
      return this.props.fromZero
        ? height * (val / this.calcScaler(data))
        : height * ((val - min) / this.calcScaler(data));
    } else if (min < 0 && max <= 0) {
      return this.props.fromZero
        ? height * (val / this.calcScaler(data))
        : height * ((val - max) / this.calcScaler(data));
    }
  };

  getPropsForBackgroundLines() {
    const { propsForBackgroundLines = {} } = this.props.chartConfig;
    return {
      stroke: this.props.chartConfig.color(0.2),
      strokeDasharray: "5, 10",
      strokeWidth: 1,
      ...propsForBackgroundLines
    };
  }

  getPropsForLabels() {
    const {
      propsForLabels = {},
      color,
      labelColor = color
    } = this.props.chartConfig;
    return {
      fontSize: 12,
      fill: labelColor(0.8),
      ...propsForLabels
    };
  }

  getPropsForVerticalLabels() {
    const {
      propsForVerticalLabels = {},
      color,
      labelColor = color
    } = this.props.chartConfig;
    return {
      fill: labelColor(0.8),
      ...propsForVerticalLabels
    };
  }

  getPropsForHorizontalLabels() {
    const {
      propsForHorizontalLabels = {},
      color,
      labelColor = color
    } = this.props.chartConfig;
    return {
      fill: labelColor(0.8),
      ...propsForHorizontalLabels
    };
  }

  renderCustomXAxisLegend = (config: any) => {
    const { paddingTop, paddingRight, customXAxisLegend } = config;
    return customXAxisLegend;
  };

  renderCustomYAxis = (config: any) => {
    const { height, paddingTop, paddingRight, data } = config;

    const { yAxisIntervals, toNumber } = this.props;
    return yAxisIntervals.map((interval, i) => {
      const horizontalAlignment = paddingRight - 8;

      const datas = data.reduce(
        (acc, item) => (item.data ? [...acc, ...item.data] : acc),
        []
      );
      const baseHeight = this.calcBaseHeight(datas, height);
      let start =
        ((baseHeight - this.calcHeight(interval.from, datas, height)) / 4) * 3 +
        paddingTop;

      const isFistInterval = i === 0;
      const isLastInterval = i === yAxisIntervals.length - 1;

      const endValue = isLastInterval
        ? Math.max(...[...datas, interval.to || 0])
        : interval.to;
      const end =
        ((baseHeight - this.calcHeight(endValue, datas, height)) / 4) * 3 +
        paddingTop;
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
      return (
        <Line
          key={Math.random()}
          x1={horizontalAlignment}
          y1={Math.max(Math.min(start, maxGraphHeight), paddingTop) || 0}
          x2={horizontalAlignment}
          y2={Math.max(Math.min(end, maxGraphHeight), paddingTop) || 0}
          stroke={interval.color}
          {...(this.props.yAxisLineProps || {})}
        />
      );
    });
  };

  renderHorizontalLines = config => {
    const {
      count,
      width,
      height,
      paddingTop,
      paddingRight,
      verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE
    } = config;
    const basePosition = height * verticalLabelsHeightPercentage;

    return [...new Array(count + 1)].map((_, i) => {
      const y = (basePosition / count) * i + paddingTop;

      return (
        <Line
          key={Math.random()}
          x1={paddingRight - (this.props.smallPaddingRight ? 8 : 0)}
          y1={y}
          x2={width}
          y2={y}
          {...this.getPropsForBackgroundLines()}
        />
      );
    });
  };

  renderHorizontalLine = config => {
    const {
      width,
      height,
      paddingTop,
      paddingRight,
      verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE
    } = config;
    return (
      <Line
        key={Math.random()}
        x1={paddingRight}
        y1={height * verticalLabelsHeightPercentage + paddingTop}
        x2={width}
        y2={height * verticalLabelsHeightPercentage + paddingTop}
        {...this.getPropsForBackgroundLines()}
      />
    );
  };

  renderHorizontalLabels = (
    config: Omit<AbstractChartConfig, "data"> & { data: number[] }
  ) => {
    const {
      count,
      data,
      height,
      paddingTop,
      paddingRight,
      horizontalLabelRotation = 0,
      decimalPlaces = 2,
      formatYLabel = (yLabel: string) => yLabel,
      verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE,
      noDecimalsOnTopAndBotValues
    } = config;

    const {
      yAxisLabel = "",
      yAxisSuffix = "",
      yLabelsOffset = 12
    } = this.props;
    return new Array(count === 1 ? 1 : count + 1).fill(1).map((_, i) => {
      let yLabel = String(i * count);

      let newDecimalPlaces = decimalPlaces;
      if (
        this.props.noDecimalsOnTopAndBotValues &&
        (i === 0 || i === new Array(count === 1 ? 1 : count + 1).length - 1)
      ) {
        newDecimalPlaces = 0;
      }

      if (count === 1) {
        yLabel = `${yAxisLabel}${formatYLabel(
          //@ts-ignore
          data[0]?.toFixed ? data[0].toFixed(newDecimalPlaces) : data[0]
        )}${yAxisSuffix}`;
      } else {
        const label = this.props.fromZero
          ? (this.calcScaler(data) / count) * i +
            (this.props.fromNumber || Math.min(...data, 0))
          : (this.calcScaler(data) / count) * i +
            (this.props.fromNumber || Math.min(...data));
        yLabel = `${yAxisLabel}${formatYLabel(
          label.toFixed(newDecimalPlaces)
        )}${yAxisSuffix}`;
      }

      const basePosition = height * verticalLabelsHeightPercentage;
      const x = paddingRight - yLabelsOffset + 3;
      const y =
        count === 1 && this.props.fromZero
          ? paddingTop + 4
          : height * verticalLabelsHeightPercentage -
            (basePosition / count) * i +
            paddingTop;

      return (
        <Text
          rotation={horizontalLabelRotation}
          origin={`${x}, ${y}`}
          key={Math.random()}
          x={x}
          textAnchor="end"
          y={y}
          {...this.getPropsForLabels()}
          {...this.getPropsForHorizontalLabels()}
        >
          {yLabel}
        </Text>
      );
    });
  };

  renderYUnitsLabel = config => {
    const {
      count,
      height,
      paddingTop,
      paddingRight,
      verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE
    } = config;
    const { yAxisUnitLabel, yLabelsOffset = 12 } = this.props;
    const x = paddingRight - yLabelsOffset + 3;
    const y =
      count === 1 && this.props.fromZero
        ? paddingTop + 4
        : height * verticalLabelsHeightPercentage + paddingTop;

    return yAxisUnitLabel ? (
      <Text
        origin={`${x}, ${y}`}
        x={x}
        textAnchor="middle"
        y={0}
        {...this.getPropsForLabels()}
        {...this.getPropsForHorizontalLabels()}
      >
        {yAxisUnitLabel}
      </Text>
    ) : null;
  };

  renderVerticalLabels = ({
    labels = [],
    width,
    height,
    paddingRight,
    paddingTop,
    horizontalOffset = 0,
    stackedBar = false,
    verticalLabelRotation = 0,
    formatXLabel = xLabel => xLabel,
    verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE,
    // @ts-ignore
    isBarChart = false
  }: Pick<
    AbstractChartConfig,
    | "labels"
    | "width"
    | "height"
    | "paddingRight"
    | "paddingTop"
    | "horizontalOffset"
    | "stackedBar"
    | "verticalLabelRotation"
    | "formatXLabel"
    | "verticalLabelsHeightPercentage"
  >) => {
    const {
      xAxisLabel = "",
      xLabelsOffset = 0,
      hidePointsAtIndex = []
    } = this.props;

    const fontSize = 12;

    let fac = 1;
    if (stackedBar) {
      fac = 0.71;
    }

    return labels.map((label, i) => {
      //if (hidePointsAtIndex.includes(i)) {
      //  return null;
      //}

      const x =
        (((width - paddingRight - 8) / (labels.length - (isBarChart ? 0 : 1))) *
          i *
          (isBarChart ? 1.013 : 1) +
          paddingRight +
          horizontalOffset) *
        fac;

      const y =
        height * verticalLabelsHeightPercentage +
        paddingTop +
        fontSize * 2 +
        xLabelsOffset;

      return (
        <Text
          origin={`${x}, ${y}`}
          rotation={verticalLabelRotation}
          key={Math.random()}
          x={x}
          y={y}
          textAnchor={verticalLabelRotation === 0 ? "middle" : "start"}
          {...this.getPropsForLabels()}
          {...this.getPropsForVerticalLabels()}
        >
          {`${formatXLabel(label)}${xAxisLabel}`}
        </Text>
      );
    });
  };

  renderVerticalLines = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE
  }: Omit<
    Pick<
      AbstractChartConfig,
      | "data"
      | "width"
      | "height"
      | "paddingRight"
      | "paddingTop"
      | "verticalLabelsHeightPercentage"
    >,
    "data"
  > & { data: number[] }) => {
    const { yAxisInterval = 1 } = this.props;

    return [...new Array(Math.ceil(data.length / yAxisInterval))].map(
      (_, i) => {
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
            {...this.getPropsForBackgroundLines()}
          />
        );
      }
    );
  };

  renderVerticalLine = ({
    height,
    paddingTop,
    paddingRight,
    verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE
  }: Pick<
    AbstractChartConfig,
    "height" | "paddingRight" | "paddingTop" | "verticalLabelsHeightPercentage"
  >) => (
    <Line
      key={Math.random()}
      x1={Math.floor(paddingRight)}
      y1={0}
      x2={Math.floor(paddingRight)}
      y2={height * verticalLabelsHeightPercentage + paddingTop}
      {...this.getPropsForBackgroundLines()}
    />
  );

  renderDefs = (
    config: Pick<
      PartialBy<
        AbstractChartConfig,
        | "backgroundGradientFromOpacity"
        | "backgroundGradientToOpacity"
        | "fillShadowGradient"
        | "fillShadowGradientOpacity"
      >,
      | "width"
      | "height"
      | "backgroundGradientFrom"
      | "backgroundGradientTo"
      | "useShadowColorFromDataset"
      | "data"
      | "backgroundGradientFromOpacity"
      | "backgroundGradientToOpacity"
      | "fillShadowGradient"
      | "fillShadowGradientOpacity"
    >
  ) => {
    const {
      width,
      height,
      backgroundGradientFrom,
      backgroundGradientTo,
      useShadowColorFromDataset,
      data
    } = config;

    const fromOpacity = config.hasOwnProperty("backgroundGradientFromOpacity")
      ? config.backgroundGradientFromOpacity
      : 1.0;
    const toOpacity = config.hasOwnProperty("backgroundGradientToOpacity")
      ? config.backgroundGradientToOpacity
      : 1.0;

    const fillShadowGradient = config.hasOwnProperty("fillShadowGradient")
      ? config.fillShadowGradient
      : this.props.chartConfig.color(1.0);

    const fillShadowGradientOpacity = config.hasOwnProperty(
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
          data.map((dataset, index) => (
            <LinearGradient
              id={`fillShadowGradient_${index}`}
              key={`${index}`}
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
          ))
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
}

export default AbstractChart;
