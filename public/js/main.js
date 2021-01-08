const registerForm = document.querySelector('.register-form');
const loginForm = document.querySelector('.login-form');
const imagePostForm = document.querySelector('.imagepost-form');
const postContainer = document.querySelector('.uploaded-image-post');
const status = document.querySelector('.status');
const userList = document.querySelector('.users-list');

const templates = getTemplates();
const loggedInUser = setStatus();

registerForm.addEventListener('submit', registerUser);
loginForm.addEventListener('submit', login);
imagePostForm.addEventListener('submit', createImagePost);

/**
 * @returns {object}
 */
function getTemplates() {
  const templates = {};
  document.querySelectorAll('script[type="text/mustache"]').forEach(template => {
    const name = template.id.replace('template-', '');
    templates[name] = template.innerHTML;
  });
  return templates;
}

/**
 * @returns {object} the logged in user
 */
async function setStatus() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  if (user) {
    status.innerHTML = 'You are logged in as ' + user.username;
    const {users} = await apiCall('/users?pageSize=5');
    if (users) {
      userList.innerHTML = Mustache.render(templates['users-list'], {users});
    }
  }
  return user;
}

/**
 * @param {HTMLFormElement} form 
 * @returns {string} urlencoded string
 */
function serializeForm(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

async function registerUser(event) {
  event.preventDefault();
  const response = await apiCall('/users', {
    method: 'POST',
    body: serializeForm(registerForm)
  });
  const {status, user} = response;
  if (status === 'success') {
    alert(JSON.stringify(user, null, 2));
  }
}

async function login(event) {
  event.preventDefault();
  const response = await apiCall('/login', {
    method: 'POST',
    body: serializeForm(loginForm),
  });
  const {status, user} = response;
  if (status === 'success' && user) {
    localStorage.setItem('user', JSON.stringify(user));
    await setStatus();
  }
}

async function createImagePost(event) {
  event.preventDefault();
  const response = await apiCall(`/users/${loggedInUser.id}/imageposts`, {
    method: 'POST',
    body: new FormData(imagePostForm),
  });
  const {status, post} = response;
  if (status === 'success' && post) {
    postContainer.innerHTML = Mustache.render(templates['image-post'], post);
  }
}

/**
 * @param {string} path 
 * @param {object} [options] fetch options
 * @param {string} [options.type] content type
 * @returns {Promise<object>} JSON response
 */
async function apiCall(path, options = {}) {
  let {type, ...opts} = options;
  const fetchOptions = {
    credentials: 'same-origin',
    headers: {},
    ...opts
  };
  const {body} = fetchOptions;
  if (!type && body && typeof body === 'string') {
    type = 'application/x-www-form-urlencoded';
  }
  if (type) {
    fetchOptions.headers['Content-Type'] = type;
  }
  const response = await fetch(`/api${path}`, fetchOptions);
  const json = await response.json();
  return json;
}

