
import { useEffect, useState } from 'react';

import {
  adminApi,
  auth,
  type AdminDashboard as AdminDashboardData,
  type AdminProfessional,
  type AdminUser,
  type AdminCommunityReport,
  type CommunityReportStatus,
  type CommunityModerationAction,
} from '../services/api';

import '../styles/admin.css';

import '../styles/admin.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminTab =
  | 'overview'
  | 'professionals'
  | 'users'
  | 'reports';

function AdminDashboard({
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] =
    useState<AdminTab>('overview');

  const [dashboard, setDashboard] =
    useState<AdminDashboardData | null>(null);

  const [professionals, setProfessionals] =
    useState<AdminProfessional[]>([]);

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [reports, setReports] =
    useState<AdminCommunityReport[]>([]);

  const [pendingReportCount, setPendingReportCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [reportsLoading, setReportsLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [reportFilter, setReportFilter] =
    useState<CommunityReportStatus | ''>('');

  const [selectedReport, setSelectedReport] =
    useState<AdminCommunityReport | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Load dashboard
  |--------------------------------------------------------------------------
  */

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        dashboardResponse,
        professionalsResponse,
        usersResponse,
      ] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getProfessionals(),
        adminApi.getUsers(100, 0),
      ]);

      if (dashboardResponse.success) {
        setDashboard(
          dashboardResponse.dashboard
        );
      }

      if (professionalsResponse.success) {
        setProfessionals(
          professionalsResponse.professionals
        );
      }

      if (usersResponse.success) {
        setUsers(
          usersResponse.users
        );
      }
    } catch (err) {
      console.error(
        'Failed to load admin dashboard:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load administrator dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load community reports
  |--------------------------------------------------------------------------
  */

  const loadReports = async (
    status?: CommunityReportStatus
  ) => {
    try {
      setReportsLoading(true);
      setError('');

      const response =
        await adminApi.getCommunityReports(
          100,
          0,
          status
        );

      if (response.success) {
        setReports(
          response.reports
        );

        setPendingReportCount(
          response.pendingCount
        );
      }
    } catch (err) {
      console.error(
        'Failed to load community reports:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load community reports.'
      );
    } finally {
      setReportsLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadDashboard();
    loadReports();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Reload reports when filter changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (activeTab !== 'reports') {
      return;
    }

    loadReports(
      reportFilter || undefined
    );
  }, [
    activeTab,
    reportFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Clear notifications
  |--------------------------------------------------------------------------
  */

  const clearNotifications = () => {
    setError('');
    setSuccess('');
  };

  /*
  |--------------------------------------------------------------------------
  | Refresh everything
  |--------------------------------------------------------------------------
  */

  const handleRefresh = async () => {
    clearNotifications();

    await Promise.all([
      loadDashboard(),
      loadReports(
        reportFilter || undefined
      ),
    ]);

    setSuccess(
      'Dashboard refreshed successfully.'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Professional moderation
  |--------------------------------------------------------------------------
  */

  const handleProfessionalAction = async (
    professionalId: string,
    action: 'approve' | 'reject'
  ) => {
    try {
      setActionLoading(
        `professional-${professionalId}`
      );

      clearNotifications();

      if (action === 'approve') {
        await adminApi.approveProfessional(
          professionalId
        );

        setSuccess(
          'Professional application approved.'
        );
      } else {
        await adminApi.rejectProfessional(
          professionalId
        );

        setSuccess(
          'Professional application rejected.'
        );
      }

      await loadDashboard();

      const response =
        await adminApi.getProfessionals();

      if (response.success) {
        setProfessionals(
          response.professionals
        );
      }
    } catch (err) {
      console.error(
        'Professional moderation failed:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update professional application.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | User moderation
  |--------------------------------------------------------------------------
  */

  const handleUserAction = async (
    userId: string,
    action: 'suspend' | 'reactivate'
  ) => {
    try {
      setActionLoading(
        `user-${userId}`
      );

      clearNotifications();

      if (action === 'suspend') {
        await adminApi.suspendUser(
          userId
        );

        setSuccess(
          'User account suspended.'
        );
      } else {
        await adminApi.reactivateUser(
          userId
        );

        setSuccess(
          'User account reactivated.'
        );
      }

      const response =
        await adminApi.getUsers(
          100,
          0
        );

      if (response.success) {
        setUsers(
          response.users
        );
      }

      await loadDashboard();
    } catch (err) {
      console.error(
        'User moderation failed:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update user account.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Community moderation
  |--------------------------------------------------------------------------
  */

  const handleReportAction = async (
    report: AdminCommunityReport,
    action: CommunityModerationAction
  ) => {
    try {
      setActionLoading(
        `report-${report.id}`
      );

      clearNotifications();

      await adminApi.reviewCommunityReport(
  report.id,
  action
);

      const messages = {
        KEEP:
          'Content kept. The report was dismissed.',
        HIDE:
          'Content has been hidden from the community.',
        REMOVE:
          'Content has been removed from the community.',
      };

      setSuccess(
        messages[action]
      );

      setSelectedReport(null);

      await loadReports(
        reportFilter || undefined
      );
    } catch (err) {
      console.error(
        'Community moderation failed:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to moderate reported content.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error(
        'Admin logout failed:',
        err
      );
    } finally {
      onLogout();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatDate = (
    value: string
  ) => {
    try {
      return new Date(
        value
      ).toLocaleString();
    } catch {
      return value;
    }
  };

  const getReportTarget = (
    report: AdminCommunityReport
  ) => {
    if (report.post) {
      return 'Community post';
    }

    if (report.reply) {
      return 'Community reply';
    }

    return 'Community content';
  };

  const getStatusClass = (
    status: string
  ) => {
    return status
      .toLowerCase()
      .replace(/\s+/g, '-');
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="jt-admin-page">
        <aside className="jt-admin-sidebar">
          <div className="jt-auth-brand">
            <div className="jt-auth-logo">
              JT
            </div>

            <div>
              <div className="jt-auth-brand-name">
                Just Talk
              </div>

              <div className="jt-auth-brand-subtitle">
                Administration
              </div>
            </div>
          </div>
        </aside>

        <section className="jt-admin-content">
          <div className="jt-admin-loading">
            <div className="jt-admin-spinner" />
            <p>
              Loading administrator dashboard...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="jt-admin-page">
      {/* =========================================================
          SIDEBAR
      ========================================================= */}

      <aside className="jt-admin-sidebar">
        <div>
          <div className="jt-auth-brand">
            <div className="jt-auth-logo">
              JT
            </div>

            <div>
              <div className="jt-auth-brand-name">
                Just Talk
              </div>

              <div className="jt-auth-brand-subtitle">
                Administration
              </div>
            </div>
          </div>

          <nav className="jt-admin-nav">
            <button
              type="button"
              className={
                activeTab === 'overview'
                  ? 'active'
                  : ''
              }
              onClick={() => {
                clearNotifications();
                setActiveTab('overview');
              }}
            >
              <span>⌂</span>
              Overview
            </button>

            <button
              type="button"
              className={
                activeTab === 'professionals'
                  ? 'active'
                  : ''
              }
              onClick={() => {
                clearNotifications();
                setActiveTab(
                  'professionals'
                );
              }}
            >
              <span>⌂</span>
              Professionals

              {dashboard &&
                dashboard.professionals
                  .pending > 0 && (
                  <span className="jt-admin-nav-count">
                    {
                      dashboard
                        .professionals
                        .pending
                    }
                  </span>
                )}
            </button>

            <button
              type="button"
              className={
                activeTab === 'users'
                  ? 'active'
                  : ''
              }
              onClick={() => {
                clearNotifications();
                setActiveTab('users');
              }}
            >
              <span>♙</span>
              Users
            </button>

            <button
              type="button"
              className={
                activeTab === 'reports'
                  ? 'active'
                  : ''
              }
              onClick={() => {
                clearNotifications();
                setActiveTab('reports');
              }}
            >
              <span>⚑</span>
              Reports

              {pendingReportCount > 0 && (
                <span className="jt-admin-nav-count jt-admin-nav-count-alert">
                  {pendingReportCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="jt-admin-sidebar-bottom">
          <button
            type="button"
            className="jt-admin-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <section className="jt-admin-content">
        <header className="jt-admin-header">
          <div>
            <span className="jt-auth-eyebrow">
              JUST TALK ADMIN
            </span>

            <h1>
              {activeTab === 'overview' &&
                'Platform overview'}

              {activeTab ===
                'professionals' &&
                'Professional applications'}

              {activeTab === 'users' &&
                'User management'}

              {activeTab === 'reports' &&
                'Community reports'}
            </h1>

            <p>
              {activeTab === 'overview' &&
                'Monitor the platform and its activity.'}

              {activeTab ===
                'professionals' &&
                'Review professional applications and verification status.'}

              {activeTab === 'users' &&
                'Manage user accounts and platform access.'}

              {activeTab === 'reports' &&
                'Review reports submitted by the Just Talk community.'}
            </p>
          </div>

          <button
            type="button"
            className="jt-admin-refresh"
            onClick={handleRefresh}
            disabled={
              loading ||
              reportsLoading
            }
          >
            ↻ Refresh
          </button>
        </header>

        {/* =====================================================
            NOTIFICATIONS
        ===================================================== */}

        {error && (
          <div className="jt-admin-alert jt-admin-alert-error">
            <span>!</span>
            {error}
          </div>
        )}

        {success && (
          <div className="jt-admin-alert jt-admin-alert-success">
            <span>✓</span>
            {success}
          </div>
        )}

        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        {activeTab === 'overview' &&
          dashboard && (
            <>
              <div className="jt-admin-stat-grid">
                <div className="jt-admin-stat-card">
                  <span className="jt-admin-stat-label">
                    Total users
                  </span>

                  <strong>
                    {dashboard.users.total}
                  </strong>

                  <small>
                    {dashboard.users.active}{' '}
                    active
                  </small>
                </div>

                <div className="jt-admin-stat-card">
                  <span className="jt-admin-stat-label">
                    Conversations
                  </span>

                  <strong>
                    {
                      dashboard
                        .conversations
                        .total
                    }
                  </strong>

                  <small>
                    {
                      dashboard
                        .conversations
                        .active
                    }{' '}
                    active
                  </small>
                </div>

                <div className="jt-admin-stat-card">
                  <span className="jt-admin-stat-label">
                    Professionals
                  </span>

                  <strong>
                    {
                      dashboard
                        .professionals
                        .approved
                    }
                  </strong>

                  <small>
                    {
                      dashboard
                        .professionals
                        .available
                    }{' '}
                    available
                  </small>
                </div>

                <div className="jt-admin-stat-card">
                  <span className="jt-admin-stat-label">
                    Reports
                  </span>

                  <strong>
                    {pendingReportCount}
                  </strong>

                  <small>
                    pending community
                    reports
                  </small>
                </div>
              </div>

              <div className="jt-admin-panel-grid">
                <section className="jt-admin-panel">
                  <div className="jt-admin-section-intro">
                    <div>
                      <span>
                        USERS
                      </span>

                      <h2>
                        Account status
                      </h2>
                    </div>
                  </div>

                  <div className="jt-admin-status-list">
                    <div>
                      <span>
                        Active
                      </span>

                      <strong>
                        {
                          dashboard
                            .users
                            .active
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Suspended
                      </span>

                      <strong>
                        {
                          dashboard
                            .users
                            .suspended
                        }
                      </strong>
                    </div>
                  </div>
                </section>

                <section className="jt-admin-panel">
                  <div className="jt-admin-section-intro">
                    <div>
                      <span>
                        PROFESSIONALS
                      </span>

                      <h2>
                        Verification
                      </h2>
                    </div>
                  </div>

                  <div className="jt-admin-status-list">
                    <div>
                      <span>
                        Pending
                      </span>

                      <strong>
                        {
                          dashboard
                            .professionals
                            .pending
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Approved
                      </span>

                      <strong>
                        {
                          dashboard
                            .professionals
                            .approved
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Available
                      </span>

                      <strong>
                        {
                          dashboard
                            .professionals
                            .available
                        }
                      </strong>
                    </div>
                  </div>
                </section>

                <section className="jt-admin-panel">
                  <div className="jt-admin-section-intro">
                    <div>
                      <span>
                        COMMUNITY
                      </span>

                      <h2>
                        Moderation
                      </h2>
                    </div>
                  </div>

                  <div className="jt-admin-status-list">
                    <div>
                      <span>
                        Pending reports
                      </span>

                      <strong>
                        {
                          pendingReportCount
                        }
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="jt-admin-action"
                    onClick={() =>
                      setActiveTab(
                        'reports'
                      )
                    }
                  >
                    Review reports →
                  </button>
                </section>
              </div>
            </>
          )}

        {/* =====================================================
            PROFESSIONALS
        ===================================================== */}

        {activeTab ===
          'professionals' && (
          <section className="jt-admin-panel">
            <div className="jt-admin-section-intro">
              <div>
                <span>
                  APPLICATIONS
                </span>

                <h2>
                  Professional applications
                </h2>
              </div>
            </div>

            {professionals.length ===
            0 ? (
              <div className="jt-admin-empty">
                No professional
                applications found.
              </div>
            ) : (
              <div className="jt-admin-table-wrap">
                <table className="jt-admin-table">
                  <thead>
                    <tr>
                      <th>
                        Professional
                      </th>

                      <th>
                        Categories
                      </th>

                      <th>
                        Verification
                      </th>

                      <th>
                        Availability
                      </th>

                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {professionals.map(
                      (
                        professional
                      ) => (
                        <tr
                          key={
                            professional.id
                          }
                        >
                          <td>
                            <div className="jt-admin-person">
                              <strong>
                                {
                                  professional.displayName
                                }
                              </strong>

                              <span>
                                {
                                  professional.email
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="jt-admin-tags">
                              {professional.categories?.map(
                                (
                                  category
                                ) => (
                                  <span
                                    key={
                                      category
                                    }
                                  >
                                    {
                                      category
                                    }
                                  </span>
                                )
                              )}
                            </div>
                          </td>

                          <td>
                            <span
                              className={`jt-admin-badge ${getStatusClass(
                                professional.verificationStatus
                              )}`}
                            >
                              {
                                professional.verificationStatus
                              }
                            </span>
                          </td>

                          <td>
                            <span
                              className={`jt-admin-badge ${getStatusClass(
                                professional.availabilityStatus
                              )}`}
                            >
                              {
                                professional.availabilityStatus
                              }
                            </span>
                          </td>

                          <td>
                            {professional.verificationStatus ===
                              'PENDING' && (
                              <div className="jt-admin-actions">
                                <button
                                  type="button"
                                  className="jt-admin-action jt-admin-action-approve"
                                  disabled={
                                    actionLoading ===
                                    `professional-${professional.id}`
                                  }
                                  onClick={() =>
                                    handleProfessionalAction(
                                      professional.id,
                                      'approve'
                                    )
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  className="jt-admin-action jt-admin-action-reject"
                                  disabled={
                                    actionLoading ===
                                    `professional-${professional.id}`
                                  }
                                  onClick={() =>
                                    handleProfessionalAction(
                                      professional.id,
                                      'reject'
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            USERS
        ===================================================== */}

        {activeTab === 'users' && (
          <section className="jt-admin-panel">
            <div className="jt-admin-section-intro">
              <div>
                <span>
                  ACCOUNTS
                </span>

                <h2>
                  User management
                </h2>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="jt-admin-empty">
                No users found.
              </div>
            ) : (
              <div className="jt-admin-table-wrap">
                <table className="jt-admin-table">
                  <thead>
                    <tr>
                      <th>
                        User
                      </th>

                      <th>
                        Role
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Conversations
                      </th>

                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map(
                      (user) => (
                        <tr
                          key={
                            user.id
                          }
                        >
                          <td>
                            <div className="jt-admin-person">
                              <strong>
                                {
                                  user.email
                                }
                              </strong>

                              <span>
                                Joined{' '}
                                {formatDate(
                                  user.createdAt
                                )}
                              </span>
                            </div>
                          </td>

                          <td>
                            <span className="jt-admin-badge">
                              {
                                user.role
                              }
                            </span>
                          </td>

                          <td>
                            <span
                              className={`jt-admin-badge ${getStatusClass(
                                user.accountStatus
                              )}`}
                            >
                              {
                                user.accountStatus
                              }
                            </span>
                          </td>

                          <td>
                            {
                              user.conversationCount
                            }
                          </td>

                          <td>
                            {user.role !==
                              'ADMIN' && (
                              <button
                                type="button"
                                className="jt-admin-action"
                                disabled={
                                  actionLoading ===
                                  `user-${user.id}`
                                }
                                onClick={() =>
                                  handleUserAction(
                                    user.id,
                                    user.accountStatus ===
                                      'SUSPENDED'
                                      ? 'reactivate'
                                      : 'suspend'
                                  )
                                }
                              >
                                {user.accountStatus ===
                                'SUSPENDED'
                                  ? 'Reactivate'
                                  : 'Suspend'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            REPORTS
        ===================================================== */}

        {activeTab === 'reports' && (
          <section className="jt-admin-panel">
            <div className="jt-admin-section-intro jt-admin-report-header">
              <div>
                <span>
                  COMMUNITY MODERATION
                </span>

                <h2>
                  Reported content
                </h2>

                <p>
                  Review community posts and
                  replies reported by users.
                </p>
              </div>

              <div className="jt-admin-report-filters">
                <button
                  type="button"
                  className={
                    reportFilter === ''
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setReportFilter('')
                  }
                >
                  All
                </button>

                <button
                  type="button"
                  className={
                    reportFilter ===
                    'PENDING'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setReportFilter(
                      'PENDING'
                    )
                  }
                >
                  Pending
                </button>

                <button
                  type="button"
                  className={
                    reportFilter ===
                    'RESOLVED'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setReportFilter(
                      'RESOLVED'
                    )
                  }
                >
                  Resolved
                </button>

                <button
                  type="button"
                  className={
                    reportFilter ===
                    'DISMISSED'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setReportFilter(
                      'DISMISSED'
                    )
                  }
                >
                  Dismissed
                </button>
              </div>
            </div>

            {reportsLoading ? (
              <div className="jt-admin-loading">
                <div className="jt-admin-spinner" />

                <p>
                  Loading community reports...
                </p>
              </div>
            ) : reports.length ===
              0 ? (
              <div className="jt-admin-empty">
                <div className="jt-admin-empty-icon">
                  ✓
                </div>

                <h3>
                  No reports found
                </h3>

                <p>
                  There are no reports matching
                  this filter.
                </p>
              </div>
            ) : (
              <div className="jt-admin-report-list">
                {reports.map(
                  (report) => {
                    const target =
                      report.post ||
                      report.reply;

                    return (
                      <article
                        className="jt-admin-report-card"
                        key={
                          report.id
                        }
                      >
                        <div className="jt-admin-report-top">
                          <div>
                            <span className="jt-admin-report-reason">
                              {report.reason.replace(
                                /_/g,
                                ' '
                              )}
                            </span>

                            <span
                              className={`jt-admin-badge ${getStatusClass(
                                report.status
                              )}`}
                            >
                              {
                                report.status
                              }
                            </span>
                          </div>

                          <span className="jt-admin-report-date">
                            {formatDate(
                              report.createdAt
                            )}
                          </span>
                        </div>

                        <div className="jt-admin-report-content">
                          <span className="jt-admin-report-target">
                            {getReportTarget(
                              report
                            )}
                          </span>

                          {report.post && (
                            <>
                              <h3>
                                {
                                  report
                                    .post
                                    .title
                                }
                              </h3>

                              <p>
                                {report.post.body.length >
                                280
                                  ? `${report.post.body.slice(
                                      0,
                                      280
                                    )}...`
                                  : report.post.body}
                              </p>

                              <div className="jt-admin-report-meta">
                                <span>
                                  Anonymous:
                                </span>

                                <strong>
                                  {
                                    report
                                      .post
                                      .anonymousName
                                  }
                                </strong>

                                <span>
                                  •
                                </span>

                                <span>
                                  {
                                    report
                                      .post
                                      .category
                                      .name
                                  }
                                </span>
                              </div>
                            </>
                          )}

                          {report.reply && (
                            <>
                              <p>
                                {report.reply.body.length >
                                280
                                  ? `${report.reply.body.slice(
                                      0,
                                      280
                                    )}...`
                                  : report.reply.body}
                              </p>

                              <div className="jt-admin-report-meta">
                                <span>
                                  Anonymous:
                                </span>

                                <strong>
                                  {
                                    report
                                      .reply
                                      .anonymousName
                                  }
                                </strong>
                              </div>
                            </>
                          )}
                        </div>

                        {report.details && (
                          <div className="jt-admin-report-details">
                            <span>
                              Reporter's note
                            </span>

                            <p>
                              {
                                report.details
                              }
                            </p>
                          </div>
                        )}

                        <div className="jt-admin-report-footer">
                          <span>
                            Report ID:{' '}
                            {report.id.slice(
                              0,
                              8
                            )}
                            ...
                          </span>

                          <button
                            type="button"
                            className="jt-admin-action"
                            onClick={() =>
                              setSelectedReport(
                                report
                              )
                            }
                          >
                            Review report →
                          </button>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}
      </section>

      {/* =========================================================
          REPORT REVIEW MODAL
      ========================================================= */}

      {selectedReport && (
        <div
          className="jt-admin-modal-backdrop"
          onClick={() =>
            setSelectedReport(null)
          }
        >
          <section
            className="jt-admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="jt-admin-modal-close"
              onClick={() =>
                setSelectedReport(null)
              }
              aria-label="Close"
            >
              ×
            </button>

            <span className="jt-auth-eyebrow">
              COMMUNITY MODERATION
            </span>

            <h2>
              Review report
            </h2>

            <div className="jt-admin-review-status">
              <span>
                Report reason
              </span>

              <strong>
                {selectedReport.reason.replace(
                  /_/g,
                  ' '
                )}
              </strong>
            </div>

            <div className="jt-admin-review-section">
              <span>
                Reported content
              </span>

              {selectedReport.post && (
                <>
                  <h3>
                    {
                      selectedReport
                        .post
                        .title
                    }
                  </h3>

                  <div className="jt-admin-review-author">
                    Anonymous identity:{' '}
                    <strong>
                      {
                        selectedReport
                          .post
                          .anonymousName
                      }
                    </strong>
                  </div>

                  <div className="jt-admin-review-category">
                    {
                      selectedReport
                        .post
                        .category
                        .name
                    }
                  </div>

                  <p className="jt-admin-review-body">
                    {
                      selectedReport
                        .post
                        .body
                    }
                  </p>
                </>
              )}

              {selectedReport.reply && (
                <>
                  <div className="jt-admin-review-author">
                    Anonymous identity:{' '}
                    <strong>
                      {
                        selectedReport
                          .reply
                          .anonymousName
                      }
                    </strong>
                  </div>

                  <p className="jt-admin-review-body">
                    {
                      selectedReport
                        .reply
                        .body
                    }
                  </p>
                </>
              )}
            </div>

            {selectedReport.details && (
              <div className="jt-admin-review-section">
                <span>
                  Reporter's note
                </span>

                <p>
                  {
                    selectedReport.details
                  }
                </p>
              </div>
            )}

            <div className="jt-admin-review-section">
              <span>
                Reported
              </span>

              <p>
                {formatDate(
                  selectedReport.createdAt
                )}
              </p>
            </div>

            <div className="jt-admin-moderation-actions">
              <button
                type="button"
                className="jt-admin-action jt-admin-action-approve"
                disabled={
                  actionLoading ===
                  `report-${selectedReport.id}`
                }
                onClick={() =>
                  handleReportAction(
                    selectedReport,
                    'KEEP'
                  )
                }
              >
                Keep content
              </button>

              <button
                type="button"
                className="jt-admin-action"
                disabled={
                  actionLoading ===
                  `report-${selectedReport.id}`
                }
                onClick={() =>
                  handleReportAction(
                    selectedReport,
                    'HIDE'
                  )
                }
              >
                Hide content
              </button>

              <button
                type="button"
                className="jt-admin-action jt-admin-action-reject"
                disabled={
                  actionLoading ===
                  `report-${selectedReport.id}`
                }
                onClick={() =>
                  handleReportAction(
                    selectedReport,
                    'REMOVE'
                  )
                }
              >
                Remove content
              </button>
            </div>

            <p className="jt-admin-modal-note">
              Moderation affects only the reported
              community content. The reporter's
              anonymous identity is not displayed
              here as a real account identity.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}

export default AdminDashboard;
