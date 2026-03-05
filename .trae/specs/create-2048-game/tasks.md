# Tasks

- [x] Task 1: 项目初始化
  - [x] SubTask 1.1: 使用 Vite 创建 Vue 3 + TypeScript 项目
  - [x] SubTask 1.2: 安装 Pinia 状态管理库
  - [x] SubTask 1.3: 配置项目结构和基础文件

- [x] Task 2: 游戏核心逻辑实现
  - [x] SubTask 2.1: 创建 GameStore（Pinia）管理游戏状态
  - [x] SubTask 2.2: 实现网格初始化和随机生成数字逻辑
  - [x] SubTask 2.3: 实现方块移动逻辑（上下左右）
  - [x] SubTask 2.4: 实现方块合并逻辑
  - [x] SubTask 2.5: 实现游戏结束和胜利检测

- [x] Task 3: 分数系统实现
  - [x] SubTask 3.1: 实现当前分数计算
  - [x] SubTask 3.2: 实现 localStorage 最高分存储
  - [x] SubTask 3.3: 创建分数显示组件

- [x] Task 4: 撤销功能实现
  - [x] SubTask 4.1: 实现历史状态栈（最多10步）
  - [x] SubTask 4.2: 实现撤销操作逻辑
  - [x] SubTask 4.3: 创建撤销按钮组件

- [x] Task 5: 用户交互实现
  - [x] SubTask 5.1: 实现键盘事件监听（方向键）
  - [x] SubTask 5.2: 实现触摸滑动事件监听
  - [x] SubTask 5.3: 创建新游戏按钮功能

- [x] Task 6: 动画效果实现
  - [x] SubTask 6.1: 实现方块移动动画（CSS Transition）
  - [x] SubTask 6.2: 实现方块合并动画
  - [x] SubTask 6.3: 实现新方块出现动画

- [x] Task 7: UI 组件开发
  - [x] SubTask 7.1: 创建游戏网格组件
  - [x] SubTask 7.2: 创建方块组件
  - [x] SubTask 7.3: 创建游戏头部组件（标题、分数）
  - [x] SubTask 7.4: 创建游戏控制组件（新游戏、撤销）
  - [x] SubTask 7.5: 实现响应式布局和扁平风格样式

- [x] Task 8: 测试和优化
  - [x] SubTask 8.1: 测试核心游戏逻辑
  - [x] SubTask 8.2: 测试移动端触摸操作
  - [x] SubTask 8.3: 性能优化和最终调整

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 7]
- [Task 7] depends on [Task 1]
- [Task 8] depends on [Task 2, Task 3, Task 4, Task 5, Task 6, Task 7]
