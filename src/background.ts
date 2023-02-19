import { getPRs } from './common/prs';

const updateBadge = async () => {
  const prs = await getPRs();
  if (prs) {
    if (prs.length === 0) {
      await chrome.action.setBadgeText({ text: '' });
    } else {
      await chrome.action.setBadgeText({ text: `${prs.length}` });
    }
  } else {
    await chrome.action.setBadgeText({ text: '!' });
  }
};

// Update badge every minute
chrome.alarms.create({ periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(() => {
  updateBadge();
});

// Update badge when the user's auth or settings have changed (e.g applied a new filter)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' || area === 'sync') {
    updateBadge();
  }
});

updateBadge();
