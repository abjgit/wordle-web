interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  isExpanded: boolean;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const initializeTelegramWebApp = () => {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) {
    console.warn('Telegram WebApp is not available');
    return null;
  }

  try {
    // Initialize the web app
    webApp.ready();

    // Set theme colors
    webApp.setHeaderColor('#FFFFFF');
    webApp.setBackgroundColor('#F9FAFB');

    // Expand the web app to full height and ensure it's visible
    webApp.expand();
    
    // Make sure the webapp is fully expanded
    setTimeout(() => {
      if (webApp.isExpanded !== true) {
        webApp.expand();
      }
    }, 1000);

    // Return the WebApp instance for further use
    return webApp;
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
    return null;
  }
};

export const useTelegramWebApp = () => {
  const webApp = window.Telegram?.WebApp;
  
  const isAvailable = !!webApp;
  
  const showMainButton = (text: string, callback: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.text = text;
      webApp.MainButton.onClick(callback);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    webApp?.MainButton?.hide();
  };

  const showBackButton = (callback: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(callback);
      webApp.BackButton.show();
    }
  };

  const hideBackButton = () => {
    webApp?.BackButton?.hide();
  };

  const close = () => {
    webApp?.close();
  };

  return {
    isAvailable,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    close,
  };
};
