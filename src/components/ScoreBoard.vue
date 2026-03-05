<script setup lang="ts">
/**
 * ScoreBoard 组件 Props
 * @property score - 当前分数
 * @property bestScore - 最高分
 */
defineProps<{
  score: number
  bestScore: number
}>()
</script>

<template>
  <div class="score-board">
    <div class="score-box">
      <div class="score-label">SCORE</div>
      <div class="score-value">{{ score }}</div>
    </div>
    <div class="score-box">
      <div class="score-label">BEST</div>
      <div class="score-value">{{ bestScore }}</div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  display: flex;
  gap: 10px;
}

.score-box {
  background: #bbada0;
  border-radius: 6px;
  padding: 10px 25px;
  text-align: center;
  min-width: 80px;
}

.score-label {
  color: #eee4da;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.score-value {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}
</style>
