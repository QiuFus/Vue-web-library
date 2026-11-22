<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="brand">
          <span class="logo"> 网上书城</span>
          <p class="slogan">发现好书，遇见更好的自己</p>
        </div>

        <div class="links">
          <div class="link-group">
            <h4>关于我们</h4>
            <a href="#">网站介绍</a>
            <a href="#">联系方式</a>
            <a href="#">加入我们</a>
          </div>
          <div class="link-group">
            <h4>帮助中心</h4>
            <a href="#">购物指南</a>
            <a href="#">配送方式</a>
            <a href="#">售后服务</a>
          </div>
          <div class="link-group">
            <h4>关注我们</h4>
            <a href="#">微信公众号</a>
            <a href="#">新浪微博</a>
            <a href="#">官方QQ群</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© {{ year }} 移动互联 2402 曾通 · 版权所有，保留一切权利</p>

        <p class="notice">
          本网站（包括但不限于文本、图形、图像、音频、视频、软件等内容）受中国版权法及国际版权条约保护。
          未经本网站所有者明确书面许可，禁止复制、修改、分发、发布、展示或以其他方式使用本网站的任何内容。
        </p>

        <div class="contact">
          <span>联系方式：2921434720@qq.com</span>
          <span class="divider">|</span>
          <span>武汉软件工程职业学院</span>
        </div>

        <p class="disclaimer">
          免责声明：本网站内容仅供参考，不构成专业建议。使用本网站内容造成的任何损失，本网站所有者不承担任何责任。
        </p>

        <p class="privacy">
          隐私政策：我们尊重并保护用户隐私，收集的个人信息仅用于提供服务，不会向第三方披露。
        </p>

        <p class="update">更新日期：2026 年 10 月 30日</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #1f2937;
  color: #d1d5db;
  margin-top: 60px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand .logo {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.slogan {
  font-size: 13px;
  color: #9ca3af;
  margin: 10px 0 0;
}

.links {
  display: flex;
  gap: 60px;
}

.link-group h4 {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 14px;
}

.link-group a {
  display: block;
  font-size: 13px;
  color: #9ca3af;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.2s ease;
}

.link-group a:hover {
  color: #667eea;
}

.footer-bottom {
  padding-top: 24px;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.8;
}

.copyright {
  font-size: 13px;
  color: #d1d5db;
  text-align: center;
  margin: 0 0 16px;
  font-weight: 500;
}

.notice,
.disclaimer,
.privacy {
  margin: 0 0 10px;
  color: #9ca3af;
  text-align: justify;
}

.contact {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  color: #9ca3af;
}

.divider {
  color: #4b5563;
}

.update {
  text-align: center;
  color: #6b7280;
  margin: 12px 0 0;
}
</style>