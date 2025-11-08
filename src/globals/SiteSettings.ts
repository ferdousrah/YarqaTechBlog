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
              name: 'footerLogo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload footer logo (optional, defaults to main logo if not set)',
              },
            },
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
          label: 'Theme',
          description: 'Customize your site colors, fonts, and design',
          fields: [
            {
              name: 'theme',
              type: 'group',
              fields: [
                // Color Scheme
                {
                  name: 'colors',
                  type: 'group',
                  label: 'Color Scheme',
                  fields: [
                    {
                      name: 'primary',
                      type: 'text',
                      label: 'Primary Color',
                      defaultValue: '#2563eb',
                      admin: {
                        description: 'Main brand color (hex code, e.g., #2563eb)',
                        placeholder: '#2563eb',
                      },
                    },
                    {
                      name: 'secondary',
                      type: 'text',
                      label: 'Secondary Color',
                      defaultValue: '#6366f1',
                      admin: {
                        description: 'Secondary accent color (hex code)',
                        placeholder: '#6366f1',
                      },
                    },
                    {
                      name: 'accent',
                      type: 'text',
                      label: 'Accent Color',
                      defaultValue: '#8b5cf6',
                      admin: {
                        description: 'Highlight/accent color (hex code)',
                        placeholder: '#8b5cf6',
                      },
                    },
                    {
                      name: 'success',
                      type: 'text',
                      label: 'Success Color',
                      defaultValue: '#10b981',
                      admin: {
                        description: 'Success state color (hex code)',
                        placeholder: '#10b981',
                      },
                    },
                    {
                      name: 'warning',
                      type: 'text',
                      label: 'Warning Color',
                      defaultValue: '#f59e0b',
                      admin: {
                        description: 'Warning state color (hex code)',
                        placeholder: '#f59e0b',
                      },
                    },
                    {
                      name: 'error',
                      type: 'text',
                      label: 'Error Color',
                      defaultValue: '#ef4444',
                      admin: {
                        description: 'Error state color (hex code)',
                        placeholder: '#ef4444',
                      },
                    },
                    {
                      name: 'background',
                      type: 'text',
                      label: 'Background Color',
                      defaultValue: '#ffffff',
                      admin: {
                        description: 'Main background color (hex code)',
                        placeholder: '#ffffff',
                      },
                    },
                    {
                      name: 'backgroundSecondary',
                      type: 'text',
                      label: 'Secondary Background',
                      defaultValue: '#f9fafb',
                      admin: {
                        description: 'Secondary/alternative background (hex code)',
                        placeholder: '#f9fafb',
                      },
                    },
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Text Color',
                      defaultValue: '#111827',
                      admin: {
                        description: 'Primary text color (hex code)',
                        placeholder: '#111827',
                      },
                    },
                    {
                      name: 'textSecondary',
                      type: 'text',
                      label: 'Secondary Text Color',
                      defaultValue: '#6b7280',
                      admin: {
                        description: 'Secondary/muted text color (hex code)',
                        placeholder: '#6b7280',
                      },
                    },
                    {
                      name: 'border',
                      type: 'text',
                      label: 'Border Color',
                      defaultValue: '#e5e7eb',
                      admin: {
                        description: 'Default border color (hex code)',
                        placeholder: '#e5e7eb',
                      },
                    },
                  ],
                },
                // Typography
                {
                  name: 'typography',
                  type: 'group',
                  label: 'Typography',
                  fields: [
                    {
                      name: 'fontFamily',
                      type: 'select',
                      label: 'Font Family',
                      defaultValue: 'inter',
                      options: [
                        { label: 'Inter (Modern Sans)', value: 'inter' },
                        { label: 'Roboto (Google Sans)', value: 'roboto' },
                        { label: 'Open Sans', value: 'open-sans' },
                        { label: 'Poppins (Rounded)', value: 'poppins' },
                        { label: 'Lato (Humanist)', value: 'lato' },
                        { label: 'Montserrat (Geometric)', value: 'montserrat' },
                        { label: 'Nunito (Rounded Sans)', value: 'nunito' },
                        { label: 'Source Sans Pro', value: 'source-sans' },
                        { label: 'Work Sans', value: 'work-sans' },
                        { label: 'Raleway (Elegant)', value: 'raleway' },
                        { label: 'System Default', value: 'system' },
                      ],
                      admin: {
                        description: 'Primary font family for body text',
                      },
                    },
                    {
                      name: 'headingFontFamily',
                      type: 'select',
                      label: 'Heading Font Family',
                      defaultValue: 'inter',
                      options: [
                        { label: 'Same as Body', value: 'inherit' },
                        { label: 'Inter (Modern Sans)', value: 'inter' },
                        { label: 'Roboto (Google Sans)', value: 'roboto' },
                        { label: 'Poppins (Rounded)', value: 'poppins' },
                        { label: 'Montserrat (Geometric)', value: 'montserrat' },
                        { label: 'Playfair Display (Serif)', value: 'playfair' },
                        { label: 'Merriweather (Serif)', value: 'merriweather' },
                        { label: 'Space Grotesk (Modern)', value: 'space-grotesk' },
                        { label: 'DM Sans (Geometric)', value: 'dm-sans' },
                      ],
                      admin: {
                        description: 'Font family for headings',
                      },
                    },
                    {
                      name: 'baseFontSize',
                      type: 'number',
                      label: 'Base Font Size (px)',
                      defaultValue: 16,
                      min: 14,
                      max: 20,
                      admin: {
                        description: 'Base font size for body text (14-20px recommended)',
                      },
                    },
                    {
                      name: 'lineHeight',
                      type: 'number',
                      label: 'Line Height',
                      defaultValue: 1.6,
                      min: 1.2,
                      max: 2,
                      step: 0.1,
                      admin: {
                        description: 'Line height multiplier (1.5-1.75 recommended)',
                      },
                    },
                    {
                      name: 'headingWeight',
                      type: 'select',
                      label: 'Heading Font Weight',
                      defaultValue: '700',
                      options: [
                        { label: 'Normal (400)', value: '400' },
                        { label: 'Medium (500)', value: '500' },
                        { label: 'Semibold (600)', value: '600' },
                        { label: 'Bold (700)', value: '700' },
                        { label: 'Extra Bold (800)', value: '800' },
                        { label: 'Black (900)', value: '900' },
                      ],
                    },
                  ],
                },
                // Spacing & Layout
                {
                  name: 'spacing',
                  type: 'group',
                  label: 'Spacing & Layout',
                  fields: [
                    {
                      name: 'containerMaxWidth',
                      type: 'select',
                      label: 'Max Container Width',
                      defaultValue: '1400px',
                      options: [
                        { label: 'Narrow (1200px)', value: '1200px' },
                        { label: 'Standard (1400px)', value: '1400px' },
                        { label: 'Wide (1600px)', value: '1600px' },
                        { label: 'Extra Wide (1800px)', value: '1800px' },
                        { label: 'Full Width', value: '100%' },
                      ],
                    },
                    {
                      name: 'borderRadius',
                      type: 'select',
                      label: 'Border Radius Style',
                      defaultValue: 'medium',
                      options: [
                        { label: 'None (Sharp Corners)', value: 'none' },
                        { label: 'Small (4px)', value: 'small' },
                        { label: 'Medium (8px)', value: 'medium' },
                        { label: 'Large (12px)', value: 'large' },
                        { label: 'Extra Large (16px)', value: 'xl' },
                        { label: 'Rounded (20px)', value: 'rounded' },
                      ],
                    },
                    {
                      name: 'shadowStyle',
                      type: 'select',
                      label: 'Shadow Style',
                      defaultValue: 'medium',
                      options: [
                        { label: 'None', value: 'none' },
                        { label: 'Subtle', value: 'subtle' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Strong', value: 'strong' },
                        { label: 'Dramatic', value: 'dramatic' },
                      ],
                    },
                  ],
                },
                // Button Styles
                {
                  name: 'buttons',
                  type: 'group',
                  label: 'Button Styles',
                  fields: [
                    {
                      name: 'style',
                      type: 'select',
                      label: 'Button Style',
                      defaultValue: 'gradient',
                      options: [
                        { label: 'Solid', value: 'solid' },
                        { label: 'Gradient', value: 'gradient' },
                        { label: 'Outline', value: 'outline' },
                        { label: 'Ghost', value: 'ghost' },
                      ],
                    },
                    {
                      name: 'buttonRadius',
                      type: 'select',
                      label: 'Button Border Radius',
                      defaultValue: 'medium',
                      options: [
                        { label: 'Sharp', value: 'none' },
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                        { label: 'Pill', value: 'pill' },
                      ],
                    },
                  ],
                },
                // Animation Settings
                {
                  name: 'animations',
                  type: 'group',
                  label: 'Animation Settings',
                  fields: [
                    {
                      name: 'enableAnimations',
                      type: 'checkbox',
                      label: 'Enable Animations',
                      defaultValue: true,
                      admin: {
                        description: 'Enable/disable page animations and transitions',
                      },
                    },
                    {
                      name: 'animationSpeed',
                      type: 'select',
                      label: 'Animation Speed',
                      defaultValue: 'normal',
                      options: [
                        { label: 'Fast (200ms)', value: 'fast' },
                        { label: 'Normal (300ms)', value: 'normal' },
                        { label: 'Slow (500ms)', value: 'slow' },
                      ],
                      admin: {
                        condition: (data, siblingData) => siblingData?.enableAnimations,
                      },
                    },
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
