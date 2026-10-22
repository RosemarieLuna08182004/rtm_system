import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { SFC } from '../../../types';
import * as S from '../../../styles';
import { twMerge } from 'tailwind-merge';

export interface DoughnutChartProps {
  Data: { name: string; value: number }[];
  Title?: string;
  Loading?: boolean;
}

const COLORS = ['#1d4ed8', '#3b82f6', '#22d3ee', '#60a5fa', '#93c5fd'];

// Best-selling products from real sales. Shows a clear empty state when there are none.
export const DoughnutChart: SFC<DoughnutChartProps> = ({ ClassName, Data = [], Title = 'Most Sold Products', Loading }) => {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);
  const hasData = Data.some((d) => d.value > 0);

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

  useEffect(() => {
    chart.current?.setOption({
      color: COLORS,
      title: { text: Title, left: 'center', textStyle: { fontSize: 15, color: '#1e293b' } },
      tooltip: { trigger: 'item', formatter: '{b}: {c} sold ({d}%)' },
      series: [{
        name: 'Sales',
        type: 'pie',
        radius: ['42%', '70%'],
        top: 24,
        avoidLabelOverlap: true,
        label: { show: true, position: 'outside', formatter: '{b}' },
        data: hasData ? Data : [],
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        animationType: 'scale',
        animationEasing: 'cubicOut',
      }],
    }, true);
  }, [JSON.stringify(Data), Title]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <S.Container className={twMerge('relative bg-white rounded-lg p-2 h-[400px]', ClassName)}>
      <S.Content ref={ref} className="w-full h-full" style={{ minHeight: 300 }} />
      {(Loading || !hasData) && (
        <S.Content className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <S.Span className="text-sm font-medium text-slate-500 bg-white/90 px-3 py-1 rounded-md">
            {Loading ? 'Loading sales…' : 'No products sold yet'}
          </S.Span>
        </S.Content>
      )}
    </S.Container>
  );
};
