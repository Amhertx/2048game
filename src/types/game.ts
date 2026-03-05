/**
 * 游戏核心类型定义
 */

/**
 * 单元格接口
 * @property value - 单元格的数值（2, 4, 8, 16, ...）
 * @property id - 单元格的唯一标识符，用于 Vue 的 key 绑定
 * @property isNew - 是否为新出现的单元格（用于动画）
 * @property isMerged - 是否为合并后的单元格（用于动画）
 */
export interface Cell {
  value: number
  id: string
  isNew?: boolean
  isMerged?: boolean
}

/**
 * 移动方向类型
 */
export type Direction = 'up' | 'down' | 'left' | 'right'

/**
 * 游戏状态接口
 * @property grid - 4x4 的游戏网格
 * @property score - 当前分数
 * @property bestScore - 最高分数
 * @property isGameOver - 游戏是否结束
 * @property isWin - 是否达到 2048 获胜条件
 */
export interface GameState {
  grid: (Cell | null)[][]
  score: number
  bestScore: number
  isGameOver: boolean
  isWin: boolean
}

/**
 * 坐标位置接口
 */
export interface Position {
  row: number
  col: number
}
