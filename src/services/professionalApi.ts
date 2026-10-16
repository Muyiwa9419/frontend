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
        'Content-Type': 'application/json',
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


export interface ProfessionalProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  categories: string[];
  verificationStatus: string;
  availabilityStatus: string;
  createdAt: string;
  updatedAt: string;
}


export interface ProfessionalIncomingMatch {
  id: string;
  conversationId: string;
  category: string;
  status: string;
  topic: string | null;
  conversationStatus: string;
  createdAt: string;
  matchedAt: string | null;
  expiresAt: string | null;
}


export interface ProfessionalActiveConversation {
  conversationId: string;
  matchingRequestId: string;
  topic: string | null;
  category: string;
  status: string;
  acceptedAt: string;
  createdAt: string;
  updatedAt: string;
}


export interface ProfessionalDashboardResponse {
  success: boolean;

  professional: ProfessionalProfile;

  incomingMatch:
    | ProfessionalIncomingMatch
    | null;

  activeConversation:
    | ProfessionalActiveConversation
    | null;

  stats: {
    pendingMatches: number;
    activeMatches: number;
    completedMatches: number;
    cancelledMatches: number;
  };
}


export const professionalApi = {
  getProfile() {
    return request<{
      success: boolean;
      professional: ProfessionalProfile;
    }>('/professionals/me');
  },

  getDashboard() {
    return request<ProfessionalDashboardResponse>(
      '/professionals/me/dashboard'
    );
  },

  setAvailability(
    availability: 'AVAILABLE' | 'OFFLINE'
  ) {
    return request(
      '/matching/professional/availability',
      {
        method: 'PATCH',

        body: JSON.stringify({
          availability,
        }),
      }
    );
  },

  acceptMatch(
    requestId: string
  ) {
    return request(
      `/matching/${requestId}/accept`,
      {
        method: 'PATCH',
      }
    );
  },

  declineMatch(
    requestId: string
  ) {
    return request(
      `/matching/${requestId}/decline`,
      {
        method: 'PATCH',
      }
    );
  },
};