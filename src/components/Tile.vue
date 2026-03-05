<script setup lang="ts">
import { computed } from 'vue'
import type { Position } from '@/types/game'

/**
 * Tile 组件 Props
 * @property value - 方块的数值
 * @property position - 方块在网格中的位置
 * @property isNew - 是否为新出现的方块（用于淡入动画）
 * @property isMerged - 是否为合并后的方块（用于弹跳动画）
 */
const props = defineProps<{
  value: number
  position: Position
  isNew?: boolean
  isMerged?: boolean
}>()

/**
 * 根据数值获取方块颜色
 * 经典扁平风格配色方案
 */
const tileColor = computed(() => {
  const colors: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
  }
  return colors[props.value] || '#3c3a32'
})

/**
 * 根据数值获取文字颜色
 * 数值较小时使用深色文字，数值较大时使用浅色文字
 */
const textColor = computed(() => {
  return props.value <= 4 ? '#776e65' : '#f9f6f2'
})

/**
 * 根据数值调整字体大小
 * 数值越大，字体越小以适应方块
 */
const fontSize = computed(() => {
  if (props.value >= 1024) return '1.5rem'
  if (props.value >= 128) return '1.8rem'
  return '2rem'
})

/**
 * 计算方块的位置样式
 */
const positionStyle = computed(() => {
  const cellSize = 100 // 单元格大小（px）
  const gap = 10 // 间隙大小（px）
  const x = props.position.col * (cellSize + gap)
  const y = props.position.row * (cellSize + gap)
  return {
    transform: `translate(${x}px, ${y}px)`
  }
})
</script>

<template>
  <div
    class="tile"
    :style="positionStyle"
  >
    <div
      class="tile-inner"
      :class="{
        'tile-new': isNew,
        'tile-merged': isMerged
      }"
      :style="{
        backgroundColor: tileColor,
        color: textColor,
        fontSize: fontSize
      }"
    >
      {{ value }}
    </div>
  </div>
</template>

<style scoped>
.tile {
  position: absolute;
  width: 100px;
  height: 100px;
  z-index: 10;
  user-select: none;
}

.tile-inner {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  transition: transform 150ms ease-in-out;
}

/* 新方块出现动画 */
.tile-new {
  animation: appear 200ms ease-in-out;
}

@keyframes appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 合并方块弹跳动画 */
.tile-merged {
  animation: pop 200ms ease-in-out;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
