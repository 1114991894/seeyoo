import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: '医院查询',
    desc: '覆盖全国透析医院，支持按地区、距离、床位等条件筛选，实时查看床位信息，快速找到最适合的透析医院。',
    features: ['全国医院覆盖，支持省市筛选', '智能推荐附近医院', '实时床位信息查询', '医院评价与口碑查看']
  },
  {
    title: '互助社区',
    desc: '肾友交流分享平台，经验交流、心理支持、生活建议，让肾友不再孤单，携手同行。',
    features: ['肾友经验分享交流', '心理支持与鼓励', '饮食运动建议', '治疗经验互助']
  },
  {
    title: '急救指南',
    desc: '提供紧急求助功能，一键联系急救中心和家人，配备详细的急救知识和应对措施。',
    features: ['一键紧急求助', '急救知识科普', '24小时在线支持', '专业医护指导']
  },
  {
    title: '知识科普',
    desc: '专业的肾病知识科普文章，涵盖饮食、运动、治疗等方面，帮助肾友科学管理健康。',
    features: ['专业内容科普', '饮食营养指导', '运动康复建议', '治疗知识科普']
  }
];

const advantages = [
  { title: '全国覆盖', desc: '医院遍布全国各省市' },
  { title: '医院信息', desc: '医院信息同步，准确可靠' },
  { title: '专业团队', desc: '专家科普内容，权威保障' },
  { title: '温暖社区', desc: '肾友在线交流，互助同行' },
  { title: '24小时', desc: '全天服务保障，随时守护' }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-auto bg-white rounded-lg p-1">
                <img
                  src="https://conversation.cdn.meoo.host/conversations/303355349619060736/image/2026-04-17/1776408849732-seyoomlink.png?auth_key=50ee02c0d31e4c5fe4f34e4b8866a7d4a1200f781903120c35da50047c5a1fb8"
                  alt="肾友一站通"
                  className="h-full w-auto"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {['首页', '服务', '关于'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item === '首页' ? 'home' : item === '服务' ? 'services' : 'about')}
                  className={`text-sm font-medium transition-colors hover:text-teal-500 ${
                    scrolled ? 'text-slate-600' : 'text-white/90'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg className={`w-6 h-6 ${scrolled ? 'text-slate-800' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${scrolled ? 'text-slate-800' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              {['首页', '服务', '关于'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item === '首页' ? 'home' : item === '服务' ? 'services' : 'about')}
                  className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            为肾友提供<span className="text-teal-200">一站式</span>服务平台
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            让每一位透析患者都能获得及时、专业的帮助
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
              微信小程序
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              了解更多
            </button>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">核心服务</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">全方位守护肾友健康，让透析生活更加安心</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 border border-slate-100"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{service.desc}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-8">关于我们</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">平台简介</h3>
                  <p className="text-slate-600 leading-relaxed">
                    肾友一站通是专为肾病透析患者打造的一站式服务平台。我们致力于为肾友提供便捷、专业、贴心的服务，让每一位肾友都能获得及时有效的帮助。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">我们的使命</h3>
                  <p className="text-slate-600 leading-relaxed">
                    让每一位肾友不再孤单，让每一次透析更加安心。我们通过科技的力量，连接肾友与医疗资源，搭建互助交流的平台。
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {advantages.map((item) => (
                    <div key={item.title} className="bg-white p-4 rounded-xl border border-slate-100">
                      <div className="text-teal-600 font-semibold mb-1">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-bold text-slate-800 mb-6">联系我们</h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">微信小程序</div>
                    <div className="font-medium text-slate-800">肾友一站通</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">邮箱</div>
                    <a href="mailto:shenyouxiaozhan@yeah.net" className="font-medium text-teal-600 hover:underline">
                      shenyouxiaozhan@yeah.net
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">客服时间</div>
                    <div className="font-medium text-slate-800">周一至周五 9:00-18:00</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-500 text-center">
                  我们随时为您提供帮助与支持
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-auto bg-white rounded-lg p-1">
                <img
                  src="https://conversation.cdn.meoo.host/conversations/303355349619060736/image/2026-04-17/1776408849732-seyoomlink.png?auth_key=50ee02c0d31e4c5fe4f34e4b8866a7d4a1200f781903120c35da50047c5a1fb8"
                  alt="肾友一站通"
                  className="h-full w-auto"
                />
              </div>
            </div>
            <div className="w-20 h-px bg-slate-700 mb-6" />
            <p className="text-slate-400 text-sm mb-2">© 肾友一站通 版权所有</p>
            <p className="text-slate-500 text-sm">让每一位透析肾友都能获得及时、专业的帮助</p>
            <div className="mt-8">
              <img
                src="https://conversation.cdn.meoo.host/conversations/303355349619060736/image/2026-04-17/1776408849726-gh_ed96b3d6cb5e_258.jpg?auth_key=5e29c391a623257ffe53ba38676ff59d60690e0e009acae8674de42f84033466"
                alt="微信小程序二维码"
                className="w-48 h-48 rounded-xl shadow-lg"
              />
              <p className="text-slate-400 text-sm mt-4 text-center">扫码关注微信小程序</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
