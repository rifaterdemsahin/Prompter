document.addEventListener("DOMContentLoaded", function() {
    const data = {
        "videotitle": "Complete Big Projects and Self-Learn with Ease on AI",
        "videothumbnailprompt": "Create iMage where someone is building a proof of concept with AI"
    };

    document.getElementById("video-title").textContent = data.videotitle;
    document.getElementById("video-thumbnail").textContent = data.videothumbnailprompt;
});