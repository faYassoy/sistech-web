"use client"

import * as React from "react";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Define the expected structure of the data coming in
interface ProductDataPoint {
  product_id: number;
  product_name: string;
  total_ordered_quantity: number;
}

interface PopularProductProps {
  productData: ProductDataPoint[];
  month?: string; // Optional prop for the month (e.g., "May 2025")
}


// Chart configuration - useful for defining axis labels and tooltip formatting
const chartConfig = {
  total_ordered_quantity: { // Define the key used for the value
    label: "Quantity Ordered", // Label for the X-axis (or value axis)
  },
  // No need for specific entries per product name as they are dynamic
} satisfies ChartConfig;

const color=['#991b1b','#dc2626','#f87171','#fecaca','#fee2e2']
export function PopularProduct({ productData, month = "Dalam Satu Bulan" }: PopularProductProps) {

  // Ensure data is valid before rendering the chart
  const hasData = Array.isArray(productData) && productData.length > 0;

  // It's good practice to use useMemo if any transformation was needed,
  // but here we'll directly use productData as the structure is close.
  // If you needed to add a 'fill' property per bar, you'd use useMemo here:
  
  const transformedProductData = React.useMemo(() => {
      if (!hasData) return [];
      return productData.map((item,index) => ({
          ...item,
          fill: color[index] // Example: Assign a consistent bar color
      }));
  }, [productData, hasData]);
  

   // Use a consistent color for all bars or cycle through a palette
   const barFillColor = "hsl(var(--primary))"; 


  return (
    <Card>
      <CardHeader>
        <CardTitle>Top {productData.length} Produk Paling Sering Di Pesan</CardTitle> {/* Dynamic title */}
        <CardDescription>{month}</CardDescription> {/* Use the month prop */}
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="min-h-[325px] w-full">
            <BarChart
              accessibilityLayer
              // Use the productData directly if no transformation is needed,
              // or transformedProductData if you added colors etc.
              data={transformedProductData}
              layout="vertical"
              margin={{
                left: 0, // Adjust margin if product names are long
                right: 20, // Give some space on the right
              }}
            >
              {/* Y-axis for Product Names */}
              <YAxis
                dataKey="product_name" // Use the product_name from your data
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick ={{fontSize:10}}
                // No need for tickFormatter looking up in chartConfig here
                // If product names are too long, consider adjusting tick size or angle
                // tick={{ fontSize: 12 }}
              />
              {/* X-axis for Quantity - Keep hidden as in original scaffold */}
              <XAxis
                dataKey="total_ordered_quantity" // Use the quantity from your data
                type="number"
                hide
              />
              {/* Tooltip */}
              <ChartTooltip
                cursor={false}
                 content={
                    <ChartTooltipContent
                       hideLabel
                       formatter={(value, name) => {
                          // Find the corresponding data item to get the product name
                          const dataItem = productData.find(item => item.total_ordered_quantity === value);
                          if (dataItem) {
                             return [`${value} units`, dataItem.product_name]; // Format: ["quantity units", "Product Name"]
                          }
                          return [`${value}`, name as string]; // Fallback
                       }}
                    />
                 }
              />
              {/* Bar */}
              <Bar
                dataKey="total_ordered_quantity" // Use the quantity for the bar value
                layout="vertical"
                radius={5}
                // Assign the fill color - either from data or a static color
                fill={barFillColor} // Using a static color
              >
                   <LabelList
                dataKey="total_ordered_quantity"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
              </Bar>
            </BarChart>
          </ChartContainer>
         ) : (
           <div className="flex items-center justify-center h-[200px] text-muted-foreground">
             No top ordered product data available for {month}.
           </div>
        )}
      </CardContent>
      {/* Card Footer - Remove or adjust boilerplate text */}
      <CardFooter className="flex-col items-start gap-2 text-sm">
         {/* Add relevant info here if needed */}
         {/* <div className="leading-none text-muted-foreground">
           Data based on delivery orders {month}.
         </div> */}
          {/* Example of keeping a simple trend indicator if applicable */}
         {/* <div className="flex gap-2 font-medium leading-none">
           Overall order volume trending <TrendingUp className="h-4 w-4" />
         </div> */}
      </CardFooter>
    </Card>
  )
}