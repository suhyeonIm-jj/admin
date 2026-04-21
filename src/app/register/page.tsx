"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "회원가입에 실패했습니다.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-mark">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
              </svg>
            </div>
            <span className="logo-title">Damin Hub</span>
          </div>
          <h1>회원가입</h1>
          <p>새 계정을 만들어 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-field">
            <label>이름</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="form-field">
            <label>이메일</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="form-field">
            <label>비밀번호</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              required
            />
          </div>

          <div className="form-field">
            <label>비밀번호 확인</label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <button type="submit" className="btn-primary full" disabled={isLoading}>
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="auth-link">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
