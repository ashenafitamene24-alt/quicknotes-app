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

// 2. State: array of note objects
let notes = [];

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

// 3. Render function: rebuilds the list using createElement & textContent
function render() {
  // Clear the list container
  notesList.textContent = '';

  // Render each note as a card
  notes.forEach((note) => {
    const li = document.createElement('li');
    li.className = `note-card category-${note.category.toLowerCase()}`;
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
    badge.className = `category-badge badge-${note.category.toLowerCase()}`;
    badge.textContent = note.category.charAt(0).toUpperCase() + note.category.slice(1);
    metaLeft.appendChild(badge);

    const dateSpan = document.createElement('span');
    dateSpan.className = 'note-date';
    dateSpan.textContent = note.createdAt;
    metaLeft.appendChild(dateSpan);

    footerRow.appendChild(metaLeft);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete note: ${note.text.slice(0, 20)}`);
    footerRow.appendChild(deleteBtn);

    li.appendChild(headerRow);
    li.appendChild(footerRow);
    notesList.appendChild(li);
  });
}

// 4. Form submission handler
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Create note object
  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: category,
    createdAt: formatDateTime(new Date())
  };

  notes.push(newNote);
  render();

  // Clear input
  noteInput.value = '';
});

// Initial render
render();
