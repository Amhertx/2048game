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

// 组件挂载时初始化游戏并添加键盘监听
onMounted(() => {
  gameStore.initGame()
  window.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除键盘监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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
  margin: 50px auto;
  padding: 20px;
  background: #faf8ef;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 响应式布局 */
@media (max-width: 520px) {
  .game-container {
    max-width: 340px;
    margin: 20px auto;
    padding: 15px;
  }
}

@media (max-width: 360px) {
  .game-container {
    max-width: 300px;
    margin: 10px auto;
    padding: 10px;
  }
}
</style>
