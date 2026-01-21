
import React, { useState } from 'react';
import { SiteSettings, Post } from '../types';

declare global {
  interface Window {
    PortOne: any;
  }
}

interface ClubProps {
  settings: SiteSettings;
  posts: Post[];
}

const Club: React.FC<ClubProps> = ({ posts }) => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'kakao' | 'naver'>('card');
  const [isVip, setIsVip] = useState(false);

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handlePostClick = (post: Post) => {
    if (!isVip) {
      setIsJoinModalOpen(true);
      return;
    }
    setSelectedPost(post);
  };

  /**
   * 포트원 V2 결제 실행 함수
   * 사용자가 라디오 버튼으로 선택한 paymentMethod에 따라 파라미터를 분기하여 호출합니다.
   */
  const handlePayment = async () => {
    if (typeof window.PortOne === 'undefined') {
      alert("결제 모듈이 아직 로드되지 않았습니다. 잠시만 기다려주세요.");
      return;
    }

    setPaymentStep('processing');

    try {
      // 공통 파라미터 설정
      const paymentParams: any = {
        storeId: "store-d443f747-cc48-4a29-94d8-64af2fd81488", // 가맹점 식별 코드
        paymentId: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        orderName: "아트온톡 VIP 멤버십 (1개월)",
        totalAmount: 99000,
        currency: "CURRENCY_KRW",
        customer: {
          fullName: "아트온톡 고객",
          phoneNumber: "010-0000-0000",
        },
        redirectUrl: window.location.origin + window.location.pathname,
      };

      // 1. 카카오페이 선택 시
      if (paymentMethod === 'kakao') {
        paymentParams.payMethod = "EASY_PAY";
        // 포트원 V2에서는 간편결제의 경우 pgProvider와 easyPay.provider를 맞춰야 합니다.
        paymentParams.pgProvider = "PG_PROVIDER_KAKAOPAY";
        paymentParams.easyPay = {
          provider: "EASY_PAY_PROVIDER_KAKAOPAY"
        };
      } 
      // 2. 네이버페이 선택 시
      else if (paymentMethod === 'naver') {
        paymentParams.payMethod = "EASY_PAY";
        paymentParams.pgProvider = "PG_PROVIDER_NAVERPAY";
        paymentParams.easyPay = {
          provider: "EASY_PAY_PROVIDER_NAVERPAY"
        };
      } 
      // 3. 신용/체크카드 선택 시 (기본값)
      else {
        paymentParams.payMethod = "CARD";
        paymentParams.pgProvider = "PG_PROVIDER_TOSSPAYMENTS"; // 토스페이먼츠 연동 기준
      }

      // 실제 포트원 결제창 호출
      const response = await window.PortOne.requestPayment(paymentParams);

      // 결제 결과 처리
      if (response.code != null) {
        // 오류 코드가 있다면 결제 실패 (사용자 취소 포함)
        throw new Error(response.message || "결제에 실패했습니다.");
      }

      // 결제 성공 시 (response.code가 없는 경우 V2 성공)
      // 실제 서비스 시에는 서버(Backend)에서 결제 완료 검증 로직을 거쳐야 합니다.
      setIsVip(true);
      setPaymentStep('success');
    } catch (error: any) {
      console.error("Payment Process Error:", error);
      alert(error.message || "결제 중 문제가 발생했습니다. 다시 시도해 주세요.");
      setPaymentStep('select');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <header className="mb-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -z-10"></div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">SPEED RICH <span className="text-purple-500">CLUB</span></h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          예술적 통찰과 경제적 지식을 결합한 <br />
          국내 유일의 프라이빗 아트-재테크 커뮤니티
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
              VIP 전용 리포트 & 인사이트
            </h2>
            <span className="text-xs text-gray-500 font-medium">Total {sortedPosts.length} Reports</span>
          </div>
          
          <div className="space-y-8">
            {sortedPosts.length > 0 ? (
              sortedPosts.map(post => (
                <div 
                  key={post.id} 
                  onClick={() => handlePostClick(post)}
                  className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-white/5 hover:border-purple-500/30 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer flex flex-col md:flex-row relative"
                >
                  {!isVip && (
                    <div className="absolute top-6 right-6 z-10 p-2 bg-black/60 rounded-full border border-purple-500/30">
                       <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                       </svg>
                    </div>
                  )}
                  <div className="w-full md:w-72 h-56 relative overflow-hidden flex-shrink-0">
                    <img 
                      src={post.imageUrl} 
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isVip ? 'blur-[12px] opacity-40' : ''}`} 
                      alt={post.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                      <span className="text-white text-[10px] font-black tracking-widest uppercase bg-purple-600 px-2 py-1 rounded">VIP ONLY</span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full">Report</span>
                        <span className="text-xs text-gray-500 font-medium">{post.createdAt}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors leading-tight">{post.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 font-light leading-relaxed">
                        {!isVip ? "본 리포트는 VIP 멤버 전용입니다. 멤버십 가입 후 전체 인사이트를 확인하실 수 있습니다." : post.content}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                       <div className="flex gap-2">
                        {post.seoTags?.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] text-gray-600">#{tag}</span>
                        ))}
                       </div>
                       <span className="text-xs text-purple-500 font-black group-hover:translate-x-1 transition-transform">Open Report →</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-gray-500 italic">아직 등록된 클럽 리포트가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="sticky top-24">
            <div className="bg-zinc-900 rounded-[2rem] p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-600/10 blur-[50px] rounded-full"></div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                VIP 멤버십 혜택
              </h3>
              <ul className="space-y-4 mb-10">
                {[
                  "분기별 실전 아트테크 분석 보고서",
                  "월 1회 프라이빗 갤러리 도슨트 투어",
                  "경제적 자유를 위한 독서 토론 세션",
                  "아트딜러 자격 취득 가이드 제공",
                  "멤버 전용 애드센스/수익형 블로그 특강"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400 leading-tight">
                    <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-white/5">
                <p className="text-xs text-gray-500 mb-1">Standard Monthly</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">99,000</span>
                  <span className="text-sm font-bold text-gray-400">KRW</span>
                </div>
              </div>
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="w-full py-5 bg-purple-600 rounded-2xl text-lg font-black hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/20 active:scale-95"
              >
                멤버십 신청하기
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Membership Join Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsJoinModalOpen(false)}></div>
          <div className="relative bg-zinc-900 w-full max-w-md p-8 rounded-[2.5rem] border border-purple-500/30 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {paymentStep === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-black mb-2 text-white">VIP 가입 완료!</h3>
                <p className="text-gray-400 mb-8">이제 모든 VIP 리포트를 자유롭게 열람하세요.</p>
                <button onClick={() => setIsJoinModalOpen(false)} className="w-full py-4 bg-purple-600 rounded-2xl font-bold hover:bg-purple-700 transition-colors">확인</button>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-black mb-2 text-white">VIP Membership</h3>
                <p className="text-gray-500 text-sm mb-10 leading-relaxed font-light">스피드부자 클럽의 고품격 지식과 정보를 누리세요. 부의 성장을 가속화합니다.</p>
                
                {/* Payment Selection Area (Radio Button Style) */}
                <div className="space-y-3">
                  {/* Credit/Check Card Option */}
                  <div 
                    onClick={() => setPaymentMethod('card')} 
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${paymentMethod === 'card' ? 'border-purple-600 bg-purple-600/10' : 'border-white/5 bg-black/50 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                      <p className="font-bold text-sm text-white">신용/체크카드</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-purple-600' : 'border-gray-700'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full"></div>}
                    </div>
                  </div>

                  {/* Kakao Pay Option */}
                  <div 
                    onClick={() => setPaymentMethod('kakao')} 
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${paymentMethod === 'kakao' ? 'border-[#FAE100] bg-[#FAE100]/10' : 'border-white/5 bg-black/50 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FAE100] rounded-lg flex items-center justify-center font-black text-black text-[10px]">TALK</div>
                      <p className="font-bold text-sm text-white">카카오페이</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'kakao' ? 'border-[#FAE100]' : 'border-gray-700'}`}>
                      {paymentMethod === 'kakao' && <div className="w-2.5 h-2.5 bg-[#FAE100] rounded-full"></div>}
                    </div>
                  </div>

                  {/* Naver Pay Option */}
                  <div 
                    onClick={() => setPaymentMethod('naver')} 
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${paymentMethod === 'naver' ? 'border-[#03C75A] bg-[#03C75A]/10' : 'border-white/5 bg-black/50 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#03C75A] rounded-lg flex items-center justify-center font-black text-white text-[10px]">N Pay</div>
                      <p className="font-bold text-sm text-white">네이버 페이</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'naver' ? 'border-[#03C75A]' : 'border-gray-700'}`}>
                      {paymentMethod === 'naver' && <div className="w-2.5 h-2.5 bg-[#03C75A] rounded-full"></div>}
                    </div>
                  </div>

                  {/* Final Payment Button */}
                  <button 
                    onClick={handlePayment} 
                    disabled={paymentStep === 'processing'}
                    className={`w-full py-5 text-white font-black rounded-2xl mt-8 transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg ${
                      paymentMethod === 'kakao' ? 'bg-[#FAE100] !text-black shadow-[#FAE100]/20' : 
                      paymentMethod === 'naver' ? 'bg-[#03C75A] shadow-[#03C75A]/20' : 
                      'bg-purple-600 shadow-purple-600/20'
                    }`}
                  >
                    {paymentStep === 'processing' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        결제창으로 이동 중...
                      </span>
                    ) : '99,000원 결제하기'}
                  </button>
                  <p className="text-[10px] text-gray-500 text-center mt-4 px-4 leading-relaxed font-light">
                    결제하기 버튼 클릭 시 이용약관 및 개인정보 처리방침에 동의하며, 유료 멤버십 서비스가 즉시 시작됨을 확인합니다.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Post Detail Modal (VIP 전용) */}
      {selectedPost && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedPost(null)}></div>
          <div className="relative bg-zinc-900 w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-8 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="overflow-y-auto">
              <div className="h-80 w-full relative">
                <img src={selectedPost.imageUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
              </div>
              <div className="p-10 md:p-16 -mt-20 relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 bg-purple-600 rounded-full text-xs font-black tracking-tighter uppercase">Club Report</span>
                  <span className="text-sm text-gray-500 font-medium">{selectedPost.createdAt}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight">{selectedPost.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-light">{selectedPost.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Club;
