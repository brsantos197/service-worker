'use client'
export const PermissionButton= () => {
  const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!")
    }

    if (!('Notification' in window)) {
        throw new Error("No support for notification API");
    }

    if (!('PushManager' in window)) {
        throw new Error("No support for Push API")
    }
}

const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        throw new Error("Notification permission not granted")
    }
}

const handleRequestPermission = async () => {
    checkPermission();
    const registration = await registerSW();
    await requestNotificationPermission();
    registration
}

  return <button className="bg-rose-600 text-white py-2 px-4 rounded m-2 hover:bg-rose-700" onClick={handleRequestPermission}>Request notification permition</button>
}

