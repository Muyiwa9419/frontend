import { useEffect, useMemo, useState } from 'react';

import {
  getCommunityCategories,
  getCommunityPosts,
  type CommunityCategory,
  type CommunityPost,
} from '../services/communityApi';

import '../styles/community.css';


interface CommunityProps {
  onBack?: () => void;
  onStartPost?: () => void;
  onOpenPost?: (postId: string) => void;
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const difference =
    now.getTime() - date.getTime();

  const seconds = Math.floor(
    difference / 1000
  );

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
    }
  );
}

function Community({
  onBack,
  onStartPost,
  onOpenPost,
}: CommunityProps) {
  const [categories, setCategories] =
    useState<CommunityCategory[]>([]);

  const [posts, setPosts] =
    useState<CommunityPost[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>('all');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, []);

  async function loadCategories() {
    try {
      setLoadingCategories(true);

      const result =
        await getCommunityCategories();

      setCategories(result);
    } catch (err) {
      console.error(
        'Failed to load community categories:',
        err
      );
    } finally {
      setLoadingCategories(false);
    }
  }

  async function loadPosts(
    categorySlug?: string
  ) {
    try {
      setLoading(true);
      setError('');

      const result =
        await getCommunityPosts({
          categorySlug,
          limit: 20,
          offset: 0,
        });

      setPosts(result.posts);
    } catch (err) {
      console.error(
        'Failed to load community posts:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load the community.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCategoryChange(
    slug: string
  ) {
    setSelectedCategory(slug);

    if (slug === 'all') {
      await loadPosts();
      return;
    }

    await loadPosts(slug);
  }

  const activeCategory =
    useMemo(() => {
      if (selectedCategory === 'all') {
        return null;
      }

      return categories.find(
        (category) =>
          category.slug === selectedCategory
      );
    }, [
      categories,
      selectedCategory,
    ]);

  return (
    <main className="community-page">
      {/* =========================
          HEADER
      ========================== */}

      <header className="community-header">
        <div className="community-header-inner">

          <div className="community-brand-row">

            {onBack && (
              <button
                type="button"
                className="community-back-button"
                onClick={onBack}
                aria-label="Go back"
              >
                ←
              </button>
            )}

            <div className="community-brand">
              <div className="community-brand-mark">
                JT
              </div>

              <div>
                <div className="community-brand-name">
                  Just Talk
                </div>

                <div className="community-brand-label">
                  Community
                </div>
              </div>
            </div>

          </div>

          <button
            type="button"
            className="community-start-button"
            onClick={onStartPost}
          >
            <span>＋</span>
            Start a post
          </button>

        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}

      <section className="community-hero">
        <div className="community-hero-glow glow-one" />
        <div className="community-hero-glow glow-two" />

        <div className="community-hero-content">

          <div className="community-eyebrow">
            <span className="community-eyebrow-dot" />
            A space without judgment
          </div>

          <h1>
            Share what you can't
            <span> say anywhere else.</span>
          </h1>

          <p>
            A place to share your thoughts,
            experiences and questions
            without having to reveal who
            you are.
          </p>

          <div className="community-privacy-note">
            <span>✦</span>
            Your public identity stays anonymous.
          </div>

        </div>
      </section>

      {/* =========================
          CATEGORY NAVIGATION
      ========================== */}

      <section className="community-content">

        <div className="community-section-heading">

          <div>
            <span className="section-kicker">
              Explore
            </span>

            <h2>
              What would you like
              to talk about?
            </h2>
          </div>

          {!loadingCategories &&
            categories.length > 0 && (
              <span className="category-count">
                {categories.length} spaces
              </span>
            )}

        </div>

        <div className="community-categories">

          <button
            type="button"
            className={`category-pill ${
              selectedCategory === 'all'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              handleCategoryChange('all')
            }
          >
            <span className="category-icon">
              ◌
            </span>

            <span>
              Everything
            </span>
          </button>

          {categories.map(
            (category) => (
              <button
                type="button"
                key={category.id}
                className={`category-pill ${
                  selectedCategory ===
                  category.slug
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCategoryChange(
                    category.slug
                  )
                }
                title={
                  category.description ||
                  category.name
                }
              >
                <span className="category-icon">
                  {getCategoryIcon(
                    category.slug
                  )}
                </span>

                <span>
                  {category.name}
                </span>
              </button>
            )
          )}

        </div>

        {/* =========================
            FEED HEADING
        ========================== */}

        <div className="community-feed-heading">

          <div>
            <span className="section-kicker">
              Community
            </span>

            <h2>
              {activeCategory
                ? activeCategory.name
                : 'Recent conversations'}
            </h2>
          </div>

          {!loading && (
            <span className="post-count">
              {posts.length}{' '}
              {posts.length === 1
                ? 'conversation'
                : 'conversations'}
            </span>
          )}

        </div>

        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="community-error">
            <div className="community-error-icon">
              !
            </div>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>{error}</p>

              <button
                type="button"
                onClick={() =>
                  loadPosts(
                    selectedCategory ===
                      'all'
                      ? undefined
                      : selectedCategory
                  )
                }
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* =========================
            LOADING
        ========================== */}

        {loading && (
          <div className="community-loading">

            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                className="community-skeleton-card"
                key={index}
              >
                <div className="skeleton-line skeleton-small" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-body" />
                <div className="skeleton-line skeleton-body short" />

                <div className="skeleton-footer">
                  <div className="skeleton-circle" />
                  <div className="skeleton-line skeleton-meta" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================== */}

        {!loading &&
          !error &&
          posts.length === 0 && (
            <div className="community-empty">

              <div className="community-empty-orb">
                <span>JT</span>
              </div>

              <span className="section-kicker">
                It's quiet here
              </span>

              <h3>
                Be the first to
                start the conversation.
              </h3>

              <p>
                You don't have to put your
                name on it. Share what's
                on your mind and let someone
                know they're not alone.
              </p>

              <button
                type="button"
                className="community-empty-button"
                onClick={onStartPost}
              >
                Start a post
                <span>→</span>
              </button>

            </div>
          )}

        {/* =========================
            POSTS
        ========================== */}

        {!loading &&
          !error &&
          posts.length > 0 && (
            <div className="community-feed">

              {posts.map((post) => (
                <article
                  className="community-post-card"
                  key={post.id}
                  onClick={() =>
                    onOpenPost?.(
                      post.id
                    )
                  }
                >

                  <div className="post-card-top">

                    <span className="post-category">
                      {post.categoryName}
                    </span>

                    <span className="post-time">
                      {formatTime(
                        post.createdAt
                      )}
                    </span>

                  </div>

                  <h3>
                    {post.title}
                  </h3>

                  <p className="post-excerpt">
                    {post.body.length > 220
                      ? `${post.body.slice(
                          0,
                          220
                        )}...`
                      : post.body}
                  </p>

                  <div className="post-card-footer">

                    <div className="anonymous-user">

                      <div className="anonymous-avatar">
                        {getInitials(
                          post.anonymousName
                        )}
                      </div>

                      <span>
                        {post.anonymousName}
                      </span>

                    </div>

                    <div className="post-stats">

                      <span>
                        ♡{' '}
                        {post.reactionCount}
                      </span>

                      <span>
                        ○{' '}
                        {post.replyCount}
                      </span>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        {/* =========================
            BOTTOM CTA
        ========================== */}

        {!loading &&
          posts.length > 0 && (
            <section className="community-bottom-cta">

              <div>
                <span className="section-kicker">
                  Your story matters
                </span>

                <h3>
                  There's probably
                  someone who understands.
                </h3>

                <p>
                  Start a conversation
                  anonymously.
                </p>
              </div>

              <button
                type="button"
                onClick={onStartPost}
              >
                Share anonymously
                <span>→</span>
              </button>

            </section>
          )}

      </section>
    </main>
  );
}

/* =========================
   HELPERS
========================= */

function getInitials(
  anonymousName: string
) {
  if (!anonymousName) {
    return 'JT';
  }

  const words =
    anonymousName.trim().split(' ');

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
}

function getCategoryIcon(
  slug: string
) {
  switch (slug) {
    case 'relationships':
      return '♡';

    case 'mental-emotional-wellbeing':
      return '◌';

    case 'life-personal-growth':
      return '◌';

    case 'family':
      return '⌂';

    case 'school-career':
      return '↗';

    case 'money-life':
      return '₦';

    case 'embarrassed-about':
      return '◐';

    case 'general':
      return '◌';

    default:
      return '•';
  }
}

export default Community;