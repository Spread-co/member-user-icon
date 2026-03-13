<template>
  <div v-if="!content.portalTarget || content.portalTarget === 'member'" class="mui" ref="root">
    <!-- Authenticated: avatar button + dropdown -->
    <template v-if="content.isAuthenticated">

    <!-- Avatar / Initials trigger button -->
    <button
      class="mui__btn"
      :class="{ 'mui__btn--open': open }"
      :aria-expanded="open"
      :aria-label="`My account — ${content.displayName || 'User'}`"
      :title="`${content.displayName || 'My account'}`"
      @click="toggle"
    >
      <img
        v-if="content.avatarUrl"
        :src="content.avatarUrl"
        class="mui__avatar-img"
        alt=""
      />
      <span v-else class="mui__avatar-initials" :style="{ background: avatarColour }">
        {{ initial }}
      </span>

      <!-- Member dot indicator -->
      <span v-if="content.isMember" class="mui__member-dot" aria-hidden="true"></span>
    </button>

    <!-- Dropdown panel -->
    <transition name="mui-drop">
      <div class="mui__dropdown" v-if="open" role="menu" @click.stop>
        <!-- User info header -->
        <div class="mui__header">
          <div class="mui__header-avatar" :style="{ background: avatarColour }">
            <img v-if="content.avatarUrl" :src="content.avatarUrl" class="mui__header-avatar-img" alt="" />
            <span v-else>{{ initial }}</span>
          </div>
          <div class="mui__header-info">
            <span class="mui__header-name">{{ content.displayName || 'My Account' }}</span>
            <span class="mui__header-email">{{ content.userEmail }}</span>
            <span v-if="content.isMember" class="mui__member-badge">Member</span>
          </div>
        </div>

        <div class="mui__divider" role="separator"></div>

        <!-- Navigation items -->
        <button class="mui__item" role="menuitem" @click="go('/account', 'My Account')">
          <svg class="mui__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          My Account
        </button>

        <button class="mui__item" role="menuitem" @click="go('/favourites', 'Favourites')">
          <svg class="mui__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          Favourites
        </button>

        <button class="mui__item" role="menuitem" @click="go('/orders', 'Orders')">
          <svg class="mui__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          My Orders
        </button>

        <button class="mui__item" role="menuitem" @click="go('/saved-carts', 'Saved Carts')">
          <svg class="mui__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          Saved Carts
        </button>

        <div class="mui__divider" role="separator"></div>

        <!-- Sign out -->
        <button class="mui__item mui__item--signout" role="menuitem" @click="handleSignOut">
          <svg class="mui__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out
        </button>
      </div>
    </transition>

    </template><!-- end v-if isAuthenticated -->

    <!-- Unauthenticated: Sign in pill -->
    <template v-else>
      <button
        class="mui__signin"
        @click="$emit('trigger-event', { name: 'user:signInClicked', event: {} })"
      >Sign in</button>
    </template>

  </div>
</template>

<script>
// Deterministic avatar colour from user string (stays stable per user)
function stringToColour(str) {
  const palette = [
    '#4b162d', '#ce6632', '#7c3a50', '#9b4f1e',
    '#5a6e2b', '#2d5c7a', '#4a4878', '#6b3a3a',
  ];
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export default {
  props: {
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
    content: { type: Object, required: true },
    wwFrontState: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
  },

  emits: ['trigger-event', 'update:content'],

  data() {
    return {
      open: false,
      _outsideHandler: null,
    };
  },

  computed: {
    initial() {
      const name = this.content.displayName || this.content.userEmail || 'U';
      return name.charAt(0).toUpperCase();
    },
    avatarColour() {
      return stringToColour(this.content.userId || this.content.userEmail || 'user');
    },
  },

  mounted() {
    // Close on outside click
    this._outsideHandler = (e) => {
      try {
        if (!this.$refs.root?.contains(e.target)) {
          this.open = false;
        }
      } catch (_) {}
    };
    try {
      const doc = wwLib.getFrontDocument();
      if (doc) doc.addEventListener('click', this._outsideHandler, true);
    } catch (_) {}
  },

  beforeUnmount() {
    try {
      const doc = wwLib.getFrontDocument();
      if (doc && this._outsideHandler) doc.removeEventListener('click', this._outsideHandler, true);
    } catch (_) {}
  },

  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open) {
        this.$emit('trigger-event', { name: 'user:menu-open', event: {} });
      }
    },

    close() {
      this.open = false;
    },

    go(path, label) {
      this.close();
      this.$emit('trigger-event', { name: 'user:navigate', event: { path, label } });
    },

    handleSignOut() {
      this.close();
      this.$emit('trigger-event', { name: 'user:logout', event: {} });
    },
  },
};
</script>

<style scoped>
/* ── Design tokens ── */
.mui {
  --spread-primary: #4b162d;
  --spread-accent: #ce6632;
  --spread-gold: #bead38;
  --spread-beige: #e6d8ca;
  --spread-surface: #ffffff;
  --spread-border: #f3eadf;
  --spread-bg: #fbfaf8;
  --spread-text-primary: #141414;
  --spread-text-secondary: #2b2b2b;
  --spread-text-muted: #6b7280;
  --spread-radius-sm: 8px;
  --spread-radius-md: 12px;
  --spread-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  --spread-font: 'Work Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;

  /* Component sizing */
  --mui-btn-size: 44px;
  --mui-avatar-size: 44px;
  --mui-dropdown-width: 240px;

  position: relative;
  display: inline-flex;
  align-items: center;
  font-family: var(--spread-font);
}

/* ── Trigger button ── */
.mui__btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--mui-btn-size);
  height: var(--mui-btn-size);
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s ease, box-shadow 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.mui__btn:hover {
  box-shadow: 0 0 0 3px rgba(75, 22, 45, 0.12);
}

.mui__btn:active {
  transform: scale(0.93);
}

.mui__btn:focus-visible {
  outline: 2px solid var(--spread-accent);
  outline-offset: 2px;
}

.mui__btn--open {
  box-shadow: 0 0 0 3px rgba(206, 102, 50, 0.25);
}

/* ── Avatar ── */
.mui__avatar-img {
  width: var(--mui-avatar-size);
  height: var(--mui-avatar-size);
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--spread-beige);
  display: block;
}

.mui__avatar-initials {
  width: var(--mui-avatar-size);
  height: var(--mui-avatar-size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  font-family: var(--spread-font);
  border: 2px solid rgba(255, 255, 255, 0.15);
  user-select: none;
  letter-spacing: -0.02em;
}

/* ── Member dot ── */
.mui__member-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--spread-accent);
  border: 2px solid var(--spread-surface);
}

/* ── Dropdown panel ── */
.mui__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: var(--mui-dropdown-width);
  background: var(--spread-surface);
  border: 1px solid var(--spread-border);
  border-radius: var(--spread-radius-md);
  box-shadow: var(--spread-shadow);
  z-index: 1000;
  overflow: hidden;
}

/* ── Header ── */
.mui__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--spread-bg);
}

.mui__header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  overflow: hidden;
}

.mui__header-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.mui__header-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.mui__header-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--spread-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.mui__header-email {
  font-size: 11px;
  color: var(--spread-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.mui__member-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(206, 102, 50, 0.12);
  color: var(--spread-accent);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-top: 2px;
  align-self: flex-start;
}

/* ── Divider ── */
.mui__divider {
  height: 1px;
  background: var(--spread-border);
  margin: 0;
}

/* ── Menu items ── */
.mui__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--spread-text-secondary);
  font-family: var(--spread-font);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}

.mui__item:hover {
  background: var(--spread-bg);
  color: var(--spread-primary);
}

.mui__item:focus-visible {
  outline: none;
  background: var(--spread-bg);
  color: var(--spread-primary);
}

.mui__item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.7;
}

.mui__item:hover .mui__item-icon {
  opacity: 1;
}

/* Sign out ─ destructive style */
.mui__item--signout {
  color: #d14343;
}

.mui__item--signout:hover {
  background: #fef2f2;
  color: #b91c1c;
}

/* ── Transition ── */
.mui-drop-enter-active,
.mui-drop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.mui-drop-enter-from,
.mui-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ── Dark mode ── */
:global(html.dark) .mui {
  --spread-surface: #1a0f14;
  --spread-bg: #1f1218;
  --spread-border: rgba(230, 216, 202, 0.12);
  --spread-text-primary: #f5f0eb;
  --spread-text-secondary: #e6d8ca;
  --spread-text-muted: rgba(230, 216, 202, 0.45);
}

:global(html.dark) .mui__member-dot {
  border-color: #1a0f14;
}

:global(html.dark) .mui__item--signout:hover {
  background: rgba(209, 67, 67, 0.12);
  color: #f87171;
}

/* ── Sign in pill (unauthenticated state) ── */
.mui__signin {
  background: #ce6632;
  color: #fff;
  font-family: var(--spread-font, 'Work Sans', sans-serif);
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 9999px;
  padding: 8px 20px;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
  line-height: 1;
}

.mui__signin:hover {
  background: #b85a2b;
}

:global(html.dark) .mui__signin {
  background: #ce6632;
}

:global(html.dark) .mui__signin:hover {
  background: #b85a2b;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .mui {
    --mui-btn-size: 40px;
    --mui-avatar-size: 40px;
    --mui-dropdown-width: 220px;
  }

  .mui__dropdown {
    right: -8px;
  }
}
</style>
