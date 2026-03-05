<script setup lang="ts">
/**
 * GameOverModal 组件 Props
 * @property score - 最终分数
 * @property isWin - 是否获胜
 * @property show - 是否显示弹窗
 */
defineProps<{
  score: number
  isWin: boolean
  show: boolean
}>()

/**
 * GameOverModal 组件事件
 * @event restart - 重新开始按钮点击
 */
const emit = defineEmits<{
  restart: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="emit('restart')">
        <div class="modal-content" @click.stop>
          <h2 class="modal-title">
            {{ isWin ? '恭喜获胜！' : '游戏结束！' }}
          </h2>
          <div class="modal-score">
            <p class="score-label">最终分数</p>
            <p class="score-value">{{ score }}</p>
          </div>
          <button class="restart-btn" @click="emit('restart')">
            再来一局
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(238, 228, 218, 0.73);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #faf8ef;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
}

.modal-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #776e65;
  margin: 0 0 20px 0;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}

.modal-score {
  margin-bottom: 30px;
}

.modal-score .score-label {
  font-size: 1rem;
  color: #776e65;
  margin: 0 0 10px 0;
}

.modal-score .score-value {
  font-size: 3rem;
  font-weight: bold;
  color: #8f7a66;
  margin: 0;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}

.restart-btn {
  background: #8f7a66;
  border: none;
  border-radius: 6px;
  color: #f9f6f2;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 15px 40px;
  cursor: pointer;
  transition: background 150ms ease-in-out;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}

.restart-btn:hover {
  background: #9f8b77;
}

.restart-btn:active {
  transform: scale(0.95);
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 300ms ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 300ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>
