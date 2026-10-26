import { FormEvent, useEffect, useState } from 'react';

import {
  createCommunityPost,
  getCommunityCategories,
  type CommunityCategory,
} from '../services/communityApi';

import '../styles/community.css';
import '../styles/CreateCommunityPost.css';

interface CreateCommunityPostProps {
  onBack?: () => void;
  onPublished?: (postId?: string) => void;
}

function CreateCommunityPost({
  onBack,
  onPublished,
}: CreateCommunityPostProps) {
  const [categories, setCategories] =
    useState<CommunityCategory[]>([]);

  const [categoryId, setCategoryId] =
    useState('');

  const [title, setTitle] =
    useState('');

  const [body, setBody] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [publishing, setPublishing] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);

      const result =
        await getCommunityCategories();

      setCategories(result);

      if (result.length > 0) {
        setCategoryId(result[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load categories.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');

    if (!categoryId) {
      setError(
        'Please choose a category.'
      );
      return;
    }

    if (!title.trim()) {
      setError(
        'Please add a title.'
      );
      return;
    }

    if (!body.trim()) {
      setError(
        'Please write something before publishing.'
      );
      return;
    }

    if (title.trim().length > 160) {
      setError(
        'Your title must be 160 characters or less.'
      );
      return;
    }

    if (body.trim().length > 10000) {
      setError(
        'Your post must be 10,000 characters or less.'
      );
      return;
    }

    try {
      setPublishing(true);

      const result =
        await createCommunityPost({
          categoryId,
          title: title.trim(),
          body: body.trim(),
        });

      onPublished?.(
        result.post?.id
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to publish your post.'
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="create-post-page">

      <div className="create-post-background">
        <div className="create-post-glow glow-a" />
        <div className="create-post-glow glow-b" />
      </div>

      <header className="create-post-header">

        <button
          type="button"
          className="create-post-back"
          onClick={onBack}
        >
          ←
        </button>

        <div className="create-post-brand">
          <div className="create-post-logo">
            JT
          </div>

          <div>
            <strong>
              Just Talk
            </strong>

            <span>
              Community
            </span>
          </div>
        </div>

        <div className="create-post-step">
          Anonymous
        </div>

      </header>

      <section className="create-post-container">

        <div className="create-post-intro">

          <span className="section-kicker">
            Start a conversation
          </span>

          <h1>
            What's on your mind?
          </h1>

          <p>
            You don't have to attach your
            real name to your story. Share
            honestly, safely and at your
            own pace.
          </p>

          <div className="privacy-badge">
            <span>◌</span>

            <div>
              <strong>
                You'll appear anonymously
              </strong>

              <small>
                Your public identity is never
                displayed.
              </small>
            </div>
          </div>

        </div>

        <form
          className="create-post-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="create-post-error">
              <span>!</span>
              {error}
            </div>
          )}

          <div className="form-field">

            <label>
              What is this about?
            </label>

            {loading ? (
              <div className="category-loading">
                Loading categories...
              </div>
            ) : (
              <div className="create-category-grid">

                {categories.map(
                  (category) => (
                    <button
                      type="button"
                      key={category.id}
                      className={`create-category ${
                        categoryId ===
                        category.id
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        setCategoryId(
                          category.id
                        )
                      }
                    >
                      <span>
                        {getCategoryIcon(
                          category.slug
                        )}
                      </span>

                      <strong>
                        {category.name}
                      </strong>
                    </button>
                  )
                )}

              </div>
            )}

          </div>

          <div className="form-field">

            <div className="label-row">
              <label htmlFor="post-title">
                Title
              </label>

              <span>
                {title.length}/160
              </span>
            </div>

            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Give your conversation a title..."
              maxLength={160}
              disabled={publishing}
            />

          </div>

          <div className="form-field">

            <div className="label-row">
              <label htmlFor="post-body">
                Tell us more
              </label>

              <span>
                {body.length}/10,000
              </span>
            </div>

            <textarea
              id="post-body"
              value={body}
              onChange={(event) =>
                setBody(
                  event.target.value
                )
              }
              placeholder="Write freely. You don't have to make it perfect..."
              maxLength={10000}
              rows={9}
              disabled={publishing}
            />

          </div>

          <div className="create-post-footer">

            <div className="posting-note">
              <span>✓</span>

              <p>
                Your post will be published
                anonymously.
              </p>
            </div>

            <button
              type="submit"
              className="publish-post-button"
              disabled={
                publishing ||
                loading ||
                !categoryId ||
                !title.trim() ||
                !body.trim()
              }
            >
              {publishing
                ? 'Publishing...'
                : 'Publish anonymously'}

              {!publishing && (
                <span>→</span>
              )}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
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

export default CreateCommunityPost;