const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const request = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',

        ...(options?.headers || {}),
      },
    }
  );

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Unable to complete this request.'
    );
  }

  return data as T;
};


/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export interface DashboardUser {
  id: string;
  anonymousName?: string | null;
  email?: string | null;
  phone?: string | null;
  accountStatus: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardConversation {
  id: string;
  topic: string | null;
  status: string;
  messageCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  endedAt: string | null;
}

export interface ActiveConversation {
  conversation: {
    id: string;
    topic: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    endedAt: string | null;
  };

  matchingRequest: {
    id: string;
    category: string;
    status: string;
    createdAt: string;
    matchedAt: string | null;
    acceptedAt: string | null;
    expiresAt: string | null;
  } | null;

  professional: {
    id: string;
    displayName: string;
  } | null;
}


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

export const dashboardApi = {
  getMe() {
    return request<{
      success: boolean;
      user: DashboardUser;
    }>('/users/me');
  },

  getConversations(
    limit = 20,
    offset = 0
  ) {
    return request<{
      success: boolean;
      conversations: DashboardConversation[];

      pagination: {
        limit: number;
        offset: number;
        hasMore: boolean;
      };
    }>(
      `/users/me/conversations?limit=${limit}&offset=${offset}`
    );
  },

  getActiveConversation() {
    return request<{
      success: boolean;
      activeConversation:
        | ActiveConversation
        | null;
    }>(
      '/users/me/active-conversation'
    );
  },

  deleteConversation(
    conversationId: string
  ) {
    return request<{
      success: boolean;
      conversation: {
        id: string;
        status: string;
        deletedAt: string;
        endedAt: string | null;
      };
      matchingRequest: {
        id: string;
        status: string;
      } | null;
    }>(
      `/users/me/conversations/${conversationId}`,
      {
        method: 'DELETE',
      }
    );
  },
};