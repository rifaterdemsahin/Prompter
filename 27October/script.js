// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Toggle functions
const toggleClass = (element, className) => element.classList.toggle(className);
const toggleMirror = () => toggleClass(document.body, 'mirrored');
const toggleBoldText = () => document.body.style.fontWeight = document.body.style.fontWeight === 'bold' ? 'normal' : 'bold';
const toggleRotation = () => {
    toggleClass($('.centered'), 'mirrored');
    toggleClass(document.body, 'inverted');
};

// Version function
const getVersion = () => {
    const date = new Date();
    return `Version: ${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// Cache busting
const cacheBust = () => {
    $$('link, script, img').forEach(element => {
        const srcAttr = element.tagName === 'LINK' ? 'href' : 'src';
        const url = element.getAttribute(srcAttr);
        if (url) element.setAttribute(srcAttr, `${url}?v=${Date.now()}`);
    });
};

// Word count and time estimation
const countWordsAndEstimateTime = () => {
    let totalWords = 0;
    let totalTime = 0;
    $$('.section').forEach(section => {
        const wordCount = section.innerText.trim().split(/\s+/).length;
        const timeToNarrate = Math.ceil(wordCount / 150);
        totalWords += wordCount;
        totalTime += timeToNarrate;
        const wordCountElement = section.querySelector('.word-count');
        wordCountElement.textContent = `📊 Word count: ${wordCount} | ⏱️ Estimated narration time: ${timeToNarrate} minute${timeToNarrate !== 1 ? 's' : ''}`;
        resetAnimation(wordCountElement);
    });
    const totalNarrationTimeElement = $('#total-narration-time');
    totalNarrationTimeElement.innerHTML = `<strong>📚 Total word count: ${totalWords} | 🕰️ Total estimated narration time: ${totalTime} minute${totalTime !== 1 ? 's' : ''}</strong>`;
    resetAnimation(totalNarrationTimeElement);
};

// Reset animation
const resetAnimation = (element) => {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = null;
};

// Render subsections
const renderSubsections = (subsections) => subsections.map(subsection => `
    <div class="subsection">
        <h4>${getSubsectionEmoji(subsection.subtitle)} ${subsection.subtitle}</h4>
        ${subsection.content.map(c => `<p>${c}</p>`).join('')}
        ${subsection.voiceover ? `<p class="voiceover">${subsection.voiceover}</p>` : ''}
        ${subsection.quote ? `<blockquote class="famous-quote">${subsection.quote}</blockquote>` : ''}
    </div>
`).join('');

// Helper function to get emoji for subsection
const getSubsectionEmoji = (subtitle) => {
    switch (subtitle.toUpperCase()) {
        case 'TELL': return '🗣️';
        case 'SHOW': return '👀';
        case 'DO': return '🛠️';
        case 'APPLY': return '🚀';
        default: return '';
    }
};

// Load and render content
const loadAndRenderContent = () => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const container = $('#content-container');
            container.innerHTML = data.sections.map((section, index) => `
                <div class="section section-${index + 1}">
                    <h2>${section.title}</h2>
                    <div class="word-count"></div>
                    <h3>MOOD</h3>
                    ${section.mood.map(m => `<p>${m}</p>`).join('')}
                    <pre><code>${section.timing}</code></pre>
                    ${renderSubsections(section.subsections)}
                    <button class="edit-button" onclick="editSection(${index})">Edit Section</button>
                </div>
            `).join('');
            countWordsAndEstimateTime();
        })
        .catch(error => console.error('Error loading content:', error));
};

// Edit section
const editSection = (index) => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const section = data.sections[index];
            const editForm = createEditForm(section, index);
            const sectionElement = $(`.section-${index + 1}`);
            sectionElement.innerHTML = editForm;
        })
        .catch(error => console.error('Error loading content for editing:', error));
};

// Create edit form
const createEditForm = (section, index) => `
    <h2><input type="text" id="title-${index}" value="${section.title}"></h2>
    <h3>MOOD</h3>
    ${section.mood.map((m, i) => `<input type="text" id="mood-${index}-${i}" value="${m}">`).join('<br>')}
    <h3>TIMING</h3>
    <input type="text" id="timing-${index}" value="${section.timing}">
    ${section.subsections.map((subsection, subIndex) => `
        <div class="subsection-edit">
            <h4>${subsection.subtitle}</h4>
            ${subsection.content.map((c, contentIndex) => `
                <textarea id="content-${index}-${subIndex}-${contentIndex}">${c}</textarea>
            `).join('')}
            ${subsection.voiceover ? `<textarea id="voiceover-${index}-${subIndex}">${subsection.voiceover}</textarea>` : ''}
            ${subsection.quote ? `<textarea id="quote-${index}-${subIndex}">${subsection.quote}</textarea>` : ''}
        </div>
    `).join('')}
    <button onclick="saveSection(${index})">Save Section</button>
    <button onclick="loadAndRenderContent()">Cancel</button>
`;

// Save section
const saveSection = (index) => {
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            const section = data.sections[index];
            section.title = $(`#title-${index}`).value;
            section.mood = section.mood.map((_, i) => $(`#mood-${index}-${i}`).value);
            section.timing = $(`#timing-${index}`).value;
            section.subsections.forEach((subsection, subIndex) => {
                subsection.content = subsection.content.map((_, contentIndex) => $(`#content-${index}-${subIndex}-${contentIndex}`).value);
                if (subsection.voiceover) {
                    subsection.voiceover = $(`#voiceover-${index}-${subIndex}`).value;
                }
                if (subsection.quote) {
                    subsection.quote = $(`#quote-${index}-${subIndex}`).value;
                }
            });
            
            // Here you would typically send the updated data to a server
            // For this example, we'll just update the local content and re-render
            console.log('Updated content:', data);
            loadAndRenderContent();
        })
        .catch(error => console.error('Error saving content:', error));
};

// Increase font size
const increaseFontSize = () => {
    $$('.centered, .centered *').forEach(element => {
        const currentSize = window.getComputedStyle(element).fontSize;
        element.style.fontSize = `${parseFloat(currentSize) + 2}px`;
    });
};

// Initialize
window.onload = () => {
    $('#version').innerText = getVersion();
    loadAndRenderContent();
    cacheBust();
    
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Content';
    refreshButton.onclick = loadAndRenderContent;
    $('.centered').insertBefore(refreshButton, $('hr'));
};
