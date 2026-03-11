export default {
  editor: {
    label: { en: 'Member User Icon' },
    icon: 'user',
    categories: ['account', 'navigation'],
  },
  properties: {
    isAuthenticated: {
      label: { en: 'Is Authenticated' },
      type: 'OnOff',
      bindable: true,
      defaultValue: false,
    },
    avatarUrl: {
      label: { en: 'Avatar URL' },
      type: 'Text',
      bindable: true,
      defaultValue: '',
    },
    displayName: {
      label: { en: 'Display Name' },
      type: 'Text',
      bindable: true,
      defaultValue: '',
    },
    userEmail: {
      label: { en: 'User Email' },
      type: 'Text',
      bindable: true,
      defaultValue: '',
    },
    userId: {
      label: { en: 'User ID' },
      type: 'Text',
      bindable: true,
      hidden: true,
      defaultValue: '',
    },
    isMember: {
      label: { en: 'Is Member' },
      type: 'OnOff',
      bindable: true,
      defaultValue: false,
    },
    portalTarget: {
      label: { en: 'Portal Target' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'member',         label: { en: 'Member' } },
          { value: 'admin',          label: { en: 'Admin' } },
          { value: 'platform_admin', label: { en: 'Platform Admin' } },
          { value: 'farmer',         label: { en: 'Farmer' } },
        ],
      },
      bindable: true,
      defaultValue: 'member',
    },
  },
  triggerEvents: [
    {
      name: 'user:navigate',
      label: { en: 'On Navigate' },
      event: { path: '', label: '' },
    },
    {
      name: 'user:logout',
      label: { en: 'On Sign Out' },
      event: {},
    },
    {
      name: 'user:menu-open',
      label: { en: 'On Menu Open' },
      event: {},
    },
    {
      name: 'user:signInClicked',
      label: { en: 'On Sign In Clicked' },
      event: {},
    },
  ],
};
