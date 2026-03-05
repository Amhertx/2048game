<script setup lang="ts">
import ScoreBoard from './ScoreBoard.vue'
import GameControls from './GameControls.vue'

/**
 * GameHeader 组件 Props
 * @property score - 当前分数
 * @property bestScore - 最高分
 */
defineProps<{
  score: number
  bestScore: number
}>()

/**
 * GameHeader 组件事件
 * @event newGame - 新游戏按钮点击
 * @event undo - 撤销按钮点击
 */
const emit = defineEmits<{
  newGame: []
  undo: []
}>()
</script>

<template>
  <div class="game-header">
    <div class="header-top">
      <h1 class="game-title">2048</h1>
      <ScoreBoard :score="score" :bestScore="bestScore" />
    </div>
    <div class="header-bottom">
      <p class="game-intro">
        合并相同的数字，达到 <strong>2048</strong>！
      </p>
      <GameControls @new-game="emit('newGame')" @undo="emit('undo')" />
    </div>
  </div>
</template>

<style scoped>
.game-header {
  margin-bottom: 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.game-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #776e65;
  margin: 0;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}

.header-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-intro {
  color: #776e65;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.game-intro strong {
  font-weight: bold;
}

/* 响应式布局 */
@media (max-width: 500px) {
  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .game-title {
    font-size: 2.5rem;
  }

  .header-bottom {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .game-intro {
    text-align: center;
  }
}
</style>
