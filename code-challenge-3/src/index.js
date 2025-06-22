function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById("post-list");
      list.innerHTML = '';
      posts.forEach((post, index) => {
        const div = document.createElement("div");
        div.textContent = post.title;
        div.dataset.id = post.id;
        div.style.cursor = "pointer";
        div.addEventListener("click", () => showPost(post.id));
        list.appendChild(div);
        if (index === 0) {
          showPost(post.id);
        }
      });
    });
}

function showPost(id) {
  fetch(`http://localhost:3000/posts/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
      `;
      const editButton = document.getElementById("edit-button");
      const deleteButton = document.getElementById("delete-button");
      const editForm = document.getElementById("edit-post-form");
      const cancelButton = document.getElementById("cancel-edit");
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-content").value = post.content;
      editButton.style.display = "inline-block";
      deleteButton.style.display = "inline-block";
      editForm.style.display = "none";
      editButton.onclick = () => {
        editForm.style.display = "block";
      };
      cancelButton.onclick = () => {
        editForm.style.display = "none";
      };
      setupEditHandler(post.id);
      setupDeleteHandler(post.id);
    });
}

function setupEditHandler(postId) {
  const editForm = document.getElementById("edit-post-form");
  editForm.onsubmit = e => {
    e.preventDefault();
    const updatedPost = {
      title: editForm.querySelector('#edit-title').value,
      content: editForm.querySelector('#edit-content').value
    };
    fetch(`http://localhost:3000/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    })
      .then(res => res.json())
      .then(data => {
        displayPosts();
        showPost(data.id);
        editForm.style.display = "none";
      });
  };
}

function setupDeleteHandler(postId) {
  const deleteButton = document.getElementById("delete-button");
  deleteButton.onclick = () => {
    fetch(`http://localhost:3000/posts/${postId}`, {
      method: "DELETE",
    }).then(() => {
      displayPosts();
      const detail = document.getElementById("post-detail");
      detail.innerHTML = "<h2>Post Deleted</h2>";
    });
  };
}

function setupForm() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const newPost = {
      title: form.title.value,
      author: form.author.value,
      content: form.content.value
    };
    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(savedPost => {
        const div = document.createElement("div");
        div.textContent = savedPost.title;
        div.dataset.id = savedPost.id;
        div.addEventListener("click", () => showPost(savedPost.id));
        document.getElementById("post-list").appendChild(div);
        form.reset();
      });
  });
}

function main() {
  displayPosts();
  setupForm();
}

document.addEventListener("DOMContentLoaded", main);
