document.addEventListener("DOMContentLoaded", main);
const API = "http://localhost:3000/posts";
const listDiv = document.getElementById("post-list");
const detailDiv = document.getElementById("post-detail");
const editBtn = document.getElementById("edit-button");
const deleteBtn = document.getElementById("delete-button");
const editForm = document.getElementById("edit-post-form");
const cancelBtn = document.getElementById("cancel-edit");

async function main() {
  await displayPosts();
  setupForm();
}

async function displayPosts() {
  const res = await fetch(API);
  const posts = await res.json();
  listDiv.innerHTML = "";
  posts.forEach((post, i) => {
    const div = document.createElement("div");
    div.textContent = post.title;
    div.className = "item";
    div.onclick = () => showPost(post.id);
    listDiv.appendChild(div);
    if (i === 0) showPost(post.id);
  });
}

async function showPost(id) {
  const res = await fetch(`${API}/${id}`);
  const post = await res.json();

  listDiv.querySelectorAll(".item").forEach(el =>
    el.classList.toggle("active", el.textContent === post.title)
  );
  detailDiv.querySelector("h2").textContent = post.title;
  detailDiv.querySelectorAll("p").forEach(p => p.remove());
  detailDiv.insertAdjacentHTML("beforeend", `<p>${post.content}</p><p><strong>Author:</strong> ${post.author}</p>`);

  editBtn.classList.remove("hidden");
  editBtn.classList.add("inline-block");
  deleteBtn.classList.remove("hidden");
  deleteBtn.classList.add("inline-block");

  editForm.classList.add("hidden");
  editForm["edit-title"].value = post.title;
  editForm["edit-content"].value = post.content;

  editBtn.onclick = () => editForm.classList.remove("hidden");
  cancelBtn.onclick = () => editForm.classList.add("hidden");

  setupEditHandler(id);
  setupDeleteHandler(id);
}

function setupForm() {
  document.getElementById("new-post-form").onsubmit = async e => {
    e.preventDefault();
    const data = { title: e.target.title.value, author: e.target.author.value, content: e.target.content.value };
    const res = await fetch(API, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(data) });
    const newPost = await res.json();
    displayPosts();
    e.target.reset();
  };
}

function setupEditHandler(id) {
  editForm.onsubmit = async e => {
    e.preventDefault();
    const data = { title: editForm["edit-title"].value, content: editForm["edit-content"].value };
    await fetch(`${API}/${id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify(data) });
    editForm.classList.add("hidden");
    showPost(id);
  };
}

function setupDeleteHandler(id) {
  deleteBtn.onclick = async () => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    await displayPosts();
    detailDiv.querySelector("h2").textContent = "Select a post";
    detailDiv.querySelectorAll("p").forEach(p => p.remove());
    editBtn.classList.add("hidden");
    editBtn.classList.remove("inline-block");
    deleteBtn.classList.add("hidden");
    deleteBtn.classList.remove("inline-block");
    editForm.classList.add("hidden");
  };
}

