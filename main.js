import { Peer } from 'peerjs';

const myPeerIdEl = document.getElementById('my-peer-id');
const copyIdBtn = document.getElementById('copy-id-btn');
const receiverIdInput = document.getElementById('receiver-id-input');
const connectBtn = document.getElementById('connect-btn');
const fileInput = document.getElementById('file-input');
const sendFileBtn = document.getElementById('send-file-btn');
const connectionStatusEl = document.getElementById('connection-status');
const receivedFilesListEl = document.getElementById('received-files-list');
const receiveStatusEl = document.getElementById('receive-status');

let peer = null;
let currentConnection = null;

function initializePeer() {
  peer = new Peer(); 

  peer.on('open', (id) => {
    myPeerIdEl.textContent = id;
    console.log('My peer ID is: ' + id);
  });

  peer.on('connection', (conn) => {
    console.log('Incoming connection from:', conn.peer);
    connectionStatusEl.textContent = `Status: Connected to ${conn.peer} (Incoming)`;
    receiveStatusEl.textContent = `Receiving from ${conn.peer}...`;
    
    setupConnectionEvents(conn);
    currentConnection = conn; 

    fileInput.disabled = false;
    sendFileBtn.disabled = false;
  });

  peer.on('error', (err) => {
    console.error('PeerJS error:', err);
    myPeerIdEl.textContent = `Error: ${err.type || err.message}`;
    if (err.type === 'unavailable-id') {
      alert('ID already taken. Please try refreshing.');
    } else if (err.type === 'peer-unavailable') {
      connectionStatusEl.textContent = `Status: Peer ${receiverIdInput.value.trim()} is unavailable.`;
      alert(`Could not connect to peer: ${receiverIdInput.value.trim()}. Ensure the ID is correct and the peer is online.`);
    } else {
        alert(`An error occurred: ${err.message}`);
    }
    disableSendControls();
  });

  peer.on('disconnected', () => {
    console.log('Peer disconnected from signaling server.');
    myPeerIdEl.textContent = 'Disconnected. Attempting to reconnect...';
    setTimeout(() => {
        if (peer && !peer.destroyed) { 
            peer.reconnect();
        } else if (!peer) { 
            initializePeer();
        }
    }, 3000);
  });

  peer.on('close', () => {
    console.log('Peer connection closed.');
    myPeerIdEl.textContent = 'Connection closed. Please refresh.';
    disableSendControls();
  });
}

function setupConnectionEvents(conn) {
  conn.on('data', (data) => {
    console.log('Received data:', data);
    if (data.type === 'file') {
      handleReceivedFile(data);
    } else if (data.type === 'text') {
      console.log('Received text message:', data.payload);
      receiveStatusEl.textContent = `Message from ${conn.peer}: ${data.payload}`;
    }
  });

  conn.on('open', () => {
    console.log('Connection opened with ' + conn.peer);
    connectionStatusEl.textContent = `Status: Connected to ${conn.peer}`;
    receiveStatusEl.textContent = `Ready to receive from ${conn.peer}.`;
    fileInput.disabled = false;
    sendFileBtn.disabled = false;
  });

  conn.on('close', () => {
    console.log('Connection closed with ' + conn.peer);
    connectionStatusEl.textContent = 'Status: Connection closed.';
    receiveStatusEl.textContent = '';
    disableSendControls();
    if (currentConnection && currentConnection.peer === conn.peer) {
        currentConnection = null;
    }
  });

  conn.on('error', (err) => {
    console.error('Connection error:', err);
    connectionStatusEl.textContent = `Status: Error with ${conn.peer}: ${err.message}`;
    receiveStatusEl.textContent = '';
    disableSendControls();
  });
}

function handleReceivedFile({ fileName, fileType, fileData, fileSize }) {
  receiveStatusEl.textContent = `Receiving file: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`;
  
  const blob = new Blob([fileData], { type: fileType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.textContent = `Download ${fileName}`;
  
  if (receivedFilesListEl.querySelector('p')) {
    receivedFilesListEl.innerHTML = ''; 
  }
  receivedFilesListEl.appendChild(a);
  
  receiveStatusEl.textContent = `File ${fileName} received! Click to download.`;
}

function connectToPeer() {
  const receiverId = receiverIdInput.value.trim();
  if (!receiverId) {
    alert('Please enter a receiver Peer ID.');
    return;
  }
  if (!peer || peer.destroyed) {
    alert('PeerJS is not initialized. Please wait or refresh.');
    initializePeer(); 
    return;
  }
  if (receiverId === peer.id) {
    alert("You cannot connect to yourself.");
    return;
  }

  console.log('Attempting to connect to ' + receiverId);
  connectionStatusEl.textContent = `Status: Connecting to ${receiverId}...`;

  if (currentConnection) {
    console.log('Closing existing connection before opening a new one.');
    currentConnection.close();
  }

  const conn = peer.connect(receiverId, { reliable: true });
  currentConnection = conn;
  setupConnectionEvents(conn);
}

function sendFile() {
  if (!currentConnection || !currentConnection.open) {
    alert('Not connected to any peer. Please connect first.');
    return;
  }
  if (fileInput.files.length === 0) {
    alert('Please select a file to send.');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const fileData = event.target.result; 
    console.log(`Sending file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    connectionStatusEl.textContent = `Status: Sending ${file.name}...`;

    currentConnection.send({
      type: 'file',
      fileName: file.name,
      fileType: file.type,
      fileData: fileData, 
      fileSize: file.size
    });
    connectionStatusEl.textContent = `Status: File ${file.name} sent!`;
    fileInput.value = ''; 
  };

  reader.onerror = (error) => {
    console.error('FileReader error:', error);
    connectionStatusEl.textContent = 'Status: Error reading file.';
    alert('Error reading file.');
  };

  reader.readAsArrayBuffer(file); 
}

function disableSendControls() {
  fileInput.disabled = true;
  sendFileBtn.disabled = true;
}

copyIdBtn.addEventListener('click', () => {
  if (myPeerIdEl.textContent && myPeerIdEl.textContent !== 'Initializing...' && !myPeerIdEl.textContent.startsWith('Error')) {
    navigator.clipboard.writeText(myPeerIdEl.textContent)
      .then(() => {
        alert('Peer ID copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy ID: ', err);
        alert('Failed to copy ID. Please copy it manually.');
      });
  } else {
    alert('Peer ID not available yet.');
  }
});

connectBtn.addEventListener('click', connectToPeer);
sendFileBtn.addEventListener('click', sendFile);

initializePeer();

window.addEventListener('beforeunload', () => {
  if (peer && !peer.destroyed) {
    peer.destroy();
  }
});
