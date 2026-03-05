# 2048 小游戏 Spec

## Why
创建一个基于 Vue 3 + Vite + Pinia 的 2048 小游戏，提供流畅的游戏体验，支持桌面和移动端，具备分数记录和撤销功能。

## What Changes
- 创建 Vue 3 + Vite 项目基础结构
- 实现 4x4 网格的 2048 核心游戏逻辑
- 实现方块滑动、合并动画效果
- 实现分数系统和最高分记录（localStorage）
- 实现撤销功能
- 支持键盘（方向键）和触摸滑动操作
- 经典扁平风格 UI 设计

## Impact
- 新项目，无现有代码影响
- 技术栈：Vue 3 + Vite + Pinia + TypeScript

## ADDED Requirements

### Requirement: 核心游戏逻辑
系统应提供完整的 2048 游戏核心逻辑。

#### Scenario: 游戏初始化
- **WHEN** 游戏开始时
- **THEN** 在 4x4 网格中随机生成 2 个数字（90% 概率为 2，10% 概率为 4）

#### Scenario: 方块移动
- **WHEN** 用户按下方向键或滑动屏幕
- **THEN** 所有方块向指定方向移动，相同数字的方块合并

#### Scenario: 方块合并
- **WHEN** 两个相同数字的方块碰撞
- **THEN** 它们合并为一个方块，数值翻倍，分数增加

#### Scenario: 游戏结束检测
- **WHEN** 网格填满且无法进行任何移动
- **THEN** 游戏结束，显示最终分数

#### Scenario: 游戏胜利
- **WHEN** 玩家合并出 2048 方块
- **THEN** 显示胜利提示，允许继续游戏

### Requirement: 分数系统
系统应提供分数记录功能。

#### Scenario: 分数计算
- **WHEN** 方块合并时
- **THEN** 分数增加合并后方块的数值

#### Scenario: 最高分记录
- **WHEN** 游戏结束或刷新页面
- **THEN** 最高分保存到 localStorage

#### Scenario: 分数显示
- **WHEN** 分数变化时
- **THEN** 实时更新当前分数和最高分显示

### Requirement: 撤销功能
系统应支持撤销上一步操作。

#### Scenario: 撤销操作
- **WHEN** 用户点击撤销按钮
- **THEN** 游戏状态恢复到上一步移动前的状态

#### Scenario: 撤销限制
- **WHEN** 连续撤销
- **THEN** 最多只能撤销最近 10 步操作

### Requirement: 用户交互
系统应支持多种输入方式。

#### Scenario: 键盘操作
- **WHEN** 用户按下方向键（上下左右）
- **THEN** 方块向对应方向移动

#### Scenario: 触摸操作
- **WHEN** 用户在触摸屏上滑动
- **THEN** 方块向滑动方向移动

#### Scenario: 新游戏
- **WHEN** 用户点击新游戏按钮
- **THEN** 重置游戏状态，开始新游戏

### Requirement: 动画效果
系统应提供流畅的动画效果。

#### Scenario: 方块移动动画
- **WHEN** 方块移动时
- **THEN** 显示平滑的滑动动画（150ms）

#### Scenario: 方块合并动画
- **WHEN** 方块合并时
- **THEN** 显示缩放弹跳动画

#### Scenario: 新方块出现动画
- **WHEN** 新方块生成时
- **THEN** 显示淡入缩放动画

### Requirement: 视觉设计
系统应采用经典扁平风格设计。

#### Scenario: 配色方案
- **WHEN** 渲染方块时
- **THEN** 根据数值显示不同的柔和颜色

#### Scenario: 响应式布局
- **WHEN** 在不同设备上访问
- **THEN** 游戏界面自适应屏幕尺寸
