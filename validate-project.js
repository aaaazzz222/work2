/**
 * 项目代码质量验证脚本
 * 验证 Portfolio Blog API 的代码结构和功能完整性
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始项目代码质量验证...\n');

// 验证项目结构
function validateProjectStructure() {
  console.log('📁 验证项目结构...');

  const requiredStructure = {
    '根目录': ['server.js', 'package.json', 'README.md', '.env.example', '.gitignore'],
    'controllers': ['userController.js', 'projectController.js', 'blogController.js', 'commentController.js', 'contactController.js'],
    'models': ['User.js', 'Project.js', 'BlogPost.js', 'Comment.js', 'Message.js'],
    'routes': ['userRoutes.js', 'projectRoutes.js', 'blogRoutes.js', 'commentRoutes.js', 'contactRoutes.js'],
    'middleware': ['auth.js', 'errorHandler.js', 'validation.js'],
    'config': ['database.js']
  };

  let structureScore = 0;
  let structureTotal = 0;

  Object.entries(requiredStructure).forEach(([dir, files]) => {
    console.log(`\n  📂 ${dir}:`);
    const dirPath = dir === '根目录' ? '.' : dir;

    files.forEach(file => {
      structureTotal++;
      const filePath = path.join(dirPath, file);
      if (fs.existsSync(filePath)) {
        console.log(`    ✅ ${file}`);
        structureScore++;
      } else {
        console.log(`    ❌ ${file} - 缺失`);
      }
    });
  });

  return {
    score: structureScore,
    total: structureTotal,
    percentage: Math.round((structureScore / structureTotal) * 100)
  };
}

// 验证模型定义
function validateModels() {
  console.log('\n📊 验证数据模型...');

  const models = ['User', 'Project', 'BlogPost', 'Comment', 'Message'];
  let modelScore = 0;
  const modelChecks = models.length * 4; // 每个模型检查4项

  models.forEach(modelName => {
    console.log(`\n  📄 ${modelName}.js:`);

    try {
      const modelPath = path.join('./models', `${modelName}.js`);
      const modelContent = fs.readFileSync(modelPath, 'utf8');
      const Model = require(modelPath);

      // 检查模型是否正确定义
      if (Model.schema && Model.schema.paths) {
        console.log(`    ✅ 模型定义正确`);
        modelScore++;
      }

      // 检查必填字段
      const hasRequiredFields = Object.values(Model.schema.paths).some(path => path.isRequired === true);
      if (hasRequiredFields) {
        console.log(`    ✅ 包含必填字段验证`);
        modelScore++;
      }

      // 检查时间戳
      if (Model.schema.options.timestamps) {
        console.log(`    ✅ 启用时间戳`);
        modelScore++;
      } else {
        console.log(`    ⚠️ 未启用时间戳`);
      }

      // 检查索引
      if (Model.schema.indexes && Model.schema.indexes.length > 0) {
        console.log(`    ✅ 定义了索引`);
        modelScore++;
      }

    } catch (error) {
      console.log(`    ❌ 模型加载失败: ${error.message}`);
    }
  });

  return {
    score: modelScore,
    total: modelChecks,
    percentage: Math.round((modelScore / modelChecks) * 100)
  };
}

// 验证控制器功能
function validateControllers() {
  console.log('\n🎮 验证控制器功能...');

  const controllers = [
    'userController',
    'projectController',
    'blogController',
    'commentController',
    'contactController'
  ];

  const expectedFunctions = {
    userController: ['registerUser', 'loginUser', 'getMe', 'updateMe'],
    projectController: ['getProjects', 'getProject', 'createProject', 'updateProject', 'deleteProject'],
    blogController: ['getBlogPosts', 'getBlogPost', 'createBlogPost', 'updateBlogPost', 'deleteBlogPost'],
    commentController: ['getComments', 'createComment', 'updateComment', 'deleteComment'],
    contactController: ['createMessage', 'getMessages', 'deleteMessage']
  };

  let controllerScore = 0;
  let controllerTotal = 0;

  controllers.forEach(controllerName => {
    console.log(`\n  📄 ${controllerName}.js:`);

    try {
      const controllerPath = path.join('./controllers', `${controllerName}.js`);
      const controller = require(controllerPath);
      const expected = expectedFunctions[controllerName] || [];

      expected.forEach(funcName => {
        controllerTotal++;
        if (controller[funcName] && typeof controller[funcName] === 'function') {
          console.log(`    ✅ ${funcName}`);
          controllerScore++;
        } else {
          console.log(`    ❌ ${funcName} - 缺失`);
        }
      });

    } catch (error) {
      console.log(`    ❌ 控制器加载失败: ${error.message}`);
    }
  });

  return {
    score: controllerScore,
    total: controllerTotal,
    percentage: Math.round((controllerScore / controllerTotal) * 100)
  };
}

// 验证路由定义
function validateRoutes() {
  console.log('\n🛣️ 验证路由定义...');

  const routes = ['userRoutes', 'projectRoutes', 'blogRoutes', 'commentRoutes', 'contactRoutes'];
  let routeScore = 0;
  let routeTotal = routes.length;

  routes.forEach(routeName => {
    console.log(`\n  📄 ${routeName}.js:`);

    try {
      const routePath = path.join('./routes', `${routeName}.js`);
      const router = require(routePath);

      // 检查是否为 Express 路由
      if (router && typeof router.get === 'function') {
        console.log(`    ✅ Express 路由正确`);
        routeScore++;
      } else {
        console.log(`    ❌ 不是有效的 Express 路由`);
      }

    } catch (error) {
      console.log(`    ❌ 路由加载失败: ${error.message}`);
    }
  });

  return {
    score: routeScore,
    total: routeTotal,
    percentage: Math.round((routeScore / routeTotal) * 100)
  };
}

// 验证中间件
function validateMiddleware() {
  console.log('\n🔐 验证中间件...');

  const middleware = ['auth', 'errorHandler', 'validation'];
  let middlewareScore = 0;
  let middlewareTotal = 0;

  middleware.forEach(middlewareName => {
    console.log(`\n  📄 ${middlewareName}.js:`);

    try {
      const middlewarePath = path.join('./middleware', `${middlewareName}.js`);
      const middle = require(middlewarePath);

      middlewareTotal++;

      if (middlewareName === 'auth') {
        if (middle.protect && middle.authorize && middle.checkOwnership) {
          console.log(`    ✅ 认证中间件功能完整`);
          middlewareScore++;
        }
      } else if (middlewareName === 'validation') {
        if (middle.validateUserRegistration && middle.validateProject) {
          console.log(`    ✅ 验证中间件功能完整`);
          middlewareScore++;
        }
      } else if (middlewareName === 'errorHandler') {
        if (typeof middle === 'function') {
          console.log(`    ✅ 错误处理中间件正确`);
          middlewareScore++;
        }
      }

    } catch (error) {
      console.log(`    ❌ 中间件加载失败: ${error.message}`);
    }
  });

  return {
    score: middlewareScore,
    total: middlewareTotal,
    percentage: Math.round((middlewareScore / middlewareTotal) * 100)
  };
}

// 验证安全性
function validateSecurity() {
  console.log('\n🔒 验证安全配置...');

  let securityScore = 0;
  const securityChecks = 6;

  // 检查环境变量配置
  if (fs.existsSync('.env.example')) {
    console.log('  ✅ .env.example 存在');
    securityScore++;
  }

  // 检查依赖
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const securityDeps = ['helmet', 'bcryptjs', 'jsonwebtoken', 'express-validator'];

  securityDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`  ✅ ${dep} - 已安装`);
      securityScore++;
    }
  });

  // 检查服务器安全配置
  try {
    const serverContent = fs.readFileSync('server.js', 'utf8');
    if (serverContent.includes('helmet()')) {
      console.log('  ✅ Helmet 安全中间件已配置');
      securityScore++;
    }
  } catch (error) {
    console.log('  ❌ 无法检查服务器安全配置');
  }

  return {
    score: securityScore,
    total: securityChecks,
    percentage: Math.round((securityScore / securityChecks) * 100)
  };
}

// 生成综合报告
function generateComprehensiveReport(results) {
  console.log('\n📊 综合质量报告');
  console.log('=' .repeat(60));

  let totalScore = 0;
  let totalPossible = 0;

  Object.entries(results).forEach(([category, result]) => {
    console.log(`\n${category}:`);
    console.log(`  得分: ${result.score}/${result.total} (${result.percentage}%)`);
    totalScore += result.score;
    totalPossible += result.total;
  });

  const overallPercentage = Math.round((totalScore / totalPossible) * 100);

  console.log('\n' + '=' .repeat(60));
  console.log(`🏆 总体得分: ${totalScore}/${totalPossible} (${overallPercentage}%)`);

  // 评级
  let grade = 'F';
  let comment = '';

  if (overallPercentage >= 95) {
    grade = 'A+';
    comment = '优秀！项目质量极高，完全符合所有要求';
  } else if (overallPercentage >= 90) {
    grade = 'A';
    comment = '优秀！项目质量很高，符合所有主要要求';
  } else if (overallPercentage >= 85) {
    grade = 'B+';
    comment = '良好！项目质量较好，符合大部分要求';
  } else if (overallPercentage >= 80) {
    grade = 'B';
    comment = '良好！项目基本符合要求';
  } else if (overallPercentage >= 70) {
    grade = 'C';
    comment = '及格，但需要一些改进';
  } else {
    grade = 'F';
    comment = '需要大量改进才能达到标准';
  }

  console.log(`\n🎖️ 评级: ${grade}`);
  console.log(`💬 评价: ${comment}`);

  // 作业要求对应
  console.log('\n📋 作业要求对应:');
  console.log(`  数据库与模型 (20分): ${results.models.score >= 15 ? '✅ 达标' : '❌ 未达标'}`);
  console.log(`  用户系统 (25分): ${results.controllers.score >= 10 ? '✅ 达标' : '❌ 未达标'}`);
  console.log(`  CRUD 功能 (20分): ${results.controllers.score >= 15 ? '✅ 达标' : '❌ 未达标'}`);
  console.log(`  结构与错误处理 (10分): ${results.middleware.score >= 2 ? '✅ 达标' : '❌ 未达标'}`);
  console.log(`  安全与部署 (10分): ${results.security.score >= 5 ? '✅ 达标' : '❌ 未达标'}`);

  return overallPercentage;
}

// 主验证函数
function validateProject() {
  console.log('🚀 Portfolio Blog API 代码质量验证\n');

  const results = {
    '项目结构': validateProjectStructure(),
    '数据模型': validateModels(),
    '控制器功能': validateControllers(),
    '路由定义': validateRoutes(),
    '中间件': validateMiddleware(),
    '安全配置': validateSecurity()
  };

  const finalScore = generateComprehensiveReport(results);

  return finalScore;
}

// 运行验证
const score = validateProject();

console.log(`\n✨ 验证完成！项目质量评分: ${score}/100`);

if (score >= 90) {
  console.log('\n🎉 恭喜！你的项目达到了优秀标准，可以获得满分！');
} else if (score >= 80) {
  console.log('\n👍 项目达到了良好标准，符合作业要求！');
} else {
  console.log('\n⚠️ 项目需要一些改进才能达到作业要求。');
}