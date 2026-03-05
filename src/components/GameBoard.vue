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

// 滑动事件相关状态（支持触摸和鼠标）
const startX = ref(0)
const startY = ref(0)
const endX = ref(0)
const endY = ref(0)
const lastMoveTime = ref(0) // 上次移动时间，用于防抖
const isDragging = ref(false) // 是否正在拖拽

/**
 * 处理滑动开始（触摸或鼠标）
 */
const handleStart = (x: number, y: number) => {
  startX.value = x
  startY.value = y
  endX.value = x
  endY.value = y
  isDragging.value = true
}

/**
 * 处理滑动移动（触摸或鼠标）
 */
const handleMove = (x: number, y: number) => {
  if (!isDragging.value) return
  endX.value = x
  endY.value = y
}

/**
 * 处理滑动结束，判断方向并触发移动
 */
const handleEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false

  const deltaX = endX.value - startX.value
  const deltaY = endY.value - startY.value

  // 根据屏幕大小动态调整最小滑动距离（屏幕尺寸的 5%，最小 30px）
  const screenSize = Math.min(window.innerWidth, window.innerHeight)
  const minSwipeDistance = Math.max(30, screenSize * 0.05)

  // 计算滑动距离
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  // 滑动距离不足，不触发移动
  if (distance < minSwipeDistance) {
    return
  }

  // 防抖：两次移动间隔至少 100ms
  const now = Date.now()
  if (now - lastMoveTime.value < 100) return
  lastMoveTime.value = now

  // 判断滑动方向（取绝对值较大的方向）
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    emit('move', deltaX > 0 ? 'right' : 'left')
  } else {
    emit('move', deltaY > 0 ? 'down' : 'up')
  }
}

/**
 * 触摸开始事件
 */
const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  handleStart(touch.clientX, touch.clientY)
}

/**
 * 触摸移动事件
 */
const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  const touch = event.touches[0]
  handleMove(touch.clientX, touch.clientY)
}

/**
 * 触摸结束事件
 */
const handleTouchEnd = () => {
  handleEnd()
}

/**
 * 鼠标按下事件（用于浏览器模拟器）
 */
const handleMouseDown = (event: MouseEvent) => {
  handleStart(event.clientX, event.clientY)
}

/**
 * 鼠标移动事件
 */
const handleMouseMove = (event: MouseEvent) => {
  handleMove(event.clientX, event.clientY)
}

/**
 * 鼠标释放事件
 */
const handleMouseUp = () => {
  handleEnd()
}

/**
 * 鼠标离开事件
 */
const handleMouseLeave = () => {
  if (isDragging.value) {
    handleEnd()
  }
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
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
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
  padding: var(--grid-padding, 10px);
  touch-action: none; /* 禁用浏览器默认触摸行为 */
  user-select: none;
  -webkit-user-select: none; /* iOS Safari */
  -webkit-touch-callout: none; /* iOS 长按菜单 */
  -webkit-tap-highlight-color: transparent; /* 移除点击高亮 */
  /* 启用 GPU 加速，优化动画性能 */
  will-change: transform;
  -webkit-transform: translateZ(0);
}

/* 触摸反馈效果 */
.game-board:active {
  opacity: 0.95;
}

.grid-background {
  display: grid;
  grid-template-columns: repeat(4, var(--cell-size, 100px));
  grid-template-rows: repeat(4, var(--cell-size, 100px));
  gap: var(--grid-gap, 10px);
}

.grid-cell {
  background: rgba(238, 228, 218, 0.35);
  border-radius: 6px;
}

.tiles-container {
  position: absolute;
  top: var(--grid-padding, 10px);
  left: var(--grid-padding, 10px);
  /* 动态计算容器尺寸：4个单元格 + 3个间隙 */
  width: calc(var(--cell-size, 100px) * 4 + var(--grid-gap, 10px) * 3);
  height: calc(var(--cell-size, 100px) * 4 + var(--grid-gap, 10px) * 3);
}
</style>
