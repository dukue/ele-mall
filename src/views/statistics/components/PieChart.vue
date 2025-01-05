<template>
  <div ref="chartRef" class="chart-container" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
let chart = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
  
  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}

const updateChart = () => {
  if (!chart) return

  // 检查数据是否为空
  if (!props.data || props.data.length === 0) {
    chart.setOption({
      title: {
        text: t('statistics.noData'),
        left: 'center',
        top: 'center'
      },
      series: [],
      legend: {
        data: []
      }
    })
    return
  }

  const option = {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const { name, data } = params
        // 根据组件用途显示不同的提示内容
        const valueLabel = name.includes('支付') ? t('statistics.orderCount') : t('statistics.productCount')
        return `${name}<br/>${valueLabel}: ${data.value}<br/>${t('statistics.percentage')}: ${data.percentage}%`
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      formatter: (name) => {
        const maxLength = 15
        return name.length > maxLength ? name.slice(0, maxLength) + '...' : name
      }
    },
    color: [
      '#5470c6',  // 主色
      '#91cc75',  // 辅色1
      '#fac858',  // 辅色2
      '#ee6666',  // 辅色3
      '#73c0de',  // 辅色4
    ],
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: props.data,
        label: {
          show: true,
          formatter: (params) => {
            return `${params.name}\n${params.percent}%`
          },
          position: 'outside'
        },
        labelLine: {
          length: 10,
          length2: 15,
          smooth: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        }
      }
    ]
  }

  chart.setOption(option, true)
}

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', handleResize)
})
</script> 

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}
</style> 