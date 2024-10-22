// Function to toggle mirror
function toggleMirror() {
    document.body.classList.toggle('mirrored');
}

// Function to toggle bold text
function toggleBoldText() {
    document.body.style.fontWeight = document.body.style.fontWeight === 'bold' ? 'normal' : 'bold';
}

// Function to generate version number based on the current date
function getVersion() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `Version: ${year}.${month}.${day}`;
}

// Set version number on the page
document.getElementById('version').innerText = getVersion();

// Disable caching by adding a cache-busting query to all links and resources
function cacheBust() {
    const elements = document.querySelectorAll('link, script, img');
    elements.forEach((element) => {
        const srcAttr = element.tagName === 'LINK' ? 'href' : 'src';
        const url = element.getAttribute(srcAttr);
        if (url) {
            element.setAttribute(srcAttr, `${url}?v=${new Date().getTime()}`);
        }
    });
}

// Function to count words and estimate narration time
function countWordsAndEstimateTime() {
    const sections = document.querySelectorAll('.section');
    let totalWords = 0;
    let totalTime = 0;
    sections.forEach((section) => {
        const text = section.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const timeToNarrate = Math.ceil(wordCount / 150); // Assuming 150 words per minute
        totalWords += wordCount;
        totalTime += timeToNarrate;
        const wordCountElement = section.querySelector('.word-count');
        wordCountElement.textContent = `Word count: ${wordCount} | Estimated narration time: ${timeToNarrate} minute${timeToNarrate !== 1 ? 's' : ''}`;
    });
    const totalNarrationTimeElement = document.getElementById('total-narration-time');
    totalNarrationTimeElement.textContent = `Total word count: ${totalWords} | Total estimated narration time: ${totalTime} minute${totalTime !== 1 ? 's' : ''}`;
}

// Function to load and render content
function loadAndRenderContent() {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('content-container');
            data.sections.forEach((section, index) => {
                const sectionElement = document.createElement('div');
                sectionElement.className = `section section-${index + 1}`;
                sectionElement.innerHTML = `
                    <h2>${section.title}</h2>
                    <h3>MOOD</h3>
                    ${section.mood.map(m => `<p>${m}</p>`).join('')}
                    <pre><code>${section.timing}</code></pre>
                    ${renderSubsections(section.subsections)}
                    <div class="word-count"></div>
                `;
                container.appendChild(sectionElement);
            });
            countWordsAndEstimateTime();
        })
        .catch(error => console.error('Error loading content:', error));
}

function renderSubsections(subsections) {
    return subsections.map(subsection => `
        <div class="subsection">
            <h4>${subsection.subtitle}</h4>
            ${subsection.content.map(c => `<p>${c}</p>`).join('')}
            ${subsection.voiceover ? `<p class="voiceover">${subsection.voiceover}</p>` : ''}
            ${subsection.quote ? `<blockquote class="famous-quote">${subsection.quote}</blockquote>` : ''}
        </div>
    `).join('');
}

// Function to toggle rotation and invert colors
function toggleRotation() {
    const centeredDiv = document.querySelector('.centered');
    centeredDiv.classList.toggle('mirrored');
    document.body.classList.toggle('inverted');
}

// Function to increase font size
function increaseFontSize() {
    const elements = document.querySelectorAll('.centered, .centered *');
    elements.forEach(element => {
        const currentSize = window.getComputedStyle(element).fontSize;
        const newSize = parseFloat(currentSize) + 2;
        element.style.fontSize = newSize + 'px';
    });
}

// Call loadAndRenderContent when the page loads
window.onload = function() {
    loadAndRenderContent();
    cacheBust();
};
