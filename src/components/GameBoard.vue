<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Tile from './Tile.vue'
import type { Cell, Direction } from '@/types/game'

/**
 * GameBoard 组件 Props
 * @property grid - 4x4 游戏网格
 */
const props = defineProps<{
  grid: (Cell | null)[][]
}>()

/**
 * GameBoard 组件事件
 * @event move - 移动操作
 */
const emit = defineEmits<{
  move: [direction: Direction]
}>()

// 触摸事件相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)

/**
 * 处理触摸开始事件
 */
const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
}

/**
 * 处理触摸移动事件
 */
const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault() // 防止页面滚动
  touchEndX.value = event.touches[0].clientX
  touchEndY.value = event.touches[0].clientY
}

/**
 * 处理触摸结束事件
 * 判断滑动方向并触发移动
 */
const handleTouchEnd = () => {
  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value
  const minSwipeDistance = 50 // 最小滑动距离

  // 判断滑动方向（取绝对值较大的方向）
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平滑动
    if (Math.abs(deltaX) > minSwipeDistance) {
      emit('move', deltaX > 0 ? 'right' : 'left')
    }
  } else {
    // 垂直滑动
    if (Math.abs(deltaY) > minSwipeDistance) {
      emit('move', deltaY > 0 ? 'down' : 'up')
    }
  }

  // 重置触摸状态
  touchStartX.value = 0
  touchStartY.value = 0
  touchEndX.value = 0
  touchEndY.value = 0
}

/**
 * 获取所有非空单元格
 */
const getTiles = () => {
  const tiles: Array<{ cell: Cell; row: number; col: number }> = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = props.grid[row][col]
      if (cell) {
        tiles.push({ cell, row, col })
      }
    }
  }
  return tiles
}
</script>

<template>
  <div
    class="game-board"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- 背景网格 -->
    <div class="grid-background">
      <div v-for="i in 16" :key="i" class="grid-cell"></div>
    </div>

    <!-- 方块层 -->
    <div class="tiles-container">
      <Tile
        v-for="{ cell, row, col } in getTiles()"
        :key="cell.id"
        :value="cell.value"
        :position="{ row, col }"
        :is-new="cell.isNew"
        :is-merged="cell.isMerged"
      />
    </div>
  </div>
</template>

<style scoped>
.game-board {
  position: relative;
  background: #bbada0;
  border-radius: 6px;
  padding: 10px;
  touch-action: none; /* 禁用浏览器默认触摸行为 */
  user-select: none;
}

.grid-background {
  display: grid;
  grid-template-columns: repeat(4, 100px);
  grid-template-rows: repeat(4, 100px);
  gap: 10px;
}

.grid-cell {
  background: rgba(238, 228, 218, 0.35);
  border-radius: 6px;
}

.tiles-container {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 460px;
  height: 460px;
}

/* 响应式布局 */
@media (max-width: 500px) {
  .grid-background {
    grid-template-columns: repeat(4, 70px);
    grid-template-rows: repeat(4, 70px);
    gap: 8px;
  }

  .tiles-container {
    width: 316px;
    height: 316px;
  }
}
</style>
