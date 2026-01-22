
import React, { useState } from 'react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/mwvvvanz", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...data,
          subject: `[아트온톡] 새로운 통합 문의: ${data.name}`
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
        }, 3000);
      } else {
        throw new Error("전송 실패");
      }
    } catch (error) {
      alert("문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => !isSubmitting && onClose()}></div>
      <div className="relative bg-zinc-900 w-full max-w-xl p-8 md:p-12 rounded-[2.5rem] border border-purple-500/20 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors p-2"
          disabled={isSubmitting}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-16 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-8 text-purple-500">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-3xl font-black mb-4">전송 완료</h3>
            <p className="text-gray-400">아트 온 톡 매니저가 내용을 확인한 후 <br />빠른 시일 내에 연락드리겠습니다.</p>
          </div>
        ) : (
          <>
            <header className="mb-10">
              <span className="text-purple-500 text-[10px] font-black tracking-[0.3em] uppercase mb-2 block">Premium Concierge</span>
              <h3 className="text-3xl font-black mb-4">Inquiry Form</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                예술적 안목과 자산의 성장을 위한 첫 걸음. <br />
                원하시는 서비스 분야와 연락처를 남겨주세요.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">문의 유형</label>
                <select name="type" required className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-sm appearance-none cursor-pointer">
                  <option value="coaching">1:1 아트코칭 문의</option>
                  <option value="dealer">아트딜러 양성 과정 문의</option>
                  <option value="club">스피드부자 독서클럽 가입</option>
                  <option value="auction">프라이빗 옥션 투어 신청</option>
                  <option value="other">기타 비즈니스 협업/문의</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">성함</label>
                  <input name="name" type="text" placeholder="홍길동" required className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">연락처</label>
                  <input name="phone" type="tel" placeholder="010-0000-0000" required className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">이메일 주소</label>
                <input name="email" type="email" placeholder="example@email.com" required className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">문의 내용</label>
                <textarea name="message" rows={4} placeholder="상담 희망 시간이나 구체적인 궁금증을 남겨주세요." required className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-sm resize-none"></textarea>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-purple-600/20 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    전송 중...
                  </>
                ) : '컨시어지 상담 신청하기'}
              </button>

              <p className="text-[10px] text-gray-600 text-center leading-relaxed mt-4">
                문의를 남겨주시면 아트 온 톡의 개인정보 처리방침에 따라 <br />
                상담 및 안내 목적으로 정보가 수집됨에 동의하는 것으로 간주합니다.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
