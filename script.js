// Global variables to store image data buffers
let galleryImageData = null;
let aboutImageData = null;
let journalImageData = null;
let certImageData = null;

// Initialize data layers from localStorage state
function loadSavedData() {
    // Load profile information
    const savedProfile = JSON.parse(localStorage.getItem('portfolioProfile'));
    if (savedProfile) {
        if (savedProfile.name) {
            document.getElementById('aboutNameText').textContent = savedProfile.name;
        }
        if (savedProfile.title) {
            document.getElementById('aboutTitleText').textContent = savedProfile.title;
        }
        if (savedProfile.bio) {
            document.getElementById('aboutBioText').textContent = savedProfile.bio;
            document.getElementById('aboutBioText2').textContent = '';
        }
        if (savedProfile.image) {
            document.getElementById('aboutProfileImg').src = savedProfile.image;
            document.getElementById('homeProfileImg').src = savedProfile.image;
        }
    }

    // Load custom gallery items securely
    const savedGallery = JSON.parse(localStorage.getItem('portfolioGallery'));
    const grid = document.getElementById('galleryGrid');
    const customSection = document.getElementById('customGallerySection');
    
    if (savedGallery && savedGallery.length > 0 && grid) {
        grid.innerHTML = '';
        if (customSection) customSection.style.display = 'block';
        
        savedGallery.forEach(item => {
            const newItem = document.createElement('div');
            newItem.className = 'gallery-item';
            newItem.onclick = function() { openModal(this.querySelector('img').src); };
            newItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="gallery-item-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            grid.appendChild(newItem);
        });
    }

    // Load journal elements
    const savedJournal = JSON.parse(localStorage.getItem('portfolioJournal'));
    const jGrid = document.getElementById('journalGrid');
    if (savedJournal && savedJournal.length > 0 && jGrid) {
        // Keep hardcoded template objects, append customized items atop cleanly
        savedJournal.forEach(item => {
            const newItem = document.createElement('div');
            newItem.className = 'gallery-item';
            newItem.onclick = function() { openModal(this.querySelector('img').src); };
            newItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="gallery-item-content">
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                </div>
            `;
            jGrid.insertBefore(newItem, jGrid.firstChild);
        });
    }

    // Load certifications configurations
    const savedCerts = JSON.parse(localStorage.getItem('portfolioCertifications'));
    const cGrid = document.getElementById('certificationsGrid');
    if (savedCerts && savedCerts.length > 0 && cGrid) {
        savedCerts.forEach(item => {
            const newItem = document.createElement('div');
            newItem.className = 'gallery-item';
            newItem.onclick = function() { openModal(this.querySelector('img').src); };
            newItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="item-overlay"><span class="btn-cta">View Document</span></div>
            `;
            cGrid.insertBefore(newItem, cGrid.firstChild);
        });
    }
}

// Save profile properties
function saveProfile(name, title, bio, image) {
    const profileData = {
        name: name || document.getElementById('aboutNameText').textContent,
        title: title || document.getElementById('aboutTitleText').textContent,
        bio: bio || document.getElementById('aboutBioText').textContent,
        image: image || document.getElementById('aboutProfileImg').src
    };
    localStorage.setItem('portfolioProfile', JSON.stringify(profileData));
}

// Save gallery configurations down to LocalStorage arrays
function saveGallery() {
    const galleryItems = [];
    const grid = document.getElementById('galleryGrid');
    if(grid) {
        grid.querySelectorAll('.gallery-item').forEach(item => {
            const img = item.querySelector('img');
            const h3 = item.querySelector('h3');
            const p = item.querySelector('p');
            if(img && h3 && p) {
                galleryItems.push({
                    image: img.src,
                    title: h3.textContent,
                    description: p.textContent
                });
            }
        });
        localStorage.setItem('portfolioGallery', JSON.stringify(galleryItems));
    }
}

// Save journal structural data down to local layers
function saveJournal() {
    const journalItems = [];
    document.querySelectorAll('#journalGrid .gallery-item').forEach(item => {
        const img = item.querySelector('img');
        const h3 = item.querySelector('h3');
        const p = item.querySelector('p');
        if (img && h3 && p) {
            journalItems.push({
                image: img.src,
                title: h3.textContent,
                content: p.textContent
            });
        }
    });
    localStorage.setItem('portfolioJournal', JSON.stringify(journalItems));
}

// Save certificate data elements
function saveCertifications() {
    const certItems = [];
    document.querySelectorAll('#certificationsGrid .gallery-item').forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            certItems.push({
                image: img.src,
                title: img.alt
            });
        }
    });
    localStorage.setItem('portfolioCertifications', JSON.stringify(certItems));
}

// Toggle interface control sidebar panels
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if(!sidebar) return;
    
    const isActive = sidebar.classList.contains('active');
    if (isActive) {
        sidebar.classList.remove('active');
        if(overlay) overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    } else {
        sidebar.classList.add('active');
        if(overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSidebarOverlay() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if(sidebar) sidebar.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Page navigation module - Updated for reliable CTA link synchronization
function showPage(pageId) {
    // Hide active tabs
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if(targetPage) {
        targetPage.classList.add('active');
    }
    
    // Explicit navbar anchor tag styling sync
    const matchingNavLink = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
    if(matchingNavLink) {
        matchingNavLink.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FileReader helpers for image caching maps
function previewGalleryImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            galleryImageData = e.target.result;
            document.getElementById('galleryImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview Grid Image">`;
        };
        reader.readAsDataURL(file);
    }
}

function previewAboutImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            aboutImageData = e.target.result;
            document.getElementById('aboutImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview Profile Image">`;
        };
        reader.readAsDataURL(file);
    }
}

function previewJournalImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            journalImageData = e.target.result;
            document.getElementById('journalImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview Journal Canvas">`;
        };
        reader.readAsDataURL(file);
    }
}

function previewCertImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            certImageData = e.target.result;
            document.getElementById('certImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview Certificate Page">`;
        };
        reader.readAsDataURL(file);
    }
}

// Append runtime elements to custom gallery layout wrapper
function addGalleryItem() {
    const title = document.getElementById('galleryTitle').value;
    const description = document.getElementById('galleryDescription').value;

    if (!title || !description) {
        alert('Please fill in both title and description fields.');
        return;
    }

    const imageUrl = galleryImageData || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
    const grid = document.getElementById('galleryGrid');
    const customSection = document.getElementById('customGallerySection');
    
    if(grid) {
        if (customSection) customSection.style.display = 'block';
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item';
        newItem.onclick = function() { openModal(this.querySelector('img').src); };
        newItem.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <div class="gallery-item-content">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
        grid.insertBefore(newItem, grid.firstChild);
        saveGallery();
    }

    // Reset Form fields
    document.getElementById('galleryTitle').value = '';
    document.getElementById('galleryDescription').value = '';
    document.getElementById('galleryImage').value = '';
    document.getElementById('galleryImagePreview').innerHTML = '';
    galleryImageData = null;

    toggleSidebar();
    setTimeout(() => { alert('✅ Memory saved successfully!'); }, 300);
}

// Process dynamic journal updates
function addJournalEntry() {
    const title = document.getElementById('journalTitle').value;
    const content = document.getElementById('journalContent').value;

    if (!title || !content || !journalImageData) {
        alert('Please provide a title, content, and uploaded reference file image.');
        return;
    }

    const grid = document.getElementById('journalGrid');
    if(grid) {
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item';
        newItem.onclick = function() { openModal(this.querySelector('img').src); };
        newItem.innerHTML = `
            <img src="${journalImageData}" alt="${title}">
            <div class="gallery-item-content">
                <h3>${title}</h3>
                <p>${content}</p>
            </div>
        `;
        grid.insertBefore(newItem, grid.firstChild);
        saveJournal();
    }

    document.getElementById('journalTitle').value = '';
    document.getElementById('journalContent').value = '';
    document.getElementById('journalImage').value = '';
    document.getElementById('journalImagePreview').innerHTML = '';
    journalImageData = null;

    toggleSidebar();
    setTimeout(() => { alert('✅ Journal array updated!'); }, 300);
}

// Process structural verification profiles updates
function addCertification() {
    const title = document.getElementById('certTitle').value;

    if (!title || !certImageData) {
        alert('Please fill in certificate name and drop your documentation image.');
        return;
    }
    
    const grid = document.getElementById('certificationsGrid');
    if(grid) {
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item';
        newItem.onclick = function() { openModal(this.querySelector('img').src); };
        newItem.innerHTML = `
            <img src="${certImageData}" alt="${title}">
            <div class="item-overlay"><span class="btn-cta">View Document</span></div>
        `;
        grid.insertBefore(newItem, grid.firstChild);
        saveCertifications();
    }

    document.getElementById('certTitle').value = '';
    document.getElementById('certImage').value = '';
    document.getElementById('certImagePreview').innerHTML = '';
    certImageData = null;

    toggleSidebar();
    setTimeout(() => { alert('✅ Certification verified and appended!'); }, 300);
}

// Commit bio layout adjustments directly to DOM frameworks
function updateAbout() {
    const name = document.getElementById('aboutName').value;
    const title = document.getElementById('aboutTitle').value;
    const bio = document.getElementById('aboutBio').value;
    let profileImage = document.getElementById('aboutProfileImg').src;

    if (name) document.getElementById('aboutNameText').textContent = name;
    if (title) document.getElementById('aboutTitleText').textContent = title;
    if (bio) {
        document.getElementById('aboutBioText').textContent = bio;
        document.getElementById('aboutBioText2').textContent = '';
    }
    if (aboutImageData) {
        document.getElementById('aboutProfileImg').src = aboutImageData;
        document.getElementById('homeProfileImg').src = aboutImageData;
        profileImage = aboutImageData;
    }

    saveProfile(
        name || document.getElementById('aboutNameText').textContent,
        title || document.getElementById('aboutTitleText').textContent,
        bio || document.getElementById('aboutBioText').textContent,
        profileImage
    );

    document.getElementById('aboutName').value = '';
    document.getElementById('aboutTitle').value = '';
    document.getElementById('aboutBio').value = '';
    document.getElementById('aboutImage').value = '';
    document.getElementById('aboutImagePreview').innerHTML = '';
    aboutImageData = null;

    toggleSidebar();
    setTimeout(() => { alert('✅ Core Profile configuration committed!'); }, 300);
}

// Modal handling routines
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    if(modal && modalImage) {
        modalImage.src = imageSrc;
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if(modal) modal.classList.remove('active');
}

// Initial content boot sequences
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();

    // Hotkey bindings to catch exit states natively
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
            closeModal();
        }
    });
});
