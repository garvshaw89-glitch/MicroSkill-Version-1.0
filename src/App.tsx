import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SkillDetail } from './components/SkillDetail';
import { AnalyticsView } from './components/AnalyticsView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileSection } from './components/ProfileSection';
import { AuthModal } from './components/AuthModal';
import { GameSessionContainer } from './components/GameSessionContainer';

import { getCurrentUser, logoutUser } from './lib/auth';
import {
  saveUserProfile,
  getSkills,
  getConcepts,
  getSchedules,
  getGameSessions,
  getAnswerHistory,
} from './lib/storage';

import {
  UserProfile,
  Skill,
  Concept,
  ReviewSchedule,
  GameSession,
  AnswerHistory,
  GameType,
} from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'skills' | 'analytics' | 'leaderboards' | 'profile'>('dashboard');
  const [selectedSkillId, setSelectedSkillId] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'login' | 'signup'>('signup');

  // Application State
  const [user, setUser] = useState<UserProfile>(getCurrentUser());
  const [skills] = useState<Skill[]>(getSkills());
  const [concepts] = useState<Concept[]>(getConcepts());
  const [schedules, setSchedules] = useState<ReviewSchedule[]>(getSchedules());
  const [sessions, setSessions] = useState<GameSession[]>(getGameSessions());
  const [answers, setAnswers] = useState<AnswerHistory[]>(getAnswerHistory());

  // Active Gameplay Session State
  const [activeSession, setActiveSession] = useState<{
    concept: Concept;
    gameType: GameType;
  } | null>(null);

  const refreshData = () => {
    setUser(getCurrentUser());
    setSchedules(getSchedules());
    setSessions(getGameSessions());
    setAnswers(getAnswerHistory());
  };

  useEffect(() => {
    refreshData();

    // Check if user has already set up or logged into a profile
    if (typeof window !== 'undefined') {
      const hasSeenProfilePrompt = localStorage.getItem('msa_has_seen_profile_prompt');
      const currentUserId = localStorage.getItem('msa_current_user_id');

      if (!hasSeenProfilePrompt || !currentUserId) {
        setAuthModalDefaultTab('signup');
        setIsAuthModalOpen(true);
      }
    }
  }, []);

  const handleOpenAuthModal = (tab: 'login' | 'signup' = 'signup') => {
    setAuthModalDefaultTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('msa_has_seen_profile_prompt', 'true');
    }
    setIsAuthModalOpen(false);
  };

  const handleToggleSound = () => {
    const updatedUser = { ...user, soundEnabled: !user.soundEnabled };
    setUser(updatedUser);
    saveUserProfile(updatedUser);
  };

  const handleStartSession = (conceptId: string, gameType: GameType) => {
    const concept = concepts.find((c) => c.id === conceptId);
    if (concept) {
      setActiveSession({ concept, gameType });
    }
  };

  const handleStartQuickReview = () => {
    const now = new Date();
    const dueSchedule = schedules.find((s) => new Date(s.nextReviewDate) <= now);
    const conceptId = dueSchedule ? dueSchedule.conceptId : concepts[0].id;
    const concept = concepts.find((c) => c.id === conceptId) || concepts[0];

    let gameType: GameType = 'word_sprint';
    if (concept.skillId === 'skill_language') gameType = 'translation_match';
    if (concept.skillId === 'skill_math') gameType = 'calculation_sprint';
    if (concept.skillId === 'skill_coding') gameType = 'syntax_puzzle';

    setActiveSession({ concept, gameType });
  };

  const handleNavigateToSkill = (skillId: string) => {
    setSelectedSkillId(skillId);
    setCurrentView('skills');
  };

  const handleLogout = () => {
    logoutUser();
    refreshData();
    setCurrentView('dashboard');
  };

  const getScheduleForConcept = (conceptId: string) => {
    return schedules.find((s) => s.conceptId === conceptId) || null;
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-300 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view !== 'skills') setSelectedSkillId(undefined);
        }}
        user={user}
        onToggleSound={handleToggleSound}
        onStartQuickReview={handleStartQuickReview}
        onOpenAuthModal={() => handleOpenAuthModal('login')}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && (
          <Dashboard
            user={user}
            skills={skills}
            concepts={concepts}
            schedules={schedules}
            onStartSession={handleStartSession}
            onNavigateToSkill={handleNavigateToSkill}
            onOpenProfile={() => setCurrentView('profile')}
          />
        )}

        {currentView === 'skills' && (
          <SkillDetail
            skills={skills}
            concepts={concepts}
            schedules={schedules}
            sessions={sessions}
            selectedSkillId={selectedSkillId}
            onStartSession={handleStartSession}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            user={user}
            skills={skills}
            schedules={schedules}
            sessions={sessions}
            answers={answers}
            concepts={concepts}
          />
        )}

        {currentView === 'leaderboards' && (
          <LeaderboardView
            user={user}
            onStartChallengeSession={handleStartSession}
          />
        )}

        {currentView === 'profile' && (
          <ProfileSection
            user={user}
            sessions={sessions}
            schedules={schedules}
            onProfileUpdated={(updated) => setUser(updated)}
            onOpenAuthModal={() => handleOpenAuthModal('login')}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultTab={authModalDefaultTab}
        onClose={handleCloseAuthModal}
        onAuthSuccess={(authUser) => {
          setUser(authUser);
          refreshData();
          handleCloseAuthModal();
        }}
      />

      {/* Active Game Session Overlay */}
      {activeSession && (
        <GameSessionContainer
          concept={activeSession.concept}
          gameType={activeSession.gameType}
          currentSchedule={getScheduleForConcept(activeSession.concept.id)}
          soundEnabled={user.soundEnabled}
          onExitSession={() => setActiveSession(null)}
          onSessionSaved={() => {
            refreshData();
            setActiveSession(null);
          }}
        />
      )}
    </div>
  );
}
