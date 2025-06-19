// DOM Elements
const recordButton = document.querySelector('.record-btn');
const modal = document.getElementById('recordingModal');
const closeButton = document.querySelector('.close-btn');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const videoPreview = document.getElementById('videoPreview');
const videoGrid = document.getElementById('videoGrid');

// State
let mediaRecorder;
let recordedChunks = [];
let stream;

// Mock Data for Videos and Live Sessions
const mockVideos = [
    { id: 1, title: 'Creative Coding Tutorial', author: 'Sarah Chen', views: '2.5K', duration: '15:30' },
    { id: 2, title: 'Web Development Tips', author: 'Mike Johnson', views: '1.8K', duration: '08:45' },
    { id: 3, title: 'Design Principles', author: 'Alex Wong', views: '3.2K', duration: '12:20' }
];

const mockLiveSessions = [
    { id: 1, title: 'Morning Meditation', participants: 156 },
    { id: 2, title: 'Tech Talk Live', participants: 432 },
    { id: 3, title: 'Music Production', participants: 289 }
];

// Initialize the app
function init() {
    renderVideos();
    renderLiveSessions();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    recordButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    startRecordingButton.addEventListener('click', startRecording);
    stopRecordingButton.addEventListener('click', stopRecording);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Modal Functions
function openModal() {
    modal.classList.add('active');
    setupMediaStream();
}

function closeModal() {
    modal.classList.remove('active');
    stopMediaStream();
}

// Media Stream Functions
async function setupMediaStream() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        videoPreview.srcObject = stream;
    } catch (err) {
        console.error('Error accessing media devices:', err);
        alert('Unable to access camera and microphone. Please check permissions.');
    }
}

function stopMediaStream() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    videoPreview.srcObject = null;
}

// Recording Functions
function startRecording() {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };

    mediaRecorder.onstop = createVideo;

    mediaRecorder.start();
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
}

function stopRecording() {
    mediaRecorder.stop();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
}

function createVideo() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    addVideoToGrid({
        id: Date.now(),
        title: 'My New Video',
        author: 'You',
        views: '0',
        duration: '00:00',
        url: url
    });
    closeModal();
}

// Render Functions
function renderVideos() {
    videoGrid.innerHTML = mockVideos.map(video => createVideoCard(video)).join('');
}

function createVideoCard(video) {
    return `
        <div class="video-card" data-id="${video.id}">
            <div class="video-thumbnail" style="background-color: var(--surface-dark); height: 180px;">
                ${video.url ? `<video src="${video.url}" controls></video>` : ''}
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p class="author">${video.author}</p>
                <div class="video-stats">
                    <span>${video.views} views</span>
                    <span>${video.duration}</span>
                </div>
            </div>
        </div>
    `;
}

function addVideoToGrid(video) {
    const videoCard = document.createElement('div');
    videoCard.innerHTML = createVideoCard(video);
    videoGrid.insertBefore(videoCard.firstElementChild, videoGrid.firstChild);
}

function renderLiveSessions() {
    const liveSessionsContainer = document.getElementById('liveSessions');
    liveSessionsContainer.innerHTML = mockLiveSessions.map(session => `
        <div class="live-session">
            <div class="live-indicator">LIVE</div>
            <h4>${session.title}</h4>
            <p>${session.participants} watching</p>
        </div>
    `).join('');
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 
