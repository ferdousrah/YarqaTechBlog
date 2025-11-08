// src/globals/SiteSettings.ts - Site-wide settings
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true, // Public can read site settings
    update: ({ req: { user } }) => {
      // Only admins can update
      return user?.role === 'admin'
    },
  },
  admin: {
    group: 'Configuration',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'YarqaTech',
              admin: {
                description: 'The name of your website',
              },
            },
            {
              name: 'siteTagline',
              type: 'text',
              defaultValue: 'Your source for tech insights',
              admin: {
                description: 'A short tagline for your site',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              defaultValue:
                'Your source for the latest in technology, development, and innovation. Stay updated with expert insights and tutorials.',
              admin: {
                description: 'Site description for SEO and footer',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload your site logo (optional, defaults to text logo)',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload your site favicon',
              },
            },
            {
              name: 'logoText',
              type: 'group',
              fields: [
                {
                  name: 'firstPart',
                  type: 'text',
                  defaultValue: 'Yarqa',
                  admin: {
                    description: 'First part of logo text (colored)',
                  },
                },
                {
                  name: 'secondPart',
                  type: 'text',
                  defaultValue: 'Tech',
                  admin: {
                    description: 'Second part of logo text',
                  },
                },
                {
                  name: 'logoLetter',
                  type: 'text',
                  defaultValue: 'Y',
                  maxLength: 1,
                  admin: {
                    description: 'Single letter for icon logo',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & Social',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              defaultValue: 'hello@yarqatech.com',
              admin: {
                description: 'Contact email for the site',
              },
            },
            {
              name: 'socialLinks',
              type: 'group',
              fields: [
                {
                  name: 'twitter',
                  type: 'text',
                  admin: {
                    placeholder: 'https://twitter.com/yourhandle',
                  },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: {
                    placeholder: 'https://linkedin.com/company/yourcompany',
                  },
                },
                {
                  name: 'github',
                  type: 'text',
                  admin: {
                    placeholder: 'https://github.com/yourorg',
                  },
                },
                {
                  name: 'facebook',
                  type: 'text',
                  admin: {
                    placeholder: 'https://facebook.com/yourpage',
                  },
                },
                {
                  name: 'instagram',
                  type: 'text',
                  admin: {
                    placeholder: 'https://instagram.com/yourhandle',
                  },
                },
                {
                  name: 'youtube',
                  type: 'text',
                  admin: {
                    placeholder: 'https://youtube.com/@yourchannel',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'copyrightText',
              type: 'text',
              defaultValue: 'Yarqa Tech. All rights reserved.',
              admin: {
                description: 'Copyright text (year will be added automatically)',
              },
            },
            {
              name: 'footerTagline',
              type: 'text',
              defaultValue: 'Made with passion for developers',
              admin: {
                description: 'Tagline shown in footer',
              },
            },
            {
              name: 'showBuiltWith',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show "Built with Next.js & Tailwind CSS" in footer',
              },
            },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            {
              name: 'newsletterEnabled',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show newsletter signup section',
              },
            },
            {
              name: 'newsletterTitle',
              type: 'text',
              defaultValue: 'Stay in the Loop',
              admin: {
                condition: (data) => data.newsletterEnabled,
              },
            },
            {
              name: 'newsletterDescription',
              type: 'textarea',
              defaultValue:
                'Get the latest tech insights, tutorials, and industry news delivered straight to your inbox. Join 10,000+ developers and tech enthusiasts!',
              admin: {
                condition: (data) => data.newsletterEnabled,
              },
            },
            {
              name: 'newsletterPrivacyText',
              type: 'text',
              defaultValue: 'No spam, unsubscribe anytime. We respect your privacy.',
              admin: {
                condition: (data) => data.newsletterEnabled,
              },
            },
          ],
        },
        {
          label: 'Header Settings',
          fields: [
            {
              name: 'showSearch',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show search in header',
              },
            },
            {
              name: 'showAuthButtons',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show login/register buttons in header',
              },
            },
            {
              name: 'authButtonStyle',
              type: 'select',
              defaultValue: 'both',
              options: [
                { label: 'Both (Login & Register)', value: 'both' },
                { label: 'Login Only', value: 'login' },
                { label: 'Account Dropdown', value: 'dropdown' },
              ],
              admin: {
                condition: (data) => data.showAuthButtons,
              },
            },
            {
              name: 'navigationLinks',
              type: 'array',
              label: 'Navigation Links',
              admin: {
                description: 'Custom navigation links (leave empty to use defaults)',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'Home', value: 'home' },
                    { label: 'Book', value: 'book' },
                    { label: 'Folder', value: 'folder' },
                    { label: 'Info', value: 'info' },
                    { label: 'Mail', value: 'mail' },
                    { label: 'User', value: 'user' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO Defaults',
          fields: [
            {
              name: 'defaultMetaTitle',
              type: 'text',
              admin: {
                description: 'Default meta title for pages without one',
              },
            },
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              admin: {
                description: 'Default meta description for pages without one',
              },
            },
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Default Open Graph image for social sharing',
              },
            },
          ],
        },
      ],
    },
  ],
}
