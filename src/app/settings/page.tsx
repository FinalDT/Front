'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { GradeSelector } from '@/components/features';
import { session, storage, Grade } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface UserSettings {
  nickname: string;
  grade: Grade;
  email: string;
  notifications: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>({
    nickname: '',
    grade: '중2',
    email: '',
    notifications: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<UserSettings>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load user settings
  useEffect(() => {
    if (!session.isAuthenticated()) {
      router.push('/auth');
      return;
    }

    // Load from localStorage or set defaults
    const savedSettings = storage.get('userSettings');
    const userId = session.getUserId();
    
    if (savedSettings) {
      setSettings(savedSettings);
    } else {
      // Generate default nickname from userId
      setSettings(prev => ({
        ...prev,
        nickname: `사용자${userId?.slice(-4) || '1234'}`,
        email: `demo${userId?.slice(-4) || '1234'}@example.com`
      }));
    }

    setIsLoading(false);
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserSettings> = {};

    if (!settings.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요';
    } else if (settings.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2글자 이상이어야 합니다';
    } else if (settings.nickname.length > 10) {
      newErrors.nickname = '닉네임은 10글자 이하여야 합니다';
    }

    if (!settings.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage
      storage.set('userSettings', settings);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    session.logout();
    router.push('/');
  };

  const handleInputChange = (field: keyof UserSettings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGradeChange = (grade: Grade) => {
    setSettings(prev => ({ ...prev, grade }));
  };

  const handleNotificationToggle = () => {
    setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-ink opacity-20 w-48"></div>
            <div className="h-32 bg-ink opacity-20"></div>
            <div className="h-32 bg-ink opacity-20"></div>
            <div className="h-16 bg-ink opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-accent border-[3px] border-ink shadow-[0_4px_0_rgba(0,0,0,1)] flex items-center justify-center">
              <div className="text-[20px]">⚙️</div>
            </div>
            <div>
              <h1 className="text-[32px] md:text-[48px] font-bold text-ink">
                설정
              </h1>
              <p className="text-[16px] text-ink opacity-70">
                프로필 및 환경설정
              </p>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div 
            className="fixed top-4 right-4 p-4 bg-green-100 border-[3px] border-green-600 shadow-[0_6px_0_rgba(0,0,0,1)] z-50 animate-in slide-in-from-top-2"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center space-x-2">
              <div className="text-[16px]">✅</div>
              <span className="text-[14px] font-medium text-green-800">
                설정이 저장되었습니다!
              </span>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
          aria-describedby="settings-help"
        >
          <div className="space-y-8">
            {/* Profile Settings */}
            <Card>
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold text-ink border-b-[3px] border-ink pb-3">
                  프로필 정보
                </h2>

                {/* Nickname */}
                <div className="space-y-2">
                  <Input
                    label="닉네임"
                    value={settings.nickname}
                    onChange={handleInputChange('nickname')}
                    error={errors.nickname}
                    helperText="2-10자 사이로 입력해주세요"
                    maxLength={10}
                    aria-describedby="nickname-help"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Input
                    label="이메일"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange('email')}
                    error={errors.email}
                    helperText="알림 수신용 이메일 주소"
                    aria-describedby="email-help"
                  />
                </div>

                {/* Grade */}
                <div className="space-y-2">
                  <GradeSelector
                    value={settings.grade}
                    onChange={handleGradeChange}
                  />
                  <p className="text-[12px] text-ink opacity-70">
                    학년에 맞는 문제와 설명을 제공합니다
                  </p>
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card>
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold text-ink border-b-[3px] border-ink pb-3">
                  알림 설정
                </h2>

                <div className="flex items-center justify-between p-4 border-[3px] border-ink bg-bg">
                  <div className="space-y-1">
                    <div className="text-[14px] font-medium text-ink">
                      학습 알림
                    </div>
                    <div className="text-[12px] text-ink opacity-70">
                      새로운 문제와 학습 팁을 알려드립니다
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleNotificationToggle}
                    className={cn(
                      'relative w-12 h-6 border-[3px] border-ink transition-all duration-200',
                      settings.notifications 
                        ? 'bg-accent' 
                        : 'bg-bg'
                    )}
                    aria-label={`학습 알림 ${settings.notifications ? '켜짐' : '꺼짐'}`}
                    role="switch"
                    aria-checked={settings.notifications}
                  >
                    <div
                      className={cn(
                        'absolute top-0 w-4 h-4 bg-ink transition-transform duration-200',
                        settings.notifications 
                          ? 'translate-x-6' 
                          : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                isLoading={isSaving}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? '저장 중...' : '설정 저장'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex-1"
              >
                로그아웃
              </Button>
            </div>

            {/* Help Text */}
            <div 
              id="settings-help"
              className="p-4 border-[3px] border-dashed border-ink bg-accent/10"
            >
              <div className="space-y-2">
                <h3 className="text-[14px] font-medium text-ink">💡 도움말</h3>
                <ul className="text-[12px] text-ink opacity-70 space-y-1 list-disc list-inside">
                  <li>설정은 자동으로 저장되며 모든 기기에서 동기화됩니다</li>
                  <li>학년 변경 시 다음 세션부터 해당 학년 문제가 출제됩니다</li>
                  <li>알림을 끄면 이메일과 브라우저 알림을 받지 않습니다</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowLogoutConfirm(false)}
              aria-hidden="true"
            />

            {/* Modal */}
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              className="relative w-full max-w-md bg-bg border-[3px] border-ink shadow-[0_8px_0_rgba(0,0,0,1)] p-6"
            >
              <div className="space-y-4">
                <h3 
                  id="logout-title"
                  className="text-[18px] font-bold text-ink"
                >
                  로그아웃 하시겠습니까?
                </h3>
                <p className="text-[14px] text-ink opacity-70">
                  로그아웃 후에도 설정과 학습 기록은 보존됩니다.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="flex-1"
                  >
                    로그아웃
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}