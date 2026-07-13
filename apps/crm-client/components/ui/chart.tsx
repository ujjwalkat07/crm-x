"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { [key: string]: { label?: React.ReactNode; icon?: React.ComponentType; color?: string } }
export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<string, string>;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    config: ChartConfig;
    children: React.ComponentPropsWithoutRef<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, config, children, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        style={
          {
            ...Object.entries(config).reduce<Record<string, any>>(
              (acc, [key, item]) => {
                if (item.color) {
                  acc[`--color-${key}`] = item.color;
                }
                return acc;
              },
              {},
            ),
          } as React.CSSProperties
        }
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-grid-horizontal_line]:stroke-border/50 [&_.recharts-cartesian-grid-vertical_line]:stroke-border/50 [&_.recharts-curve.recharts-area]:fill-opacity-10 [&_.recharts-dot]:stroke-background [&_.recharts-grid-line]:stroke-border/50 [&_.recharts-interactive-grid-line]:stroke-border/50 [&_.recharts-label]:fill-foreground [&_.recharts-legend-item-text]:!text-foreground [&_.recharts-reference-line_line]:stroke-border [&_.recharts-sector]:stroke-background [&_.recharts-surface]:overflow-visible [&_.recharts-tooltip-cursor]:stroke-border [&_.recharts-yAxis_line]:stroke-transparent [&_.recharts-xAxis_line]:stroke-transparent",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, item]) => item.theme || item.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .map(([key, item]) => {
            const color = item.color;
            return color
              ? `[data-chart="${id}"] { --color-${key}: ${color}; }`
              : "";
          })
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

interface ChartTooltipContentProps {
  className?: string;
  active?: boolean;
  payload?: any[];
  label?: any;
  labelFormatter?: any;
  labelClassName?: string;
  formatter?: any;
  color?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  config?: ChartConfig;
  nameKey?: string;
  labelKey?: string;
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      className,
      active,
      payload,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      config: customConfig,
      nameKey,
      labelKey,
      ...props
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipConfig = customConfig || config;

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "line";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs shadow-xl backdrop-blur-md",
          className,
        )}
      >
        {!nestLabel && !hideLabel ? (
          <div className={cn("font-medium text-foreground", labelClassName)}>
            {label}
          </div>
        ) : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = tooltipConfig[key];
            const name = itemConfig?.label || item.name;

            return (
              <div
                key={item.dataKey || index}
                className={cn(
                  "flex w-full items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "line" && "items-start",
                )}
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      "shrink-0 rounded-[2px]",
                      indicator === "dot" && "h-2 w-2",
                      indicator === "line" && "w-0.5",
                      indicator === "dashed" && "border-t border-dashed",
                    )}
                    style={{
                      backgroundColor: item.color || item.payload?.fill,
                    }}
                  />
                )}
                <div className="flex flex-1 justify-between leading-none">
                  <div className="grid gap-1.5">
                    <span className="text-muted-foreground">{name}</span>
                  </div>
                  {item.value !== undefined && (
                    <span className="font-mono font-medium text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

interface ChartLegendContentProps {
  className?: string;
  hideIcon?: boolean;
  payload?: any[];
  verticalAlign?: "top" | "bottom";
  nameKey?: string;
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(({ className, hideIcon = false, payload, verticalAlign, nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = config[key];

        return (
          <div
            key={item.value}
            className="flex items-center gap-1.5 text-xs text-muted-foreground [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {!hideIcon && itemConfig?.icon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
