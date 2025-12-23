// Global variables to store image data
let galleryImageData = null;
let aboutImageData = null;
let journalImageData = null;
let certImageData = null;

// Initialize data from localStorage
function loadSavedData() {
    // Load profile data
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

    // Load gallery items
    const savedGallery = JSON.parse(localStorage.getItem('portfolioGallery'));
    if (savedGallery && savedGallery.length > 0) {
        const grid = document.getElementById('galleryGrid');
        // Clear existing items except sample ones
        grid.innerHTML = '';
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

    // Load journal entries
    const savedJournal = JSON.parse(localStorage.getItem('portfolioJournal'));
    if (savedJournal && savedJournal.length > 0) {
        const grid = document.getElementById('journalGrid');
        grid.innerHTML = '';
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
            grid.appendChild(newItem);
        });
    }

    // Load certifications
    const savedCerts = JSON.parse(localStorage.getItem('portfolioCertifications'));
    if (savedCerts && savedCerts.length > 0) {
        const grid = document.getElementById('certificationsGrid');
        grid.innerHTML = '';
        savedCerts.forEach(item => {
            const newItem = document.createElement('div');
            newItem.className = 'gallery-item';
            newItem.onclick = function() { openModal(this.querySelector('img').src); };
            newItem.innerHTML = `<img src="${item.image}" alt="${item.title}">`;
            grid.appendChild(newItem);
        });
    }
}

// Save profile data
function saveProfile(name, title, bio, image) {
    const profileData = {
        name: name || document.getElementById('aboutNameText').textContent,
        title: title || document.getElementById('aboutTitleText').textContent,
        bio: bio || document.getElementById('aboutBioText').textContent,
        image: image || document.getElementById('aboutProfileImg').src
    };
    localStorage.setItem('portfolioProfile', JSON.stringify(profileData));
}

// Save gallery data
function saveGallery() {
    const galleryItems = [];
    document.querySelectorAll('#galleryGrid .gallery-item').forEach(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        galleryItems.push({
            image: img.src,
            title: title,
            description: description
        });
    });
    localStorage.setItem('portfolioGallery', JSON.stringify(galleryItems));
}

// Save journal data
function saveJournal() {
    const journalItems = [];
    document.querySelectorAll('#journalGrid .gallery-item').forEach(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const content = item.querySelector('p').textContent;
        journalItems.push({
            image: img.src,
            title: title,
            content: content
        });
    });
    localStorage.setItem('portfolioJournal', JSON.stringify(journalItems));
}

// Save certifications data
function saveCertifications() {
    const certItems = [];
    document.querySelectorAll('#certificationsGrid .gallery-item').forEach(item => {
        const img = item.querySelector('img');
        certItems.push({
            image: img.src,
            title: img.alt
        });
    });
    localStorage.setItem('portfolioCertifications', JSON.stringify(certItems));
}

// Toggle sidebar with proper event handling
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    const isActive = sidebar.classList.contains('active');
    
    if (isActive) {
        // Close sidebar
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    } else {
        // Open sidebar
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close sidebar when clicking overlay
function closeSidebarOverlay() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Page navigation function
function showPage(pageId) {
    // Remove active class from all pages and nav links
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    
    // Add active class to selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to corresponding nav link
    event.target.classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Preview image for gallery
function previewGalleryImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            galleryImageData = e.target.result;
            document.getElementById('galleryImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Preview image for about section
function previewAboutImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            aboutImageData = e.target.result;
            document.getElementById('aboutImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Preview image for journal
function previewJournalImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            journalImageData = e.target.result;
            document.getElementById('journalImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Preview image for certification
function previewCertImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            certImageData = e.target.result;
            document.getElementById('certImagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Add new item to gallery
function addGalleryItem() {
    const title = document.getElementById('galleryTitle').value;
    const description = document.getElementById('galleryDescription').value;

    if (!title || !description) {
        alert('Please fill in both title and description');
        return;
    }

    const imageUrl = galleryImageData || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
    const grid = document.getElementById('galleryGrid');
    
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

    // Save to localStorage
    saveGallery();

    // Clear form
    document.getElementById('galleryTitle').value = '';
    document.getElementById('galleryDescription').value = '';
    document.getElementById('galleryImage').value = '';
    document.getElementById('galleryImagePreview').innerHTML = '';
    galleryImageData = null;

    // Close sidebar and show success
    toggleSidebar();
    setTimeout(() => {
        alert('✅ Memory added and saved successfully!');
    }, 300);
}

// Add new journal entry
function addJournalEntry() {
    const title = document.getElementById('journalTitle').value;
    const content = document.getElementById('journalContent').value;

    if (!title || !content) {
        alert('Please fill in both title and content');
        return;
    }

    if (!journalImageData) {
        alert('Please upload an image for the journal entry');
        return;
    }

    const grid = document.getElementById('journalGrid');
    
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

    // Save to localStorage
    saveJournal();

    // Clear form
    document.getElementById('journalTitle').value = '';
    document.getElementById('journalContent').value = '';
    document.getElementById('journalImage').value = '';
    document.getElementById('journalImagePreview').innerHTML = '';
    journalImageData = null;

    // Close sidebar and show success
    toggleSidebar();
    setTimeout(() => {
        alert('✅ Journal entry added and saved successfully!');
    }, 300);
}

// Add new certification
function addCertification() {
    const title = document.getElementById('certTitle').value;

    if (!title) {
        alert('Please enter a certification name');
        return;
    }

    if (!certImageData) {
        alert('Please upload a certificate image');
        return;
    }
    
    const grid = document.getElementById('certificationsGrid');
    
    const newItem = document.createElement('div');
    newItem.className = 'gallery-item';
    newItem.onclick = function() { openModal(this.querySelector('img').src); };
    newItem.innerHTML = `<img src="${certImageData}" alt="${title}">`;
    grid.insertBefore(newItem, grid.firstChild);

    // Save to localStorage
    saveCertifications();

    // Clear form
    document.getElementById('certTitle').value = '';
    document.getElementById('certDescription').value = '';
    document.getElementById('certImage').value = '';
    document.getElementById('certImagePreview').innerHTML = '';
    certImageData = null;

    // Close sidebar and show success
    toggleSidebar();
    setTimeout(() => {
        alert('✅ Certification added and saved successfully!');
    }, 300);
}

// Update about section
function updateAbout() {
    const name = document.getElementById('aboutName').value;
    const title = document.getElementById('aboutTitle').value;
    const bio = document.getElementById('aboutBio').value;
    let profileImage = document.getElementById('aboutProfileImg').src;

    if (name) {
        document.getElementById('aboutNameText').textContent = name;
    }
    if (title) {
        document.getElementById('aboutTitleText').textContent = title;
    }
    if (bio) {
        document.getElementById('aboutBioText').textContent = bio;
        document.getElementById('aboutBioText2').textContent = '';
    }
    if (aboutImageData) {
        document.getElementById('aboutProfileImg').src = aboutImageData;
        document.getElementById('homeProfileImg').src = aboutImageData;
        profileImage = aboutImageData;
    }

    // Save to localStorage
    saveProfile(
        name || document.getElementById('aboutNameText').textContent,
        title || document.getElementById('aboutTitleText').textContent,
        bio || document.getElementById('aboutBioText').textContent,
        profileImage
    );

    // Clear form
    document.getElementById('aboutName').value = '';
    document.getElementById('aboutTitle').value = '';
    document.getElementById('aboutBio').value = '';
    document.getElementById('aboutImage').value = '';
    document.getElementById('aboutImagePreview').innerHTML = '';
    aboutImageData = null;

    // Close sidebar and show success
    toggleSidebar();
    setTimeout(() => {
        alert('✅ Profile updated and saved successfully!');
    }, 300);
}

// Open modal to view enlarged image
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('imageModal').classList.remove('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage
    loadSavedData();

    // Set up navigation link active states
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        }
    });

    // Show welcome message if first time visiting
    if (!localStorage.getItem('portfolioVisited')) {
        setTimeout(() => {
            alert('👋 Welcome! Click "✏️ Edit Mode" to customize your portfolio.');
            localStorage.setItem('portfolioVisited', 'true');
        }, 1000);
    }
});