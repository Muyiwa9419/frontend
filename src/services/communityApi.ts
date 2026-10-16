const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

export interface CommunityCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  categoryDescription?: string | null;

  anonymousName: string;
  title: string;
  body: string;

  status: string;
  replyCount: number;
  reactionCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface CommunityReply {
  id: string;
  postId: string;
  anonymousName: string;
  body: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPagination {
  limit: number;
  offset: number;
  returned: number;
}

export interface GetPostsResponse {
  success: boolean;
  posts: CommunityPost[];
  pagination: CommunityPagination;
  message?: string;
}

export interface GetCategoriesResponse {
  success: boolean;
  categories: CommunityCategory[];
  message?: string;
}

export interface GetPostResponse {
  success: boolean;
  post: CommunityPost;
  replies: CommunityReply[];
  message?: string;
}

export interface GetRepliesResponse {
  success: boolean;
  replies: CommunityReply[];
  message?: string;
}

export interface CreatePostData {
  categoryId: string;
  title: string;
  body: string;
}

export interface CreateReplyData {
  body: string;
}

export interface ReportContentData {
  postId?: string;
  replyId?: string;
  reason: string;
  details?: string;
}

export interface BasicResponse {
  success: boolean;
  message?: string;
}

export interface ReactResponse extends BasicResponse {
  reacted?: boolean;
  reactionCount?: number;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data as T;
}

/* =========================
   CATEGORIES
========================= */

export async function getCommunityCategories(): Promise<
  CommunityCategory[]
> {
  const data =
    await request<GetCategoriesResponse>(
      '/community/categories'
    );

  return data.categories;
}

/* =========================
   POSTS
========================= */

export async function getCommunityPosts(
  options: {
    categoryId?: string;
    categorySlug?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<GetPostsResponse> {
  const params = new URLSearchParams();

  if (options.categoryId) {
    params.set('categoryId', options.categoryId);
  }

  if (options.categorySlug) {
    params.set('category', options.categorySlug);
  }

  if (options.limit) {
    params.set(
      'limit',
      String(options.limit)
    );
  }

  if (options.offset) {
    params.set(
      'offset',
      String(options.offset)
    );
  }

  const query = params.toString();

  return request<GetPostsResponse>(
    `/community/posts${query ? `?${query}` : ''}`
  );
}

export async function getCommunityPost(
  postId: string
): Promise<GetPostResponse> {
  return request<GetPostResponse>(
    `/community/posts/${postId}`
  );
}

export async function createCommunityPost(
  data: CreatePostData
): Promise<{
  success: boolean;
  post: CommunityPost;
  message?: string;
}> {
  return request(
    '/community/posts',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

/* =========================
   REPLIES
========================= */

export async function getCommunityReplies(
  postId: string
): Promise<CommunityReply[]> {
  const data =
    await request<GetRepliesResponse>(
      `/community/posts/${postId}/replies`
    );

  return data.replies;
}

export async function createCommunityReply(
  postId: string,
  data: CreateReplyData
): Promise<{
  success: boolean;
  reply: CommunityReply;
  message?: string;
}> {
  return request(
    `/community/posts/${postId}/replies`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

/* =========================
   SUPPORT REACTION
========================= */

export async function reactToCommunityPost(
  postId: string
): Promise<ReactResponse> {
  return request<ReactResponse>(
    `/community/posts/${postId}/react`,
    {
      method: 'POST',
    }
  );
}

/* =========================
   REPORT
========================= */

export async function reportCommunityContent(
  data: ReportContentData
): Promise<BasicResponse> {
  return request<BasicResponse>(
    '/community/reports',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}