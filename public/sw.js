const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
const saveSubscription = async (subscription) => {
    const response = await fetch('https://service-worker-sigma.vercel.app/api/save-subscription', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(subscription)
    })
    const subscriptionId = (await response.json()).subscription.id
    
    const requestDB = indexedDB.open('sw-notifications', 1);
    // Manipuladores de eventos para o banco de dados IndexedDB
    requestDB.onupgradeneeded = function(event) {
      var db = event.target.result;
      // Cria um object store (equivalente a uma tabela em bancos de dados relacionais)
      var objectStore = db.createObjectStore('notifications', { keyPath: 'id' });
      // Cria um índice para pesquisas rápidas
      objectStore.createIndex('indice', 'subscriptionId');
    };

    requestDB.onsuccess = function(event) {
      var db = event.target.result;
      
      // Realiza operações no banco de dados
      var transaction = db.transaction(['notifications'], 'readwrite');
      var objectStore = transaction.objectStore('notifications');

      // Adiciona um novo item
      objectStore.add({ id: 1, subscriptionId });

      // Recupera um item
      var getRequest = objectStore.get(1);
      getRequest.onsuccess = function(event) {
        var data = event.target.result;
        console.log('Item recuperado:', data);
      };
    };

    requestDB.onerror = function(event) {
      console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
    };
    console.log(subscriptionId, 'AQUI');
}

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BAlLPdY3nMWVG5B7UaK1igqaUBRwdYXbso4X31uQbrXj5lss7FgXABqlhJKslj5B5jTA2VAb9QzcyqOLn6s0qkc")
    })
    const response = await saveSubscription(subscription)
})

self.addEventListener("push", e => {
    self.registration.showNotification("Wohoo!!", { body: e.data.text() })
})
