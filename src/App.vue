<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import GameHeader from '@/components/GameHeader.vue'
import GameBoard from '@/components/GameBoard.vue'
import GameOverModal from '@/components/GameOverModal.vue'
import '@/styles/game.css'

// 获取游戏状态管理
const gameStore = useGameStore()

/**
 * 检测当前设备是否为触摸设备
 * 通过检测触摸事件支持和触摸点数量来判断
 * @returns {boolean} 如果是触摸设备返回 true，否则返回 false
 */
const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 处理键盘事件
 * 监听方向键并触发移动
 */
const handleKeydown = (event: KeyboardEvent) => {
  // 如果游戏已结束，不处理键盘事件
  if (gameStore.isGameOver) return

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      gameStore.move('up')
      break
    case 'ArrowDown':
      event.preventDefault()
      gameStore.move('down')
      break
    case 'ArrowLeft':
      event.preventDefault()
      gameStore.move('left')
      break
    case 'ArrowRight':
      event.preventDefault()
      gameStore.move('right')
      break
  }
}

/**
 * 开始新游戏
 */
const startNewGame = () => {
  gameStore.initGame()
}

/**
 * 撤销操作
 */
const undo = () => {
  gameStore.undo()
}

// 组件挂载时初始化游戏，仅在桌面端添加键盘监听
onMounted(() => {
  gameStore.initGame()
  // 只在非触摸设备（桌面端）添加键盘事件监听
  // 移动端完全依赖触摸滑动操作
  if (!isTouchDevice()) {
    window.addEventListener('keydown', handleKeydown)
  }
})

// 组件卸载时移除键盘监听（如果存在）
onUnmounted(() => {
  if (!isTouchDevice()) {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="game-container">
    <!-- 游戏头部：标题、分数、控制按钮 -->
    <GameHeader
      :score="gameStore.score"
      :best-score="gameStore.bestScore"
      @new-game="startNewGame"
      @undo="undo"
    />

    <!-- 游戏网格 -->
    <GameBoard :grid="gameStore.grid" @move="gameStore.move" />

    <!-- 游戏结束弹窗 -->
    <GameOverModal
      :score="gameStore.score"
      :is-win="gameStore.isWin"
      :show="gameStore.isGameOver"
      @restart="startNewGame"
    />
  </div>
</template>

<style scoped>
.game-container {
  max-width: 500px;
  margin: 30px auto;
  padding: 20px;
  background: #faf8ef;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 响应式布局 - 使用 CSS 变量 */
@media (max-width: 520px) {
  .game-container {
    max-width: calc(100vw - 20px);
    margin: 15px auto;
    padding: 12px;
    border-radius: 6px;
  }
}

@media (max-width: 414px) {
  .game-container {
    max-width: calc(100vw - 16px);
    margin: 10px auto;
    padding: 10px;
  }
}

@media (max-width: 375px) {
  .game-container {
    max-width: calc(100vw - 12px);
    margin: 8px auto;
    padding: 8px;
  }
}

@media (max-width: 320px) {
  .game-container {
    max-width: calc(100vw - 10px);
    margin: 5px auto;
    padding: 6px;
    border-radius: 4px;
  }
}
</style>
