import { Settings as SettingsIcon, Bell, Shield, Moon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Settings & Preferences</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface/50 border border-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" /> Application
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Dark Mode</span>
              <button className="w-12 h-6 bg-primary rounded-full relative"><span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span></button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Auto-refresh Data</span>
              <button className="w-12 h-6 bg-white/10 rounded-full relative"><span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span></button>
            </div>
          </div>
        </div>

        <div className="bg-surface/50 border border-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" /> Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Alerts</span>
              <button className="w-12 h-6 bg-accent rounded-full relative"><span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span></button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Weekly Summary</span>
              <button className="w-12 h-6 bg-accent rounded-full relative"><span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
