import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

const CHECK_INTERVAL_MS = 30000;
const REQUEST_TIMEOUT_MS = 4000;

export default function ApiHealthBadge() {
  const [status, setStatus] = useState('checking');
  const [lastSuccessAt, setLastSuccessAt] = useState(null);
  const healthUrl = `${API_BASE_URL}/api/health`;

  useEffect(() => {
    let isMounted = true;

    async function checkApiHealth() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(healthUrl, {
          method: 'GET',
          signal: controller.signal
        });

        if (!isMounted) {
          return;
        }

        setStatus(response.ok ? 'online' : 'offline');
        if (response.ok) {
          setLastSuccessAt(new Date().toLocaleString());
        }
      } catch (error) {
        if (isMounted) {
          setStatus('offline');
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    checkApiHealth();
    const intervalId = setInterval(checkApiHealth, CHECK_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [healthUrl]);

  const lastSuccessText = lastSuccessAt ? `Last success: ${lastSuccessAt}` : 'Last success: n/a';

  return (
    <>
      <span
        className={`api-health-badge api-health-${status}`}
        aria-live="polite"
        aria-label={`API health status (${status}). Checking ${healthUrl}. ${lastSuccessText}`}
        title={`Health check: ${healthUrl}\n${lastSuccessText}`}
      >
        API: {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking'}
      </span>
      <span className="api-health-meta" aria-hidden="true">
        {lastSuccessAt ? `Last success: ${lastSuccessAt}` : 'Last success: n/a'}
      </span>
    </>
  );
}
