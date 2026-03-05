<script setup lang="ts">
/**
 * GameControls 组件事件
 * @event newGame - 新游戏按钮点击
 * @event undo - 撤销按钮点击
 */
const emit = defineEmits<{
  newGame: []
  undo: []
}>()
</script>

<template>
  <div class="game-controls">
    <button class="control-btn new-game-btn" @click="emit('newGame')">
      新游戏
    </button>
    <button class="control-btn undo-btn" @click="emit('undo')">
      撤销
    </button>
  </div>
</template>

<style scoped>
.game-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  background: #8f7a66;
  border: none;
  border-radius: 6px;
  color: #f9f6f2;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 150ms ease-in-out;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}

.control-btn:hover {
  background: #9f8b77;
}

.control-btn:active {
  transform: scale(0.95);
}

.new-game-btn {
  background: #8f7a66;
}

.undo-btn {
  background: #bbada0;
}

.undo-btn:hover {
  background: #ccc0b3;
}
</style>
