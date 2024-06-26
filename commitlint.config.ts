// commit-lint config
/**
 * build: 影响项目构建或依赖项修改
 * chore: 其他修改（不在上述类型中的修改）
 * ci: 持续集成相关文件修改
 * docs: 文档修改
 * feat: 新功能、新特性
 * fix: 修改 bug
 * perf: 更改代码，以提高性能（在不影响代码内部行为的前提下，对程序性能进行优化）
 * refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
 * release: 发布新版本
 * revert: 恢复上一次提交
 * style: 代码格式修改, 注意不是 css 修改（例如分号修改）
 * test: 测试用例新增、修改
 * types: 修改类型定义
 * workflow: 工作流相关文件修改
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'types'],
    ],
  },
};
