import { useEffect, useState } from 'react';

import Home from './pages/Home';
import Categories from './pages/Categories';
import Compose from './pages/Compose';
import Identity from './pages/Identity';
import Conversation from './pages/Conversation';
import UserDashboard from './pages/UserDashboard';
import StartTalking from './pages/StartTalking';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ProfessionalAuth from './pages/ProfessionalAuth';
import Auth from './pages/Auth';
import Community from './pages/Community';
import CreateCommunityPost from './pages/CreateCommunityPost';
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';

import {
  auth,
  conversations,
} from './services/api';

import type {
  Message,
  Screen,
} from './types';

const ACTIVE_CONVERSATION_KEY =
  'just_talk_active_conversation';

/* =========================================================
   URL HELPERS
   ========================================================= */

const getPath = () => {
  return window.location.pathname.replace(/\/+$/, '') || '/';
};

const isAdminLoginPath = () => {
  return getPath() === '/admin';
};

const isAdminDashboardPath = () => {
  return getPath() === '/admin/dashboard';
};

/* =========================================================
   APP
   ========================================================= */

function App() {
  /* =======================================================
     INITIAL SCREEN
     ======================================================= */

  const initialPath = getPath();

  const initialScreen: Screen =
    initialPath === '/admin'
      ? 'admin-auth'
      : initialPath === '/admin/dashboard'
        ? 'admin-dashboard'
        : 'home';

  const [screen, setScreen] =
    useState<Screen>(initialScreen);

  const [selectedTopic, setSelectedTopic] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [anonymousName, setAnonymousName] =
    useState('');

  const [conversationId, setConversationId] =
    useState('');

  const [
    conversationMessages,
    setConversationMessages,
  ] = useState<Message[]>([]);

  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(false);

  const [
    isProfessional,
    setIsProfessional,
  ] = useState(false);

  const [
    isCreatingConversation,
    setIsCreatingConversation,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const [
  authIntent,
  setAuthIntent,
] = useState<
  'conversation' | 'community' | 'login'
>('conversation');

  /* =======================================================
     URL NAVIGATION
     ======================================================= */

  const navigate = (path: string) => {
    window.history.pushState(
      {},
      '',
      path
    );

    window.dispatchEvent(
      new PopStateEvent('popstate')
    );
  };

  const navigateReplace = (path: string) => {
    window.history.replaceState(
      {},
      '',
      path
    );

    window.dispatchEvent(
      new PopStateEvent('popstate')
    );
  };

  /* =======================================================
     ERROR BANNER
     ======================================================= */

  const errorBanner = error ? (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: '24px',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'min(92%, 520px)',
        padding: '14px 18px',
        borderRadius: '14px',
        background:
          'rgba(20, 10, 30, 0.94)',
        border:
          '1px solid rgba(255, 120, 180, 0.25)',
        color: '#ffffff',
        boxShadow:
          '0 18px 50px rgba(0, 0, 0, 0.35)',
        backdropFilter:
          'blur(16px)',
      }}
    >
      {error}
    </div>
  ) : null;

  /* =======================================================
     RESTORE SESSION
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      /* ---------------------------------------------------
         ADMIN LOGIN PAGE

         /admin should ALWAYS show AdminAuth.
         --------------------------------------------------- */

      if (isAdminLoginPath()) {
        if (mounted) {
          setScreen('admin-auth');
        }

        return;
      }

      /* ---------------------------------------------------
         CHECK SESSION
         --------------------------------------------------- */

      try {
        const result = await auth.me();

        if (!mounted) {
          return;
        }

        /* =================================================
           ADMIN
           ================================================= */

        if (
          result?.accountType === 'admin'
        ) {
          setIsAuthenticated(true);
          setIsProfessional(false);

          /*
           * IMPORTANT:
           *
           * An authenticated admin is NOT automatically
           * redirected to the admin dashboard anymore.
           *
           * The dashboard is only shown when the admin
           * explicitly visits /admin/dashboard.
           */

          if (isAdminDashboardPath()) {
            sessionStorage.removeItem(
              ACTIVE_CONVERSATION_KEY
            );

            setConversationId('');
            setConversationMessages([]);
            setSelectedTopic('');
            setMessage('');

            setScreen('admin-dashboard');

            return;
          }

          /*
           * Admin is visiting a normal public page.
           *
           * Keep them on that page.
           *
           * For example:
           *
           * /
           * /community
           * /start-talking
           *
           * should NOT become /admin/dashboard.
           */

          if (
            getPath() === '/' ||
            getPath() === ''
          ) {
            setScreen('home');
            return;
          }

          /*
           * For any other public route that this
           * state-based app doesn't explicitly restore,
           * leave the current screen alone unless it
           * is currently the home screen.
           */

          return;
        }

        /* =================================================
           ADMIN DASHBOARD WITHOUT ADMIN
           ================================================= */

        if (isAdminDashboardPath()) {
          navigateReplace('/admin');

          setScreen('admin-auth');

          return;
        }

        /* =================================================
           PROFESSIONAL
           ================================================= */

        if (
          result?.accountType ===
            'professional' ||
          result?.user?.role ===
            'PROFESSIONAL'
        ) {
          setIsAuthenticated(true);
          setIsProfessional(true);

          sessionStorage.removeItem(
            ACTIVE_CONVERSATION_KEY
          );

          setConversationId('');
          setConversationMessages([]);
          setSelectedTopic('');
          setMessage('');

          /*
           * Only send the professional to the
           * professional dashboard if they are not
           * already intentionally on a public page.
           *
           * The current app is state-based, so we
           * preserve the existing behavior here.
           */

          if (
            getPath() === '/' ||
            getPath() === ''
          ) {
            setScreen('home');
            return;
          }

          setScreen(
            'professional-dashboard'
          );

          return;
        }

        /* =================================================
           NORMAL USER
           ================================================= */

        if (result?.user) {
          setIsAuthenticated(true);
          setIsProfessional(false);

          setAnonymousName(
            result.user.anonymousName || ''
          );

          const savedConversationId =
            sessionStorage.getItem(
              ACTIVE_CONVERSATION_KEY
            );

          /*
           * If the user has an active conversation,
           * restore it.
           */

          if (savedConversationId) {
            setConversationId(
              savedConversationId
            );

            setScreen('conversation');

            return;
          }

          /*
           * If they are already on Home, keep them
           * on Home.
           */

          if (
            getPath() === '/' ||
            getPath() === ''
          ) {
            setScreen('home');
            return;
          }

          setScreen('dashboard');

          return;
        }

        /* =================================================
           NO SESSION
           ================================================= */

        setIsAuthenticated(false);
        setIsProfessional(false);

        setScreen('home');
      } catch (error) {
        console.error(
          'Unable to restore session:',
          error
        );

        if (!mounted) {
          return;
        }

        setIsAuthenticated(false);
        setIsProfessional(false);

        /*
         * Only protect the admin dashboard.
         */

        if (isAdminDashboardPath()) {
          navigateReplace('/admin');

          setScreen('admin-auth');

          return;
        }

        setScreen('home');
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     BROWSER BACK / FORWARD
     ======================================================= */

  useEffect(() => {
    const handlePopState = () => {
      const path = getPath();

      /* -----------------------------------------------
         ADMIN LOGIN
         ----------------------------------------------- */

      if (path === '/admin') {
        setScreen('admin-auth');
        return;
      }

      /* -----------------------------------------------
         ADMIN DASHBOARD
         ----------------------------------------------- */

      if (path === '/admin/dashboard') {
        if (isAuthenticated) {
          setScreen('admin-dashboard');
        } else {
          setScreen('admin-auth');
        }

        return;
      }

      /* -----------------------------------------------
         HOME
         ----------------------------------------------- */

      if (
        path === '' ||
        path === '/'
      ) {
        setScreen('home');
      }
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, [isAuthenticated]);

  /* =======================================================
     START TALKING
     ======================================================= */

  const handleStart = () => {
    setError('');

    setAuthIntent(
      'conversation'
    );

    setScreen(
      'start-talking'
    );
  };

  /* =======================================================
     OPEN COMMUNITY
     ======================================================= */

  const handleOpenCommunity = () => {
    setError('');

    if (!isAuthenticated) {
      setAuthIntent('community');
      setScreen('auth');

      return;
    }

    setScreen('community');
  };

  /* =========================================================
   HOMEPAGE LOGIN — CLIENT
   ========================================================= */

const handleUserLogin = () => {
  setError('');
  setAuthIntent('login');
  setScreen('auth');
};

/* =========================================================
   HOMEPAGE LOGIN — PROFESSIONAL
   ========================================================= */

const handleProfessionalLogin = () => {
  setError('');
  setAuthIntent('login');
  setScreen('professional-auth');
};

  /* =======================================================
     COMPOSE
     ======================================================= */

  const handleComposeContinue = (
    nextMessage: string
  ) => {
    setError('');
    setMessage(nextMessage);
    setScreen('identity');
  };

  /* =======================================================
     AUTHENTICATED
     ======================================================= */

  const handleAuthenticated = async () => {
    try {
      setError('');

      console.log(
        'Authentication successful. Loading account...'
      );

      const result =
        await auth.me();

      console.log(
        'auth.me() result:',
        result
      );

      /* =================================================
         ADMIN
         ================================================= */

      if (
        result?.accountType === 'admin'
      ) {
        setIsAuthenticated(true);
        setIsProfessional(false);

        sessionStorage.removeItem(
          ACTIVE_CONVERSATION_KEY
        );

        setConversationId('');
        setConversationMessages([]);
        setSelectedTopic('');
        setMessage('');

        /*
         * An admin has just successfully logged in,
         * so taking them to the admin dashboard is
         * intentional here.
         */

        navigateReplace(
          '/admin/dashboard'
        );

        setScreen(
          'admin-dashboard'
        );

        return;
      }

      /* =================================================
         NORMAL USER
         ================================================= */

      if (!result?.user) {
        setError(
          'Your account was created, but we could not load your account details.'
        );

        return;
      }

      const user =
        result.user;

      setIsAuthenticated(true);

      setAnonymousName(
        user.anonymousName || ''
      );

      const professionalAccount =
        user.role === 'PROFESSIONAL' ||
        result.accountType ===
          'professional';

      setIsProfessional(
        professionalAccount
      );

      /* =================================================
         PROFESSIONAL
         ================================================= */

      if (
        professionalAccount
      ) {
        sessionStorage.removeItem(
          ACTIVE_CONVERSATION_KEY
        );

        setConversationId('');
        setConversationMessages([]);
        setSelectedTopic('');
        setMessage('');

        navigateReplace('/');

        setScreen(
          'professional-dashboard'
        );

        return;
      }

      /* =================================================
         COMMUNITY
         ================================================= */

      if (
        authIntent === 'community'
      ) {
        setScreen('community');

        return;
      }

      /* =================================================
         USER DASHBOARD
         ================================================= */

      setScreen('dashboard');
    } catch (error) {
      console.error(
        'Unable to complete authentication:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to complete authentication.'
      );
    } finally {
      setIsCreatingConversation(false);
    }
  };

  /* =======================================================
     LOGOUT
     ======================================================= */

  const handleLogout = async () => {
    const wasAdmin =
      screen === 'admin-dashboard' ||
      isAdminDashboardPath();

    try {
      await auth.logout();
    } catch (error) {
      console.error(
        'Logout failed:',
        error
      );
    } finally {
      sessionStorage.removeItem(
        ACTIVE_CONVERSATION_KEY
      );

      setIsAuthenticated(false);
      setIsProfessional(false);

      setConversationId('');
      setConversationMessages([]);
      setSelectedTopic('');
      setMessage('');
      setAnonymousName('');

      setAuthIntent(
        'conversation'
      );

      setError('');

      /* -----------------------------------------------
         ADMIN LOGOUT
         ----------------------------------------------- */

      if (wasAdmin) {
        navigateReplace('/admin');

        setScreen(
          'admin-auth'
        );

        return;
      }

      /* -----------------------------------------------
         NORMAL LOGOUT
         ----------------------------------------------- */

      navigateReplace('/');

      setScreen('home');
    }
  };

  /* =======================================================
     CREATE CONVERSATION
     ======================================================= */

  const handleCreateConversation =
    async () => {
      if (
        isCreatingConversation
      ) {
        return;
      }

      try {
        setError('');

        setIsCreatingConversation(
          true
        );

        const result =
          await conversations.create({
            topic: selectedTopic,
            message,
          });

        const newConversationId =
          result?.conversation?.id ||
          result?.id;

        if (
          !newConversationId
        ) {
          throw new Error(
            'Conversation could not be created.'
          );
        }

        setConversationId(
          newConversationId
        );

        sessionStorage.setItem(
          ACTIVE_CONVERSATION_KEY,
          newConversationId
        );

        setConversationMessages(
          result.messages || []
        );

        setScreen(
          'conversation'
        );
      } catch (error) {
        console.error(
          'Unable to create conversation:',
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : 'Unable to start your conversation.'
        );
      } finally {
        setIsCreatingConversation(
          false
        );
      }
    };

  /* =======================================================
     CONVERSATION BACK
     ======================================================= */

  const handleConversationBack =
    () => {
      setError('');

      if (
        isAuthenticated
      ) {
        setScreen(
          'dashboard'
        );

        return;
      }

      setScreen('home');
    };

  /* =======================================================
     ADMIN AUTH
     ======================================================= */

  if (
    screen === 'admin-auth'
  ) {
    return (
      <>
        <AdminAuth
          onBack={() => {
            setError('');

            navigateReplace('/');

            setScreen(
              'home'
            );
          }}
          onAuthenticated={() => {
            setError('');

            setIsAuthenticated(
              true
            );

            setIsProfessional(
              false
            );

            navigate(
              '/admin/dashboard'
            );

            setScreen(
              'admin-dashboard'
            );
          }}
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     ADMIN DASHBOARD
     ======================================================= */

  if (
    screen ===
    'admin-dashboard'
  ) {
    return (
      <>
        <AdminDashboard
          onLogout={
            handleLogout
          }
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     START TALKING
     ======================================================= */

  if (
    screen ===
    'start-talking'
  ) {
    return (
      <>
        <StartTalking
          onBack={() => {
            setError('');

            if (
              isAuthenticated
            ) {
              setScreen(
                'dashboard'
              );

              return;
            }

            setScreen('home');
          }}
          onUser={() => {
            setError('');

            setAuthIntent(
              'conversation'
            );

            setSelectedTopic('');
            setMessage('');

            setScreen(
              'categories'
            );
          }}
          onProfessional={() => {
            setError('');

            setScreen(
              'professional-auth'
            );
          }}
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     CATEGORIES
     ======================================================= */

  if (
    screen === 'categories'
  ) {
    return (
      <>
        <Categories
          onBack={() => {
            setError('');

            setScreen(
              'start-talking'
            );
          }}
          onSelect={(topic) => {
            setError('');

            setSelectedTopic(
              topic
            );

            setMessage('');

            setScreen(
              'compose'
            );
          }}
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     COMPOSE
     ======================================================= */

  if (
    screen === 'compose'
  ) {
    return (
      <>
        <Compose
          topic={
            selectedTopic
          }
          onBack={() => {
            setError('');

            setScreen(
              'categories'
            );
          }}
          onContinue={
            handleComposeContinue
          }
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     IDENTITY
     ======================================================= */

  if (
    screen === 'identity'
  ) {
    return (
      <>
        <Identity
          message={
            message
          }
          onBack={() => {
            setError('');

            setScreen(
              'compose'
            );
          }}
          onContinue={() => {
            setError('');

            setScreen(
              'auth'
            );
          }}
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     NORMAL AUTH
     ======================================================= */

  if (
    screen === 'auth'
  ) {
    return (
      <>
        <Auth
          onBack={() => {
  setError('');

  if (
    authIntent === 'community' ||
    authIntent === 'login'
  ) {
    setScreen('home');
    return;
  }

  setScreen('identity');
}}

          onAuthenticated={
            handleAuthenticated
          }
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     PROFESSIONAL AUTH
     ======================================================= */

  if (
    screen ===
    'professional-auth'
  ) {
    return (
      <>
        <ProfessionalAuth
          onBack={() => {
  setError('');

  if (authIntent === 'login') {
    setScreen('home');
    return;
  }

  setScreen('start-talking');
}}
          onAuthenticated={
            handleAuthenticated
          }
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     PROFESSIONAL DASHBOARD
     ======================================================= */

  if (
    screen ===
    'professional-dashboard'
  ) {
    return (
      <>
        <ProfessionalDashboard
          onLogout={
            handleLogout
          }
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     CONVERSATION
     ======================================================= */

  if (
    screen === 'conversation'
  ) {
    return (
      <>
        <Conversation
          conversationId={
            conversationId
          }
          anonymousName={
            anonymousName
          }
          messages={
            conversationMessages
          }
          onBack={
            handleConversationBack
          }
          onAddMessage={(
            newMessage
          ) => {
            setConversationMessages(
              (
                currentMessages
              ) => [
                ...currentMessages,
                newMessage,
              ]
            );
          }}
          onStartNewConversation={() => {
            setError('');

            sessionStorage.removeItem(
              ACTIVE_CONVERSATION_KEY
            );

            setConversationId('');
            setConversationMessages([]);
            setSelectedTopic('');
            setMessage('');

            setAuthIntent(
              'conversation'
            );

            setScreen(
              'start-talking'
            );
          }}
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     USER DASHBOARD
     ======================================================= */

  if (
    screen === 'dashboard'
  ) {
    return (
      <>
        <UserDashboard
          onStartConversation={() => {
            setError('');

            setAuthIntent(
              'conversation'
            );

            setSelectedTopic('');
            setMessage('');

            setScreen(
              'start-talking'
            );
          }}
          onOpenConversation={(
            id
          ) => {
            setError('');

            setConversationId(
              id
            );

            sessionStorage.setItem(
              ACTIVE_CONVERSATION_KEY,
              id
            );

            setScreen(
              'conversation'
            );
          }}
          onCommunity={() => {
            setError('');

            setScreen(
              'community'
            );
          }}
          onLogout={
            handleLogout
          }
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     COMMUNITY
     ======================================================= */

  if (
    screen === 'community'
  ) {
    return (
      <>
        <Community
          onBack={() => {
            setError('');

            if (
              isAuthenticated
            ) {
              setScreen(
                'dashboard'
              );

              return;
            }

            setScreen('home');
          }}
          onStartPost={() => {
            setError('');

            setScreen(
              'create-community-post'
            );
          }}
          onOpenPost={(postId) => {
            console.log(
              'Open post:',
              postId
            );
          }}
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     CREATE COMMUNITY POST
     ======================================================= */

  if (
    screen ===
    'create-community-post'
  ) {
    return (
      <>
        <CreateCommunityPost
          onBack={() => {
            setError('');

            setScreen(
              'community'
            );
          }}
          onPublished={(postId) => {
            console.log(
              'Published post:',
              postId
            );

            setScreen(
              'community'
            );
          }}
        />

        {errorBanner}
      </>
    );
  }

  /* =======================================================
     PUBLIC HOME
     ======================================================= */

  return (
    <>
      <Home
  onStart={handleStart}
  onCommunity={handleOpenCommunity}
  onUserLogin={handleUserLogin}
  onProfessionalLogin={handleProfessionalLogin}
/>

      {errorBanner}
    </>
  );
}

export default App;