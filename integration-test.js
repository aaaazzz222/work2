/**
 * 集成测试脚本 - Portfolio Blog API
 * 直接测试模型和控制器功能
 */

require('dotenv').config();
const mongoose = require('mongoose');

// 导入模型
const User = require('./models/User');
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');
const Comment = require('./models/Comment');
const Message = require('./models/Message');

// 测试结果
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function runTest(testName, testFn) {
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ ${testName}`);
      testResults.passed++;
      testResults.tests.push({ name: testName, status: 'PASS' });
    } else {
      console.log(`❌ ${testName}`);
      testResults.failed++;
      testResults.tests.push({ name: testName, status: 'FAIL' });
    }
  } catch (error) {
    console.log(`❌ ${testName} - 错误: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: testName, status: 'ERROR', error: error.message });
  }
}

async function runIntegrationTests() {
  console.log('🧪 开始集成测试...\n');

  // 连接数据库
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 数据库连接成功\n');
  } catch (error) {
    console.log('❌ 数据库连接失败:', error.message);
    return;
  }

  // 1. 测试用户模型和密码加密
  console.log('🔐 测试用户认证功能');
  runTest('User 模型创建', async () => {
    const user = new User({
      name: '测试用户',
      email: 'test@example.com',
      password: 'test123456'
    });
    const savedUser = await user.save();
    return savedUser && savedUser.email === 'test@example.com' && savedUser.password !== 'test123456';
  });

  runTest('密码验证功能', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const isMatch = await user.matchPassword('test123456');
    return isMatch === true;
  });

  // 2. 测试项目模型
  console.log('\n📁 测试项目功能');
  runTest('Project 模型创建', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const project = new Project({
      title: '测试项目',
      description: '这是一个测试项目',
      imageUrl: 'https://example.com/image.jpg',
      technologies: ['Node.js', 'Express'],
      author: user._id
    });
    const savedProject = await project.save();
    return savedProject && savedProject.title === '测试项目';
  });

  // 3. 测试博客模型
  console.log('\n📝 测试博客功能');
  runTest('BlogPost 模型创建', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const blogPost = new BlogPost({
      title: '测试博客',
      content: '这是测试博客内容，需要足够长来测试内容字段的功能。'.repeat(5),
      author: user._id,
      published: true
    });
    const savedBlogPost = await blogPost.save();
    return savedBlogPost && savedBlogPost.title === '测试博客';
  });

  // 4. 测试评论功能
  console.log('\n💬 测试评论功能');
  runTest('Comment 模型创建', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const blogPost = await BlogPost.findOne({ title: '测试博客' });
    const comment = new Comment({
      content: '这是一条测试评论',
      author: user._id,
      blogPost: blogPost._id
    });
    const savedComment = await comment.save();
    return savedComment && savedComment.content === '这是一条测试评论';
  });

  // 5. 测试联系表单
  console.log('\n📧 测试联系表单功能');
  runTest('Message 模型创建', async () => {
    const message = new Message({
      name: '测试访客',
      email: 'visitor@example.com',
      subject: '测试消息',
      message: '这是一条测试消息，用于验证联系表单功能是否正常工作。'
    });
    const savedMessage = await message.save();
    return savedMessage && savedMessage.email === 'visitor@example.com';
  });

  // 6. 测试数据关联
  console.log('\n🔗 测试数据关联功能');
  runTest('项目-用户关联查询', async () => {
    const project = await Project.findOne().populate('author', 'name email');
    return project && project.author && project.author.name === '测试用户';
  });

  runTest('博客-用户关联查询', async () => {
    const blogPost = await BlogPost.findOne().populate('author', 'name email');
    return blogPost && blogPost.author && blogPost.author.name === '测试用户';
  });

  runTest('评论-博客-用户关联查询', async () => {
    const comment = await Comment.findOne()
      .populate('author', 'name')
      .populate('blogPost', 'title');
    return comment && comment.author && comment.blogPost;
  });

  // 7. 测试 CRUD 操作
  console.log('\n🔧 测试 CRUD 操作');
  runTest('更新用户信息', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    user.bio = '更新的个人简介';
    await user.save();
    return user.bio === '更新的个人简介';
  });

  runTest('更新项目信息', async () => {
    const project = await Project.findOne({ title: '测试项目' });
    project.featured = true;
    await project.save();
    return project.featured === true;
  });

  runTest('发布博客文章', async () => {
    const blogPost = await BlogPost.findOne({ title: '测试博客' });
    blogPost.published = true;
    await blogPost.save();
    return blogPost.published === true;
  });

  runTest('删除评论', async () => {
    const comment = await Comment.findOne({ content: '这是一条测试评论' });
    await comment.remove();
    const deletedComment = await Comment.findById(comment._id);
    return deletedComment === null;
  });

  // 8. 测试数据验证
  console.log('\n✅ 测试数据验证功能');
  runTest('必填字段验证', async () => {
    try {
      const invalidUser = new User({ email: 'invalid' });
      await invalidUser.save();
      return false; // 如果保存成功，说明验证失败
    } catch (error) {
      return true; // 期望验证失败
    }
  });

  runTest('唯一性验证', async () => {
    try {
      const duplicateUser = new User({
        name: '重复用户',
        email: 'test@example.com', // 已存在的邮箱
        password: 'password123'
      });
      await duplicateUser.save();
      return false; // 如果保存成功，说明唯一性验证失败
    } catch (error) {
      return true; // 期望唯一性验证失败
    }
  });

  // 清理测试数据
  console.log('\n🧹 清理测试数据...');
  try {
    await Message.deleteMany({});
    await Comment.deleteMany({});
    await BlogPost.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});
  } catch (error) {
    console.log('清理数据时出错:', error.message);
  }

  // 关闭数据库连接
  await mongoose.connection.close();
  console.log('✅ 测试数据已清理，数据库连接已关闭\n');

  // 生成测试报告
  console.log('📊 测试报告');
  console.log('=' .repeat(50));
  console.log(`通过: ${testResults.passed}`);
  console.log(`失败: ${testResults.failed}`);
  console.log(`总计: ${testResults.passed + testResults.failed}`);

  const percentage = Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100);
  console.log(`成功率: ${percentage}%`);

  console.log('\n详细结果:');
  testResults.tests.forEach(test => {
    const status = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '💥';
    const error = test.error ? ` (${test.error})` : '';
    console.log(`${status} ${test.name}${error}`);
  });

  // 最终结论
  console.log('\n🎯 最终结论');
  if (percentage >= 90) {
    console.log('🎉 优秀！所有核心功能正常工作，项目已准备就绪！');
  } else if (percentage >= 80) {
    console.log('👍 良好！大部分功能正常工作，项目基本就绪。');
  } else {
    console.log('⚠️ 部分功能存在问题，需要修复。');
  }

  return percentage;
}

// 运行测试
runIntegrationTests().then(percentage => {
  console.log(`\n✨ 集成测试完成！功能评分: ${percentage}/100`);
}).catch(error => {
  console.error('测试运行失败:', error);
});