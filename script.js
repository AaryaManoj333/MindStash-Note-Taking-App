let addBtn = document.querySelector(".add");
let closeBtn = document.getElementById("closeModalBtn");
let modal = document.querySelector(".addModalClass");
let noteform = document.getElementById("noteform");
let notesContainer = document.getElementById("NotesContainer");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  noteform.reset();
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Save a new note
noteform.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title-heading").value.trim();
  const content = document.getElementById("content-heading").value.trim();
  const tag = document.querySelector('input[name="noteTag"]:checked')?.value || "general";

  if (title && content) {
    const newNote = { title, content, tag };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
    modal.style.display = "none";
    noteform.reset();
  }
});

// Render all notes
function renderNotes() {
  notesContainer.innerHTML = "";
  notes.forEach((note, index) => {
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.innerHTML = `
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content.replace(/\n/g, '<br>')}</p>
      <span class="note-tag" data-tag="${note.tag.toLowerCase()}">${note.tag}</span><br>
      <button onclick="deleteNote(${index})">Delete</button>
    `;
    notesContainer.appendChild(noteCard);
  });

  applyFilters(); // So search and filter update immediately
}


// Delete note
window.deleteNote = function(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
};

// Search and tag filter
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("options");

function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedTag = filterSelect.value.toLowerCase();
  const noteCards = document.querySelectorAll(".note-card");

  noteCards.forEach((note) => {
    const title = note.querySelector(".note-title")?.textContent.toLowerCase().trim() || "";
    const content = note.querySelector(".note-content")?.textContent.toLowerCase().trim() || "";
    const tag = note.querySelector(".note-tag")?.getAttribute("data-tag") || "";

    const matchesQuery = title.includes(query) || content.includes(query);
    const matchesTag = selectedTag === "all" || tag === selectedTag;

    note.style.display = matchesQuery && matchesTag ? "block" : "none";
  });
}


searchInput.addEventListener("input", applyFilters);
filterSelect.addEventListener("change", applyFilters);

// Initial render on page load
renderNotes();
