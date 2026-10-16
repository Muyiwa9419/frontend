const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

interface ApiError {
  success?: boolean;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export type ProfessionalVerificationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';

export type ProfessionalAvailabilityStatus =
  | 'AVAILABLE'
  | 'OFFLINE'
  | 'BUSY';

export type AccountType =
  | 'user'
  | 'professional'
  | 'admin';

export interface ProfessionalAccount {
  id: string;
  displayName: string;
  verificationStatus:
    ProfessionalVerificationStatus;
  availabilityStatus:
    ProfessionalAvailabilityStatus;
}

/*
|--------------------------------------------------------------------------
| API Request Helper
|--------------------------------------------------------------------------
*/

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      credentials: 'include',

      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }
  );

  let data: ApiError & T;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      'The server returned an invalid response.'
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Something went wrong. Please try again.'
    );
  }

  return data;
};


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

export const auth = {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  register: async (
    email: string,
    password: string
  ) => {
    return request<{
      success: boolean;
      message: string;

      user: {
        id: string;
        anonymousName: string;
        accountStatus: string;
        createdAt: string;
      };
    }>('/auth/register', {
      method: 'POST',

      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Normal User Login
  |--------------------------------------------------------------------------
  */

  login: async (
    email: string,
    password: string
  ) => {
    return request<{
      success: boolean;
      message: string;

      accountType:
        | 'user'
        | 'professional'
        | 'admin';

      user: {
        id: string;
        anonymousName: string | null;
        role?: string;
      };

      professional:
        | ProfessionalAccount
        | null;
    }>('/auth/login', {
      method: 'POST',

      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Professional Login
  |--------------------------------------------------------------------------
  */

  professionalLogin: async (
    email: string,
    password: string
  ) => {
    return request<{
      success: boolean;
      message: string;

      accountType: 'professional';

      user: {
        id: string;
        anonymousName: string | null;
      };

      professional: ProfessionalAccount;
    }>('/auth/professional-login', {
      method: 'POST',

      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Admin Login
  |--------------------------------------------------------------------------
  */

  adminLogin: async (
    email: string,
    password: string
  ) => {
    return request<{
      success: boolean;
      message: string;

      accountType: 'admin';

      user: {
        id: string;
        anonymousName: string | null;
      };

      professional: null;
    }>('/auth/admin-login', {
      method: 'POST',

      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Current Authenticated Account
  |--------------------------------------------------------------------------
  */

  me: async () => {
    return request<{
      success: boolean;

      accountType:
        | 'user'
        | 'professional'
        | 'admin';

      user: {
        id: string;
        anonymousName: string | null;
        role?: string;
      };

      professional:
        | ProfessionalAccount
        | null;
    }>('/auth/me');
  },

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  logout: async () => {
    return request<{
      success: boolean;
      message: string;
    }>('/auth/logout', {
      method: 'POST',
    });
  },
};


/*
|--------------------------------------------------------------------------
| Professional API
|--------------------------------------------------------------------------
*/

export const professionalApi = {
  /*
  |--------------------------------------------------------------------------
  | Create Professional Profile
  |--------------------------------------------------------------------------
  */

  create: async (
    displayName: string,
    bio: string,
    categories: string[]
  ) => {
    return request<{
      success: boolean;

      professional: {
        id: string;
        displayName: string;
        bio: string;
        categories: string[];

        verificationStatus:
          | 'PENDING'
          | 'APPROVED'
          | 'REJECTED'
          | 'SUSPENDED';

        availabilityStatus:
          | 'AVAILABLE'
          | 'OFFLINE'
          | 'BUSY';

        createdAt: string;
        updatedAt: string;
      };

      message: string;
    }>('/professionals', {
      method: 'POST',

      body: JSON.stringify({
        displayName,
        bio,
        categories,
      }),
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Get My Professional Profile
  |--------------------------------------------------------------------------
  */

  getProfile: async () => {
    return request<{
      success: boolean;

      professional: {
        id: string;
        displayName: string;
        bio: string;
        categories: string[];

        verificationStatus:
          | 'PENDING'
          | 'APPROVED'
          | 'REJECTED'
          | 'SUSPENDED';

        availabilityStatus:
          | 'AVAILABLE'
          | 'OFFLINE'
          | 'BUSY';

        createdAt: string;
        updatedAt: string;
      };
    }>('/professionals/me');
  },

  /*
  |--------------------------------------------------------------------------
  | Professional Dashboard
  |--------------------------------------------------------------------------
  */

  getDashboard: async () => {
    return request<{
      success: boolean;

      professional: {
        id: string;
        userId: string;
        displayName: string;
        bio: string;
        categories: string[];

        verificationStatus:
          | 'PENDING'
          | 'APPROVED'
          | 'REJECTED'
          | 'SUSPENDED';

        availabilityStatus:
          | 'AVAILABLE'
          | 'OFFLINE'
          | 'BUSY';

        createdAt: string;
        updatedAt: string;
      };

      incomingMatch: {
        id: string;
        conversationId: string;
        category: string;
        status: string;
        topic: string;
        conversationStatus: string;
        createdAt: string;
        matchedAt: string | null;
        expiresAt: string | null;
      } | null;

      activeConversation: {
        conversationId: string;
        matchingRequestId: string;
        topic: string;
        category: string;
        status: string;
        acceptedAt: string | null;
        createdAt: string;
        updatedAt: string;
      } | null;

      stats: {
        pendingMatches: number;
        activeMatches: number;
        completedMatches: number;
        cancelledMatches: number;
      };
    }>('/professionals/me/dashboard');
  },

  /*
  |--------------------------------------------------------------------------
  | Update Professional Profile
  |--------------------------------------------------------------------------
  */

  updateProfile: async (
    data: {
      displayName?: string;
      bio?: string;
      categories?: string[];
    }
  ) => {
    return request<{
      success: boolean;

      professional: {
        id: string;
        displayName: string;
        bio: string;
        categories: string[];

        verificationStatus:
          | 'PENDING'
          | 'APPROVED'
          | 'REJECTED'
          | 'SUSPENDED';

        availabilityStatus:
          | 'AVAILABLE'
          | 'OFFLINE'
          | 'BUSY';

        createdAt: string;
        updatedAt: string;
      };

      message: string;
    }>('/professionals/me', {
      method: 'PATCH',

      body: JSON.stringify(data),
    });
  },
};


/*
|--------------------------------------------------------------------------
| Conversations
|--------------------------------------------------------------------------
*/

export const conversations = {
  /*
  |--------------------------------------------------------------------------
  | Create Conversation
  |--------------------------------------------------------------------------
  */

  create: async (
    topic: string,
    message: string
  ) => {
    return request<{
      success: boolean;

      conversation: {
        id: string;
        topic: string;
        status: string;
        createdAt: string;
      };

      message: {
        id: string;

        sender:
          | 'user'
          | 'professional'
          | 'justtalk';

        text: string;
        timestamp: string;
      };
    }>('/conversations', {
      method: 'POST',

      body: JSON.stringify({
        topic,
        message,
      }),
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Get Conversation
  |--------------------------------------------------------------------------
  */

  get: async (
    conversationId: string
  ) => {
    return request<{
      success: boolean;

      conversation: {
        id: string;
        topic: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        endedAt: string | null;
      };

      messages: Array<{
        id: string;

        sender:
          | 'user'
          | 'professional'
          | 'justtalk';

        text: string;
        timestamp: string;
      }>;
    }>(
      `/conversations/${conversationId}`
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Send Message
  |--------------------------------------------------------------------------
  */

  sendMessage: async (
    conversationId: string,
    message: string
  ) => {
    return request<{
      success: boolean;

      message: {
        id: string;

        sender:
          | 'user'
          | 'professional'
          | 'justtalk';

        text: string;
        timestamp: string;
      };
    }>(
      `/conversations/${conversationId}/messages`,
      {
        method: 'POST',

        body: JSON.stringify({
          message,
        }),
      }
    );
  },

  /*
  |--------------------------------------------------------------------------
  | End Conversation
  |--------------------------------------------------------------------------
  */

  end: async (
    conversationId: string
  ) => {
    return request<{
      success: boolean;

      conversation: {
        id: string;
        status: string;
        endedAt: string;
      };
    }>(
      `/conversations/${conversationId}/end`,
      {
        method: 'PATCH',
      }
    );
  },
};


/*
|--------------------------------------------------------------------------
| Admin Types
|--------------------------------------------------------------------------
*/

export interface AdminDashboard {
  users: {
    total: number;
    active: number;
    suspended: number;
  };

  conversations: {
    total: number;
    active: number;
    completed: number;
  };

  professionals: {
    pending: number;
    approved: number;
    available: number;
    busy: number;
  };

  matching: {
    active: number;
    completed: number;
    cancelled: number;
    expired: number;
  };
}




export interface AdminProfessional {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  bio: string | null;
  categories: string[];

  verificationStatus:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';

  availabilityStatus:
    | 'AVAILABLE'
    | 'OFFLINE'
    | 'BUSY';

  accountStatus: string;

  createdAt: string;
  updatedAt: string;
}


export interface AdminUser {
  id: string;
  email: string;
  phone: string | null;

  accountStatus:
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'DEACTIVATED'
    | 'PENDING_DELETION';

  emailVerified: boolean;
  phoneVerified: boolean;

  role: string;

  professionalVerificationStatus:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'SUSPENDED';

  conversationCount: number;

  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}



/* =========================================================
   COMMUNITY MODERATION
========================================================= */

export type CommunityReportStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'RESOLVED'
  | 'DISMISSED';

export type CommunityReportTarget =
  | 'POST'
  | 'REPLY';

export type CommunityModerationAction =
  | 'KEEP'
  | 'HIDE'
  | 'REMOVE';

export interface AdminCommunityReportPost {
  id: string;
  anonymousName: string;
  title: string;
  body: string;
  status: string;
  replyCount: number;
  reactionCount: number;
  createdAt: string;

  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface AdminCommunityReportReply {
  id: string;
  anonymousName: string;
  body: string;
  status: string;
  createdAt: string;
}

export interface AdminCommunityReport {
  id: string;

  targetType: CommunityReportTarget;

  postId: string | null;
  replyId: string | null;

  reason: string;
  details: string | null;

  status: CommunityReportStatus;

  createdAt: string;
  reviewedAt: string | null;

  reviewerEmail: string | null;

  post: AdminCommunityReportPost | null;
  reply: AdminCommunityReportReply | null;
}

export interface AdminCommunityReportsResponse {
  success: boolean;
  reports: AdminCommunityReport[];

  pagination: {
    limit: number;
    offset: number;
    returned: number;
    total: number;
  };

  pendingCount: number;

  message?: string;
}

export interface AdminCommunityReportResponse {
  success: boolean;
  report: AdminCommunityReport;
  message?: string;
}


/*
|--------------------------------------------------------------------------
| Admin API
|--------------------------------------------------------------------------
*/

export const adminApi = {
  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

      /*
  |--------------------------------------------------------------------------
  | Community Reports
  |--------------------------------------------------------------------------
  */

  getCommunityReports: async (
    limit = 50,
    offset = 0,
    status?: CommunityReportStatus
  ) => {
    const params = new URLSearchParams();

    params.set('limit', String(limit));
    params.set('offset', String(offset));

    if (status) {
      params.set('status', status);
    }

    return request<AdminCommunityReportsResponse>(
      `/admin/community/reports?${params.toString()}`
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Review Community Report
  |--------------------------------------------------------------------------
  */

  reviewCommunityReport: async (
    reportId: string,
    action: CommunityModerationAction
  ) => {
    return request<AdminCommunityReportResponse>(
      `/admin/community/reports/${reportId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          action,
        }),
      }
    );
  },


  getDashboard: async () => {
    return request<{
      success: boolean;
      dashboard: AdminDashboard;
    }>('/admin/dashboard');
  },

  /*
  |--------------------------------------------------------------------------
  | Professional Applications
  |--------------------------------------------------------------------------
  */

  getProfessionals: async () => {
    return request<{
      success: boolean;
      professionals: AdminProfessional[];
    }>('/admin/professionals');
  },

  /*
  |--------------------------------------------------------------------------
  | Approve Professional
  |--------------------------------------------------------------------------
  */

  approveProfessional: async (
    professionalId: string
  ) => {
    return request<{
      success: boolean;
      professional: AdminProfessional;
      message: string;
    }>(
      `/admin/professionals/${professionalId}/approve`,
      {
        method: 'PATCH',
      }
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Reject Professional
  |--------------------------------------------------------------------------
  */

  rejectProfessional: async (
    professionalId: string
  ) => {
    return request<{
      success: boolean;
      professional: AdminProfessional;
      message: string;
    }>(
      `/admin/professionals/${professionalId}/reject`,
      {
        method: 'PATCH',
      }
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Users
  |--------------------------------------------------------------------------
  */

  getUsers: async (
    limit = 20,
    offset = 0,
    status?: string
  ) => {
    const params =
      new URLSearchParams();

    params.set(
      'limit',
      String(limit)
    );

    params.set(
      'offset',
      String(offset)
    );

    if (status) {
      params.set(
        'status',
        status
      );
    }

    return request<{
      success: boolean;

      users: AdminUser[];

      pagination: {
        limit: number;
        offset: number;
        hasMore: boolean;
      };
    }>(
      `/admin/users?${params.toString()}`
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Suspend User
  |--------------------------------------------------------------------------
  */

  suspendUser: async (
    userId: string
  ) => {
    return request<{
      success: boolean;

      user: {
        id: string;
        email: string;
        accountStatus: string;
        updatedAt: string;
      };

      message: string;
    }>(
      `/admin/users/${userId}/suspend`,
      {
        method: 'PATCH',
      }
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Reactivate User
  |--------------------------------------------------------------------------
  */

  reactivateUser: async (
    userId: string
  ) => {
    return request<{
      success: boolean;

      user: {
        id: string;
        email: string;
        accountStatus: string;
        updatedAt: string;
      };

      message: string;
    }>(
      `/admin/users/${userId}/reactivate`,
      {
        method: 'PATCH',
      }
    );
  },
};