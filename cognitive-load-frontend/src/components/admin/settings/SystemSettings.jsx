import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RefreshCw, Shield, Database, Mail, Bell, Palette, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'localization', label: 'Localization', icon: Globe }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Mock settings data
    const mockSettings = {
      general: {
        site_name: 'Cognitive Load Management System',
        site_description: 'Advanced student workload optimization platform',
        admin_email: 'admin@university.edu',
        timezone: 'America/New_York',
        date_format: 'MM/DD/YYYY',
        time_format: '12h',
        maintenance_mode: false,
        registration_enabled: true,
        max_users: 5000
      },
      security: {
        password_min_length: 8,
        password_require_uppercase: true,
        password_require_lowercase: true,
        password_require_numbers: true,
        password_require_symbols: false,
        session_timeout: 120,
        max_login_attempts: 5,
        lockout_duration: 30,
        two_factor_auth: false,
        ip_whitelist_enabled: false,
        ip_whitelist: ''
      },
      database: {
        backup_enabled: true,
        backup_frequency: 'daily',
        backup_retention: 30,
        auto_optimize: true,
        query_logging: false,
        slow_query_threshold: 1000,
        connection_pool_size: 20,
        cache_enabled: true,
        cache_ttl: 3600
      },
      notifications: {
        email_enabled: true,
        smtp_host: 'smtp.university.edu',
        smtp_port: 587,
        smtp_username: 'noreply@university.edu',
        smtp_password: '••••••••',
        smtp_encryption: 'tls',
        push_notifications: true,
        high_load_alerts: true,
        system_alerts: true,
        daily_reports: false,
        weekly_reports: true
      },
      appearance: {
        theme: 'auto',
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
        logo_url: '/images/logo.png',
        favicon_url: '/favicon.ico',
        custom_css: '',
        show_branding: true,
        compact_mode: false
      },
      localization: {
        default_language: 'en',
        available_languages: ['en', 'es', 'fr', 'de'],
        timezone_detection: true,
        date_localization: true,
        number_format: 'US',
        currency: 'USD'
      }
    };
    setSettings(mockSettings);
  };

  const handleSettingChange = (tab, key, value) => {
    setSettings(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      loadSettings();
      setHasChanges(false);
      toast.success('Settings reset to defaults');
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.general?.site_name || ''}
            onChange={(e) => handleSettingChange('general', 'site_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={settings.general?.admin_email || ''}
            onChange={(e) => handleSettingChange('general', 'admin_email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timezone
          </label>
          <select
            value={settings.general?.timezone || ''}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Users
          </label>
          <input
            type="number"
            value={settings.general?.max_users || ''}
            onChange={(e) => handleSettingChange('general', 'max_users', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.general?.site_description || ''}
          onChange={(e) => handleSettingChange('general', 'site_description', e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Temporarily disable site access for maintenance</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general?.maintenance_mode || false}
              onChange={(e) => handleSettingChange('general', 'maintenance_mode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">User Registration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Allow new users to register accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general?.registration_enabled || false}
              onChange={(e) => handleSettingChange('general', 'registration_enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            min="6"
            max="32"
            value={settings.security?.password_min_length || ''}
            onChange={(e) => handleSettingChange('security', 'password_min_length', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security?.session_timeout || ''}
            onChange={(e) => handleSettingChange('security', 'session_timeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.security?.max_login_attempts || ''}
            onChange={(e) => handleSettingChange('security', 'max_login_attempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lockout Duration (minutes)
          </label>
          <input
            type="number"
            value={settings.security?.lockout_duration || ''}
            onChange={(e) => handleSettingChange('security', 'lockout_duration', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Password Requirements</h3>
        
        {[
          { key: 'password_require_uppercase', label: 'Require uppercase letters' },
          { key: 'password_require_lowercase', label: 'Require lowercase letters' },
          { key: 'password_require_numbers', label: 'Require numbers' },
          { key: 'password_require_symbols', label: 'Require symbols' },
          { key: 'two_factor_auth', label: 'Enable two-factor authentication' },
          { key: 'ip_whitelist_enabled', label: 'Enable IP whitelist' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security?.[setting.key] || false}
                onChange={(e) => handleSettingChange('security', setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Backup Frequency
          </label>
          <select
            value={settings.database?.backup_frequency || ''}
            onChange={(e) => handleSettingChange('database', 'backup_frequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Backup Retention (days)
          </label>
          <input
            type="number"
            value={settings.database?.backup_retention || ''}
            onChange={(e) => handleSettingChange('database', 'backup_retention', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Connection Pool Size
          </label>
          <input
            type="number"
            value={settings.database?.connection_pool_size || ''}
            onChange={(e) => handleSettingChange('database', 'connection_pool_size', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cache TTL (seconds)
          </label>
          <input
            type="number"
            value={settings.database?.cache_ttl || ''}
            onChange={(e) => handleSettingChange('database', 'cache_ttl', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'backup_enabled', label: 'Enable automatic backups' },
          { key: 'auto_optimize', label: 'Auto-optimize database' },
          { key: 'query_logging', label: 'Enable query logging' },
          { key: 'cache_enabled', label: 'Enable caching' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.database?.[setting.key] || false}
                onChange={(e) => handleSettingChange('database', setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            value={settings.notifications?.smtp_host || ''}
            onChange={(e) => handleSettingChange('notifications', 'smtp_host', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Port
          </label>
          <input
            type="number"
            value={settings.notifications?.smtp_port || ''}
            onChange={(e) => handleSettingChange('notifications', 'smtp_port', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Username
          </label>
          <input
            type="text"
            value={settings.notifications?.smtp_username || ''}
            onChange={(e) => handleSettingChange('notifications', 'smtp_username', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Encryption
          </label>
          <select
            value={settings.notifications?.smtp_encryption || ''}
            onChange={(e) => handleSettingChange('notifications', 'smtp_encryption', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="none">None</option>
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'email_enabled', label: 'Enable email notifications' },
          { key: 'push_notifications', label: 'Enable push notifications' },
          { key: 'high_load_alerts', label: 'High cognitive load alerts' },
          { key: 'system_alerts', label: 'System alerts' },
          { key: 'daily_reports', label: 'Daily reports' },
          { key: 'weekly_reports', label: 'Weekly reports' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications?.[setting.key] || false}
                onChange={(e) => handleSettingChange('notifications', setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <select
            value={settings.appearance?.theme || ''}
            onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Color
          </label>
          <input
            type="color"
            value={settings.appearance?.primary_color || '#3B82F6'}
            onChange={(e) => handleSettingChange('appearance', 'primary_color', e.target.value)}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logo URL
          </label>
          <input
            type="url"
            value={settings.appearance?.logo_url || ''}
            onChange={(e) => handleSettingChange('appearance', 'logo_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Favicon URL
          </label>
          <input
            type="url"
            value={settings.appearance?.favicon_url || ''}
            onChange={(e) => handleSettingChange('appearance', 'favicon_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Custom CSS
        </label>
        <textarea
          value={settings.appearance?.custom_css || ''}
          onChange={(e) => handleSettingChange('appearance', 'custom_css', e.target.value)}
          rows="6"
          placeholder="/* Add your custom CSS here */"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'show_branding', label: 'Show system branding' },
          { key: 'compact_mode', label: 'Enable compact mode' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance?.[setting.key] || false}
                onChange={(e) => handleSettingChange('appearance', setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLocalizationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Language
          </label>
          <select
            value={settings.localization?.default_language || ''}
            onChange={(e) => handleSettingChange('localization', 'default_language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number Format
          </label>
          <select
            value={settings.localization?.number_format || ''}
            onChange={(e) => handleSettingChange('localization', 'number_format', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="US">US (1,234.56)</option>
            <option value="EU">European (1.234,56)</option>
            <option value="IN">Indian (1,23,456.78)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Currency
          </label>
          <select
            value={settings.localization?.currency || ''}
            onChange={(e) => handleSettingChange('localization', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'timezone_detection', label: 'Auto-detect user timezone' },
          { key: 'date_localization', label: 'Enable date localization' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.localization?.[setting.key] || false}
                onChange={(e) => handleSettingChange('localization', setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'database': return renderDatabaseSettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'localization': return renderLocalizationSettings();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={resetSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={!hasChanges || loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-64"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              {tabs.find(t => t.id === activeTab)?.label} Settings
            </h2>
            {renderTabContent()}
          </div>
        </motion.div>
      </div>

      {/* Changes Indicator */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          You have unsaved changes
        </motion.div>
      )}
    </div>
  );
};

export default SystemSettings;