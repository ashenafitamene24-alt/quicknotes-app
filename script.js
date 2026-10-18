// ==========================================================================
// QuickNotes — Application Logic
// ==========================================================================

// 1. Element selection with querySelector
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const searchInput = document.querySelector('#search-input');
const clearAllBtn = document.querySelector('#clear-all-btn');

const STORAGE_KEY = 'quicknotes_notes';

// 2. State: array of note objects
let notes = [];

// Load notes from localStorage
function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        notes = parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load notes from localStorage:', err);
    notes = [];
  }
}

// Save notes to localStorage
function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes to localStorage:', err);
  }
}

// Helper function to format human-readable date & time
function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

// 3. Update note count paragraph correctly
function updateCount(count = notes.length) {
  if (count === 0) {
    noteCount.textContent = 'You have no notes yet.';
  } else if (count === 1) {
    noteCount.textContent = 'You have 1 note.';
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// 4. Delete a note by its unique ID
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

// 5. Render function: rebuilds the list using createElement & textContent
function render() {
  // Clear the list container
  notesList.textContent = '';

  // Always update count reflecting total notes
  updateCount(notes.length);

  // Search filter (case-insensitive)
  const query = searchInput.value.trim().toLowerCase();
  const visibleNotes = query
    ? notes.filter((note) => note.text.toLowerCase().includes(query))
    : notes;

  // Search finds nothing
  if (query && visibleNotes.length === 0) {
    const noMatchLi = document.createElement('li');
    noMatchLi.className = 'empty-state';
    noMatchLi.textContent = 'No notes match your search.';
    notesList.appendChild(noMatchLi);
    return;
  }

  // Render each visible note as a card
  visibleNotes.forEach((note) => {
    const li = document.createElement('li');
    const categoryKey = (note.category || 'personal').toLowerCase();
    li.className = `note-card category-${categoryKey}`;
    li.dataset.id = note.id;

    // Header row with note text
    const headerRow = document.createElement('div');
    headerRow.className = 'note-header-row';

    const textP = document.createElement('p');
    textP.className = 'note-text';
    textP.textContent = note.text;
    headerRow.appendChild(textP);

    // Footer row with category badge, date, and Delete button
    const footerRow = document.createElement('div');
    footerRow.className = 'note-footer-row';

    const metaLeft = document.createElement('div');
    metaLeft.className = 'note-meta-left';

    const badge = document.createElement('span');
    badge.className = `category-badge badge-${categoryKey}`;
    badge.textContent = note.category.charAt(0).toUpperCase() + note.category.slice(1);
    metaLeft.appendChild(badge);

    const dateSpan = document.createElement('span');
    dateSpan.className = 'note-date';
    dateSpan.textContent = note.createdAt;
    metaLeft.appendChild(dateSpan);

    footerRow.appendChild(metaLeft);

    // Delete button: removes its own note
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete note: ${note.text.slice(0, 20)}`);
    deleteBtn.addEventListener('click', () => {
      deleteNote(note.id);
    });
    footerRow.appendChild(deleteBtn);

    li.appendChild(headerRow);
    li.appendChild(footerRow);
    notesList.appendChild(li);
  });
}

// Clear error on input change
noteInput.addEventListener('input', () => {
  if (errorMessage.textContent) {
    errorMessage.textContent = '';
  }
});

// Search input listener (filters in real time)
searchInput.addEventListener('input', () => {
  render();
});

// 6. Form submission with validation
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const rawText = noteInput.value;
  const trimmedText = rawText.trim();

  // Validation: empty or only spaces
  if (trimmedText === '') {
    errorMessage.textContent = 'Please type a note first.';
    noteInput.focus();
    return;
  }

  // Validation: over 200 characters
  if (trimmedText.length > 200) {
    errorMessage.textContent = 'Notes must be 200 characters or fewer.';
    noteInput.focus();
    return;
  }

  // Clear validation error when valid note is added
  errorMessage.textContent = '';

  const category = noteCategory.value;

  // Create note object
  const newNote = {
    id: Date.now().toString(),
    text: trimmedText,
    category: category,
    createdAt: formatDateTime(new Date())
  };

  notes.push(newNote);
  saveNotes();
  render();

  // Clear input
  noteInput.value = '';
});

// 7. Bonus: Clear all notes with confirmation prompt
if (clearAllBtn) {
  clearAllBtn.addEventListener('click', () => {
    if (notes.length === 0) {
      return;
    }
    const confirmed = confirm('Delete all notes?');
    if (confirmed) {
      notes = [];
      saveNotes();
      render();
    }
  });
}

// 8. Application Bootstrap
loadNotes();
render();
