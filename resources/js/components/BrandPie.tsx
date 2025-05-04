'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'; // Assuming these are shadcn/ui components

// Define a consistent color palette for the top 5 brands
// const brandColors = ['#FF0037', '#008BE7', '#FFB700', '#01DFDF', '#792BC7'];
const brandColors = ['#991b1b','#dc2626','#f87171','#fecaca','#fee2e2'];



// Chart configuration - useful for defining label mapping in tooltip
const chartConfig = {
    count: {
        label: 'Percentage',
    },
} satisfies ChartConfig;

interface BrandDataPoint {
    brand: string;
    count: number;
}

interface BrandPieProps {
    brandData: {
        data: BrandDataPoint[];
        total_count: number;
    };
}

export function BrandPie({ brandData }: BrandPieProps) {
    // Transform the incoming data for recharts, adding colors
    const transformedChartData = React.useMemo(() => {
        // Ensure brandData is an array and has items
        if (!Array.isArray(brandData.data) || brandData.data.length === 0) {
            return [];
        }

        return brandData.data.map((item, index) => ({
            name: item.brand,
            value: item.count,
            fill: brandColors[index % brandColors.length],
        }));
    }, [brandData]);
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Top {transformedChartData.length} Brand PT. Sistech Kharisma</CardTitle>

                <CardDescription>Cabang Surabaya</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {transformedChartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[290px]">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel formatter={(value, name) => [name, ` (${value} produk)`]} />} // Customize tooltip format
                            />
                            <Pie
                                data={transformedChartData}
                                dataKey="value" // Use the 'value' key for percentages
                                nameKey="name" // Use the 'name' key for brand names
                                innerRadius={60}
                                strokeWidth={10}
                            >
                                {/* Center Label - Show sum of percentages or total products if available */}
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                    {brandData.total_count !== undefined ? (
                                                        <>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={viewBox.cy || 0 - 12}
                                                                className="fill-foreground text-3xl font-bold"
                                                            >
                                                                {brandData.total_count.toLocaleString()}00
                                                            </tspan>
                                                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground">
                                                                Produk
                                                            </tspan>
                                                        </>
                                                    ) : (
                                                        // Fallback if brand is not provided
                                                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-muted-foreground text-lg font-bold">
                                                            Top {transformedChartData.length} Brands
                                                        </tspan>
                                                    )}
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                ) : (
                    <div className="text-muted-foreground flex h-[290px] items-center justify-center">Data Brand Tidak Tersedia.</div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">Brand Dengan Produk Terbanyak</div>
              
                <div className="flex gap-2">
                    {transformedChartData.map((item) => {
                        return (
                            <div className="flex items-center gap-2">
                                <div style={{backgroundColor:`${item.fill}`}} className="h-3 w-4" />
                                <span className='leading-none text-muted-foreground'>{item.name}</span>
                            </div>
                        );
                    })}
                </div>
                {/* Or simply remove the footer content if it's not needed */}
            </CardFooter>
        </Card>
    );
}
