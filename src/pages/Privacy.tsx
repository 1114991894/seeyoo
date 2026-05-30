import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <Link to="/login" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-gray-800">隐私政策</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">肾小友隐私政策</h1>
              <p className="text-gray-500 text-sm">最后更新日期：2026年6月1日</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none">
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">引言</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                肾小友（以下简称"本平台"）非常重视用户的隐私保护。本隐私政策说明我们如何收集、
                使用、存储和保护您的个人信息。请您在使用本平台服务前仔细阅读本政策。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">一、我们收集的信息</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                1.1 <strong>您主动提供的信息</strong>
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed ml-4 mb-3">
                <li>注册信息：手机号、昵称、头像</li>
                <li>个人资料：性别、年龄、病情描述等（选填）</li>
                <li>发布内容：帖子、评论、图片等</li>
                <li>反馈信息：您向我们提供的意见、建议等</li>
              </ul>

              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                1.2 <strong>我们自动收集的信息</strong>
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed ml-4">
                <li>设备信息：设备型号、操作系统版本、设备标识符</li>
                <li>日志信息：访问时间、浏览记录、操作记录</li>
                <li>位置信息：IP地址、大致地理位置（用于内容推荐）</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">二、我们如何使用信息</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                2.1 我们使用您的信息用于以下目的：
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed ml-4">
                <li>提供、维护和改进本平台服务</li>
                <li>验证您的身份，保障账号安全</li>
                <li>向您推送相关内容和通知</li>
                <li>进行数据分析和研究，改善用户体验</li>
                <li>处理您的反馈和投诉</li>
                <li>遵守法律法规要求</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">三、信息的存储与保护</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                3.1 <strong>信息存储</strong>
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                您的个人信息存储在中华人民共和国境内。我们仅在实现本政策所述目的所必需的期限内保留您的信息。
              </p>

              <p className="text-gray-600 text-sm leading-relaxed mb-2 mt-3">
                3.2 <strong>信息安全</strong>
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                我们采取多种安全措施保护您的信息，包括加密传输、访问控制、安全审计等。
                但请注意，互联网传输无法保证绝对安全。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">四、信息共享与披露</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                4.1 我们不会向第三方出售您的个人信息。但在以下情况下，我们可能会共享或披露您的信息：
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed ml-4">
                <li>获得您的明确同意</li>
                <li>与我们的服务提供商共享（仅用于提供服务）</li>
                <li>根据法律法规要求或政府机关的合法要求</li>
                <li>为保护本平台、用户或公众的合法权益</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">五、您的权利</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                5.1 您对您的个人信息享有以下权利：
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed ml-4">
                <li>访问权：查看您的个人信息</li>
                <li>更正权：修改不准确的个人信息</li>
                <li>删除权：要求删除您的个人信息</li>
                <li>撤回同意权：撤回之前授予的同意</li>
                <li>注销账号权：申请注销您的账号</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">六、Cookie和类似技术</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                6.1 我们使用Cookie和类似技术来改善您的使用体验、记住您的偏好设置、分析服务使用情况。
                您可以通过浏览器设置管理Cookie，但禁用Cookie可能影响部分功能的使用。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">七、未成年人保护</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                7.1 本平台主要面向成年肾病患者。如果您是未成年人，请在监护人指导下使用本平台服务，
                并确保监护人同意您使用我们的服务。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">八、政策更新</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                8.1 我们可能会不时更新本隐私政策。更新后的政策将在本平台上公布，
                重大变更将通过适当方式通知您。继续使用本平台服务即表示您同意更新后的政策。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">九、联系我们</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                如您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：<br />
                邮箱：xiaoyou@seeyoo.vip
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
