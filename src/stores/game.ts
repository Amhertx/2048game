import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import type { GameState, Cell, Direction } from '@/types/game'

/**
 * 扩展的游戏状态接口（包含历史记录和动画状态）
 */
interface ExtendedGameState extends GameState {
  historyStack: GameState[]
  newTileIds: Set<string>
  mergedTileIds: Set<string>
}

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * 创建空的 4x4 网格
 */
const createEmptyGrid = (): (Cell | null)[][] => {
  return Array(4).fill(null).map(() => Array(4).fill(null))
}

/**
 * 深拷贝网格
 */
const cloneGrid = (grid: (Cell | null)[][]): (Cell | null)[][] => {
  return grid.map(row => row.map(cell => cell ? { ...cell } : null))
}

/**
 * 游戏状态管理 Store
 */
export const useGameStore = defineStore('game', {
  state: (): ExtendedGameState => ({
    grid: createEmptyGrid(),
    score: 0,
    bestScore: parseInt(localStorage.getItem('2048-bestScore') || '0'),
    isGameOver: false,
    isWin: false,
    historyStack: [],
    newTileIds: new Set(),
    mergedTileIds: new Set()
  }),

  getters: {
    /**
     * 获取所有空单元格的位置
     */
    emptyCells: (state): { row: number; col: number }[] => {
      const empty: { row: number; col: number }[] = []
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (!state.grid[row][col]) {
            empty.push({ row, col })
          }
        }
      }
      return empty
    }
  },

  actions: {
    /**
     * 保存当前状态到历史记录
     */
    saveState() {
      const currentState: GameState = {
        grid: cloneGrid(this.grid),
        score: this.score,
        bestScore: this.bestScore,
        isGameOver: this.isGameOver,
        isWin: this.isWin
      }
      this.historyStack.push(currentState)
      // 只保留最近 10 步
      if (this.historyStack.length > 10) {
        this.historyStack.shift()
      }
    },

    /**
     * 撤销上一步操作
     */
    undo() {
      if (this.historyStack.length === 0) return false
      
      const previousState = this.historyStack.pop()
      if (previousState) {
        this.grid = previousState.grid
        this.score = previousState.score
        this.bestScore = previousState.bestScore
        this.isGameOver = previousState.isGameOver
        this.isWin = previousState.isWin
        return true
      }
      return false
    },

    /**
     * 初始化游戏
     */
    initGame() {
      this.grid = createEmptyGrid()
      this.score = 0
      this.isGameOver = false
      this.isWin = false
      this.historyStack = []
      this.newTileIds.clear()
      this.mergedTileIds.clear()
      // 添加两个初始单元格
      this.addRandomCell()
      this.addRandomCell()
    },

    /**
     * 重置游戏（保留最高分）
     */
    resetGame() {
      this.initGame()
    },

    /**
     * 在随机空位置添加一个单元格
     */
    addRandomCell() {
      const empty = this.emptyCells
      if (empty.length === 0) return

      const { row, col } = empty[Math.floor(Math.random() * empty.length)]
      // 90% 概率生成 2，10% 概率生成 4
      const value = Math.random() < 0.9 ? 2 : 4
      const id = generateId()
      this.grid[row][col] = { value, id, isNew: true }
      this.newTileIds.add(id)
    },

    /**
     * 检查是否还能移动
     */
    canMove(): boolean {
      // 如果有空格，肯定能移动
      if (this.emptyCells.length > 0) return true

      // 检查是否有相邻的相同数字
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const current = this.grid[row][col]
          if (!current) continue

          // 检查右边
          if (col < 3 && this.grid[row][col + 1]?.value === current.value) {
            return true
          }
          // 检查下边
          if (row < 3 && this.grid[row + 1][col]?.value === current.value) {
            return true
          }
        }
      }
      return false
    },

    /**
     * 检查是否达到 2048
     */
    checkWin(): boolean {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.grid[row][col]?.value === 2048) {
            return true
          }
        }
      }
      return false
    },

    /**
     * 更新最高分
     */
    updateBestScore() {
      if (this.score > this.bestScore) {
        this.bestScore = this.score
        localStorage.setItem('2048-bestScore', this.bestScore.toString())
      }
    },

    /**
     * 移动一行或一列（核心合并逻辑）
     * @param line 一行或一列的数据
     * @returns 移动后的新行/列和得分增量
     */
    moveLine(line: (Cell | null)[]): { newLine: (Cell | null)[], scoreGain: number } {
      // 过滤掉空格，只保留有值的单元格
      const nonNull = line.filter(cell => cell !== null) as Cell[]
      const result: (Cell | null)[] = []
      let scoreGain = 0

      let i = 0
      while (i < nonNull.length) {
        const current = nonNull[i]

        // 检查是否可以和下一个合并
        if (i + 1 < nonNull.length && nonNull[i + 1].value === current.value) {
          // 合并：创建新单元格，值为两倍
          const mergedValue = current.value * 2
          const id = generateId()
          result.push({ value: mergedValue, id, isMerged: true })
          this.mergedTileIds.add(id)
          scoreGain += mergedValue
          i += 2 // 跳过下一个（已合并）
        } else {
          // 不合并，直接添加
          result.push({ ...current })
          i += 1
        }
      }

      // 填充空格到长度为 4
      while (result.length < 4) {
        result.push(null)
      }

      return { newLine: result, scoreGain }
    },

    /**
     * 移动操作
     */
    move(direction: Direction) {
      // 游戏结束或已获胜则不能移动
      if (this.isGameOver || this.isWin) return

      // 清除上一次的动画标记
      this.clearTileAnimationFlags()

      // 保存当前状态用于撤销
      this.saveState()

      let moved = false
      let totalScoreGain = 0

      if (direction === 'left') {
        // 向左移动：每行从左到右处理
        for (let row = 0; row < 4; row++) {
          const line = this.grid[row]
          const { newLine, scoreGain } = this.moveLine(line)
          
          // 检查是否有变化
          if (JSON.stringify(line) !== JSON.stringify(newLine)) {
            moved = true
            this.grid[row] = newLine
            totalScoreGain += scoreGain
          }
        }
      } else if (direction === 'right') {
        // 向右移动：每行反转后处理，再反转回来
        for (let row = 0; row < 4; row++) {
          const line = [...this.grid[row]].reverse()
          const { newLine, scoreGain } = this.moveLine(line)
          const finalLine = newLine.reverse()
          
          if (JSON.stringify(this.grid[row]) !== JSON.stringify(finalLine)) {
            moved = true
            this.grid[row] = finalLine
            totalScoreGain += scoreGain
          }
        }
      } else if (direction === 'up') {
        // 向上移动：每列从上到下处理
        for (let col = 0; col < 4; col++) {
          const line: (Cell | null)[] = []
          for (let row = 0; row < 4; row++) {
            line.push(this.grid[row][col])
          }
          const { newLine, scoreGain } = this.moveLine(line)
          
          if (JSON.stringify(line) !== JSON.stringify(newLine)) {
            moved = true
            for (let row = 0; row < 4; row++) {
              this.grid[row][col] = newLine[row]
            }
            totalScoreGain += scoreGain
          }
        }
      } else if (direction === 'down') {
        // 向下移动：每列反转后处理，再反转回来
        for (let col = 0; col < 4; col++) {
          const line: (Cell | null)[] = []
          for (let row = 3; row >= 0; row--) {
            line.push(this.grid[row][col])
          }
          const { newLine, scoreGain } = this.moveLine(line)
          
          const originalLine: (Cell | null)[] = []
          for (let row = 0; row < 4; row++) {
            originalLine.push(this.grid[row][col])
          }
          
          if (JSON.stringify(originalLine) !== JSON.stringify([...newLine].reverse())) {
            moved = true
            for (let row = 0; row < 4; row++) {
              this.grid[3 - row][col] = newLine[row]
            }
            totalScoreGain += scoreGain
          }
        }
      }

      // 如果发生了移动
      if (moved) {
        // 更新分数
        this.score += totalScoreGain
        this.updateBestScore()

        // 添加新的随机单元格
        this.addRandomCell()

        // 检查是否获胜
        if (this.checkWin()) {
          this.isWin = true
        }

        // 检查游戏是否结束
        if (!this.canMove()) {
          this.isGameOver = true
        }

        // 动画标记会在下一次移动时清除
      } else {
        // 没有移动，移除刚才保存的状态
        this.historyStack.pop()
      }
    },

    /**
     * 清除单元格上的动画标记（isNew, isMerged）
     * 但保留 newTileIds 和 mergedTileIds 集合用于渲染判断
     */
    clearTileAnimationFlags() {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const cell = this.grid[row][col]
          if (cell) {
            cell.isNew = false
            cell.isMerged = false
          }
        }
      }
    },

    /**
     * 清除动画 ID 集合
     */
    clearAnimationIds() {
      this.newTileIds.clear()
      this.mergedTileIds.clear()
    }
  }
})
