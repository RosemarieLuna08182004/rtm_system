import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { SFC } from '../../../types';
import * as S from '../../../styles';
import { twMerge } from 'tailwind-merge';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface LineChartProps {
  Data: number[];        // 12 values, January to December
  Title?: string;
  Subtitle?: string;
  Loading?: boolean;
}

// Monthly totals from real sales. Shows a clear empty state instead of a flat line.
export const LineChart: SFC<LineChartProps> = ({ ClassName, Data = [], Title = 'Monthly Sales', Subtitle, Loading }) => {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);
  const hasData = Data.some((v) => v > 0);

  // Create the chart once and keep it sized to its box.
  useEffect(() => {
    if (!ref.current) return;
    chart.current = echarts.init(ref.current);
    const resize = () => chart.current?.resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      chart.current?.dispose();
      chart.current = null;
    };
  }, []);

  // Update only when the numbers change.
  useEffect(() => {
    chart.current?.setOption({
      grid: { left: 48, right: 16, top: 56, bottom: 32 },
      title: { text: Title, subtext: Subtitle, textStyle: { fontSize: 15, color: '#1e293b' } },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: MONTHS, axisLine: { lineStyle: { color: '#cbd5e1' } } },
      yAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#f1f5f9' } } },
      series: [{
        name: 'Sales',
        type: 'line',
        data: Data,
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 3, color: '#1d4ed8' },
        itemStyle: { color: '#1d4ed8' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(29,78,216,0.25)' }, { offset: 1, color: 'rgba(29,78,216,0)' }]) },
      }],
    });
  }, [Data.join(','), Title, Subtitle]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <S.Container className={twMerge('relative bg-white rounded-lg p-2 h-[400px]', ClassName)}>
      <S.Content ref={ref} className="w-full h-full" style={{ minHeight: 300 }} />
      {(Loading || !hasData) && (
        <S.Content className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <S.Span className="text-sm font-medium text-slate-500 bg-white/90 px-3 py-1 rounded-md">
            {Loading ? 'Loading sales…' : 'No sales recorded this year yet'}
          </S.Span>
        </S.Content>
      )}
    </S.Container>
  );
};
