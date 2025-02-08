

// Save a new note
document.getElementById("save").addEventListener("click", () => {
  const heading = document.getElementById("note-heading").value.trim();
  const content = document.getElementById("note-content").value.trim();
  const timestamp = new Date().toISOString();

  if (!heading || !content) {
    alert("Heading and content cannot be empty!");
    return;
  }

  chrome.storage.sync.get("notes", (data) => {
    const notes = data.notes || [];
    notes.push({ heading, content ,timestamp});

    chrome.storage.sync.set({ notes }, () => {
      document.getElementById("note-heading").value = "";
      document.getElementById("note-content").value = "";
      const messageElement = document.getElementById("message");
      messageElement.textContent = "Your note is saved!";
      messageElement.style.display = "block";

      setTimeout(() => {
        messageElement.style.display = "none";
      }, 2000); // Hide after 2 seconds

    });
  });
});

// Switch to saved notes view
document.getElementById("view-saved").addEventListener("click", () => {
  // document.getElementById("notes-view").style.display = "none";
  document.getElementById("notes-view").style.display = "none";
  document.getElementById("saved-notes-view").style.display = "grid";
  loadNotes(); // Load saved notes
});

// Go back to the note creation page
document.getElementById("back").addEventListener("click", () => {
  document.getElementById("notes-view").style.display = "grid";
  document.getElementById("saved-notes-view").style.display = "none";
});

// Load and display saved notes
function loadNotes() {
  chrome.storage.sync.get("notes", (data) => {
    const notes = data.notes || [];
    const notesList = document.getElementById("notes-list");

    // Clear existing notes
    notesList.innerHTML = "";
    notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Display each note
    notes.forEach((noteObj, index) => {
      const listItem = document.createElement("li");

      // Note heading and preview
      listItem.innerHTML = `
        <h3 class="saved-note-heading">${noteObj.heading ? noteObj.heading: "No Heading"}</h3>
        <p class="saved-note-content">${noteObj.content ? noteObj.content.substring(0, 15) : "No Content"}...</p>
        <p class="saved-note-time">${noteObj.timestamp.split('T')[0]}</p>`
        ;

      // Show More button
      const showMoreButton = document.createElement("button");
      showMoreButton.textContent = "Show More";
      showMoreButton.className = "show-more-saved";
      showMoreButton.onclick = () => showNoteDetails(noteObj,index);

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      showMoreButton.className = "delete-saved";
      deleteButton.onclick = () => deleteNote(index);

      listItem.appendChild(showMoreButton);
      listItem.appendChild(deleteButton);
      notesList.appendChild(listItem);
    });
  });
}

// Show complete note details
function showNoteDetails(note,index) {
  document.getElementById("saved-notes-view").style.display = "none";
  const noteHead=document.createElement("h2");
  noteHead.textContent=note.heading;
  const noteContent=document.createElement("p");
  noteContent.textContent=note.content;
  const noteTime=document.createElement("p");
  noteTime.textContent=note.timestamp.split('T')[0];
  
  const noteDetails=document.getElementById("note-details");
  noteDetails.innerHTML="";
  noteDetails.appendChild(noteHead);
  noteDetails.appendChild(noteContent);
  noteDetails.appendChild(noteTime);
  noteDetails.style.display = "flex";
  noteDetails.style.flexDirection = "column";
  noteDetails.style.justifyContent = "center";
  noteDetails.style.alignItems = "center";
  const backButton=document.createElement("button");
  const deleteButton=document.createElement("button");
  deleteButton.textContent="Delete";
  backButton.textContent="Back";
  backButton.onclick=()=>{
    document.getElementById("saved-notes-view").style.display = "grid";
    noteDetails.style.display = "none";
  }
  deleteButton.onclick=()=>deleteNote(index);
  noteDetails.appendChild(backButton);
  noteDetails.appendChild(deleteButton);

}

// Delete a note
function deleteNote(index) {

  document.getElementById("note-details").style.display = "none";
  const messageElement = document.getElementById("deleted-msg");
  messageElement.textContent = "Note deleted!";
  messageElement.style.display = "block";
  setTimeout(() => {
    messageElement.style.display = "none";
  }, 2000)
  document.getElementById("saved-notes-view").style.display = "grid";
  chrome.storage.sync.get("notes", (data) => {
    const notes = data.notes || [];
    notes.splice(index, 1); // Remove note at the specified index

    chrome.storage.sync.set({ notes }, () => {
      loadNotes(); // Refresh the note list
    });
  });
}

// Load notes when the popup is opened
document.addEventListener("DOMContentLoaded", loadNotes);