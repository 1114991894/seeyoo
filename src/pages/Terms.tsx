import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <Link to="/login" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-gray-800">用户协议</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">肾小友用户协议</h1>
              <p className="text-gray-500 text-sm">最后更新日期：2026年6月1日</p>
            </div>
          </div>

          <div className="prose prose-emerald max-w-none">
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">一、协议的范围</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                本协议是您与肾小友平台（以下简称"本平台"）之间关于您使用本平台服务所订立的协议。
                本平台是专为肾病患者及其家属打造的互助社区，提供社交交流、政策资讯、保健知识等服务。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">二、账号注册与管理</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                2.1 您承诺以真实身份信息注册账号，并保证所提供的个人资料真实、准确、完整。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                2.2 您有责任妥善保管账号及密码，因您保管不善导致的损失由您自行承担。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                2.3 未经本平台书面同意，您不得将账号转让、出借或以任何方式提供给第三方使用。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">三、用户行为规范</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                3.1 您在使用本平台服务时，应当遵守法律法规，尊重社会公德，不得发布违法违规内容。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                3.2 禁止发布以下内容：
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed ml-4">
                <li>违反国家法律法规的内容</li>
                <li>涉及医疗广告、虚假宣传的内容</li>
                <li>侵犯他人知识产权、隐私权的内容</li>
                <li>散布谣言、扰乱社会秩序的内容</li>
                <li>含有病毒、木马等恶意程序的内容</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">四、内容发布规范</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                4.1 您发布的内容应当真实、客观，不得编造、传播虚假信息。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                4.2 您分享的医疗经验仅供参考，不能替代专业医生的诊断和治疗建议。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                4.3 本平台有权对您发布的内容进行审核，对违规内容有权删除或屏蔽。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">五、知识产权</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                5.1 您在本平台发布的内容，您仍享有著作权，但授予本平台免费、非独家的使用权，
                用于展示、推广本平台服务。您发布的内容如涉及第三方权利，您应确保已获得合法授权。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">六、免责声明</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                6.1 本平台提供的医疗资讯仅供参考，不构成医疗建议。具体诊疗请前往正规医疗机构。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                6.2 用户之间的交流内容仅代表个人观点，不代表本平台立场。
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                6.3 因不可抗力或第三方原因导致的服务中断，本平台不承担责任。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">七、协议变更与终止</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                7.1 本平台有权根据需要修改本协议，修改后的协议将在平台上公布。
                如您不同意修改内容，应停止使用本平台服务。
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">八、争议解决</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                8.1 本协议的订立、执行和解释及争议的解决均适用中华人民共和国法律。
                如发生争议，双方应友好协商解决；协商不成的，任何一方均可向本平台所在地有管辖权的人民法院提起诉讼。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">九、联系我们</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                如您对本协议有任何疑问，请通过以下方式联系我们：<br />
                邮箱：xiaoyou@seeyoo.vip
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
